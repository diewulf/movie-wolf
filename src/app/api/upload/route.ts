import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Limpia el nombre para usarlo como carpeta/archivo
function sanitizeName(name: string) {
  return name
    .normalize('NFD') // elimina tildes
    .replace(/[\u0300-\u036f]/g, '') // marcas diacríticas
    .replace(/['"“”‘’]/g, '') // comillas
    .toLowerCase()
    .replace(/\s+/g, '-') // espacios → guiones
    .replace(/[^a-z0-9\-]/g, '') // solo letras/números/guiones
    .replace(/\-+/g, '-') // colapsa guiones
    .replace(/^-+|-+$/g, ''); // remueve guiones extremos
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const rawName = formData.get('name') as string;

  if (!file || !rawName) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const sanitized = sanitizeName(rawName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // Ruta base: public/films/[nombre-pelicula]
  const movieDir = path.join(process.cwd(), 'public', 'films', sanitized);
  if (!existsSync(movieDir)) mkdirSync(movieDir, { recursive: true });

  const ext = file.name.split('.').pop() || 'bin';
  const filename = `${sanitized}.${ext}`;
  const filePath = path.join(movieDir, filename);

  await writeFile(filePath, fileBuffer);

  const publicPath = `/films/${sanitized}/${filename}`;

  return NextResponse.json({
    success: true,
    filename,
    path: publicPath,
  });
}
