import { type NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink, readFile } from 'fs/promises';
import { createWriteStream, existsSync, statSync } from 'fs';
import path from 'path';

const BASE_UPLOAD_DIR = path.join(process.cwd(), 'public/films');

// Sanitizar nombre de película
function sanitizeMovieName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales excepto espacios y guiones
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
}

// Asegurar que los directorios existen
async function ensureDirectories(movieName: string) {
  const sanitizedMovieName = sanitizeMovieName(movieName);
  const movieDir = path.join(BASE_UPLOAD_DIR, sanitizedMovieName);
  const tempDir = path.join(movieDir, 'temp');

  if (!existsSync(BASE_UPLOAD_DIR)) {
    await mkdir(BASE_UPLOAD_DIR, { recursive: true });
  }
  if (!existsSync(movieDir)) {
    await mkdir(movieDir, { recursive: true });
  }
  if (!existsSync(tempDir)) {
    await mkdir(tempDir, { recursive: true });
  }

  return { movieDir, tempDir };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File;
    const fileName = formData.get('fileName') as string;
    const movieName = formData.get('movieName') as string;
    const chunkIndex = Number.parseInt(formData.get('chunkIndex') as string);
    const totalChunks = Number.parseInt(formData.get('totalChunks') as string);
    const fileSize = Number.parseInt(formData.get('fileSize') as string);

    if (!chunk || !fileName || !movieName) {
      console.log('Error: Faltan datos requeridos en el chunk');
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 },
      );
    }

    const { movieDir, tempDir } = await ensureDirectories(movieName);

    // Crear nombre único para evitar conflictos
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const tempFileName = `${safeFileName}.part${chunkIndex}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    // Guardar el chunk
    const bytes = await chunk.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempFilePath, buffer);

    console.log(
      `Chunk ${chunkIndex + 1}/${totalChunks} guardado: ${tempFileName}`,
    );

    // Si es el último chunk, ensamblar el archivo completo
    if (chunkIndex === totalChunks - 1) {
      console.log(
        `Ensamblando archivo completo: ${safeFileName} en carpeta ${sanitizeMovieName(movieName)}`,
      );

      const finalFilePath = path.join(movieDir, safeFileName);

      try {
        const writeStream = createWriteStream(finalFilePath);

        // Ensamblar chunks secuencialmente
        for (let i = 0; i < totalChunks; i++) {
          const chunkPath = path.join(tempDir, `${safeFileName}.part${i}`);

          if (!existsSync(chunkPath)) {
            throw new Error(`Chunk ${i} no encontrado: ${chunkPath}`);
          }

          // Leer chunk y escribir al archivo final
          const chunkData = await readFile(chunkPath);

          await new Promise<void>((resolve, reject) => {
            writeStream.write(chunkData, (error) => {
              if (error) {
                console.log(`Error escribiendo chunk ${i}:`, error);
                reject(error);
              } else {
                resolve();
              }
            });
          });

          console.log(`Chunk ${i + 1}/${totalChunks} ensamblado`);
        }

        // Cerrar el stream y esperar a que termine
        await new Promise<void>((resolve, reject) => {
          writeStream.end((error) => {
            if (error) {
              console.log('Error cerrando writeStream:', error);
              reject(error);
            } else {
              resolve();
            }
          });
        });

        // Verificar que el archivo existe y tiene el tamaño correcto
        if (!existsSync(finalFilePath)) {
          throw new Error('El archivo final no fue creado');
        }

        const finalStats = statSync(finalFilePath);
        console.log(
          `Archivo final creado: ${finalStats.size} bytes (esperado: ${fileSize})`,
        );

        if (finalStats.size !== fileSize) {
          await unlink(finalFilePath); // Limpiar archivo incorrecto
          throw new Error(
            `Tamaño incorrecto. Esperado: ${fileSize}, Actual: ${finalStats.size}`,
          );
        }

        // Limpiar archivos temporales
        const cleanupPromises = [];
        for (let i = 0; i < totalChunks; i++) {
          const chunkPath = path.join(tempDir, `${safeFileName}.part${i}`);
          cleanupPromises.push(
            unlink(chunkPath).catch((error) =>
              console.log(`Error eliminando chunk temporal ${i}:`, error),
            ),
          );
        }
        await Promise.all(cleanupPromises);

        // Eliminar la carpeta temp después de limpiar todos los chunks
        try {
          const { rmdir } = await import('fs/promises');
          await rmdir(tempDir);
          console.log('Carpeta temporal eliminada exitosamente');
        } catch (tempDirError) {
          console.log(
            'Error eliminando carpeta temporal (puede estar en uso):',
            tempDirError.message,
          );
        }

        console.log(
          `✅ Archivo completado exitosamente: ${safeFileName} en ${movieDir}`,
        );

        return NextResponse.json({
          message: 'Archivo subido exitosamente',
          fileName: safeFileName,
          movieName: sanitizeMovieName(movieName),
          size: finalStats.size,
          path: `public/films/${sanitizeMovieName(movieName)}/${safeFileName}`,
        });
      } catch (error) {
        console.log('Error ensamblando archivo:', error);

        // Limpiar archivo parcial en caso de error
        try {
          if (existsSync(finalFilePath)) {
            await unlink(finalFilePath);
            console.log('Archivo parcial eliminado');
          }
        } catch (cleanupError) {
          console.log('Error limpiando archivo parcial:', cleanupError);
        }

        // Limpiar chunks temporales y carpeta temp
        try {
          for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(tempDir, `${safeFileName}.part${i}`);
            if (existsSync(chunkPath)) {
              await unlink(chunkPath);
            }
          }

          // Intentar eliminar la carpeta temp
          const { rmdir } = await import('fs/promises');
          await rmdir(tempDir);
          console.log('Carpeta temporal eliminada después del error');
        } catch (cleanupError) {
          console.log(
            'Error limpiando chunks temporales y carpeta temp:',
            cleanupError.message,
          );
        }

        return NextResponse.json(
          {
            error: `Error ensamblando archivo: ${error.message}`,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      message: `Chunk ${chunkIndex + 1}/${totalChunks} recibido`,
      chunkIndex,
      totalChunks,
      movieName: sanitizeMovieName(movieName),
    });
  } catch (error) {
    console.log('Error en API upload:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
