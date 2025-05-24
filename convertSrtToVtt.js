/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

/**
 * Parsea un timestamp SRT (ej: "00:01:20,500") a milisegundos
 */
function parseSrtTimestamp(timestamp) {
  const [hms, ms] = timestamp.split(',');
  const [h, m, s] = hms.split(':').map(Number);
  return h * 3600000 + m * 60000 + s * 1000 + Number(ms);
}

/**
 * Convierte milisegundos a timestamp WebVTT (ej: "00:01:20.500")
 */
function formatVttTimestamp(ms) {
  if (ms < 0) ms = 0;
  const hours = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const milliseconds = String(ms % 1000).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * Convierte el contenido de un .srt a .vtt con desfase preciso
 */
function convertSrtToVtt(srtContent, offsetMs = 0) {
  const lines = srtContent.split(/\r?\n/);
  const vttLines = ['WEBVTT\n'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const timestampRegex = /^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/;

    if (timestampRegex.test(line)) {
      const [, startStr, endStr] = line.match(timestampRegex);
      const startMs = parseSrtTimestamp(startStr) + offsetMs;
      const endMs = parseSrtTimestamp(endStr) + offsetMs;

      const startVtt = formatVttTimestamp(startMs);
      const endVtt = formatVttTimestamp(endMs);

      vttLines.push(`${startVtt} --> ${endVtt}`);
    } else {
      vttLines.push(line);
    }
  }

  return vttLines.join('\n');
}

/**
 * Procesa un archivo .srt y guarda el .vtt ajustado
 */
function convertFile(srtPath, outputDir, offsetMs = 0) {
  const resolvedPath = path.resolve(srtPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Archivo no encontrado: ${resolvedPath}`);
    process.exit(1);
  }

  const srtContent = fs.readFileSync(resolvedPath, 'utf-8');
  const vttContent = convertSrtToVtt(srtContent, offsetMs);

  const baseName = path.basename(srtPath, '.srt');
  const outputPath = path.resolve(outputDir || path.dirname(resolvedPath), `${baseName}.vtt`);

  fs.writeFileSync(outputPath, vttContent, 'utf-8');
  console.log(`✅ Convertido correctamente: ${outputPath}`);
}

// CLI usage
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('❌ Uso: node convertSrtToVtt.js <archivo.srt> [directorio-salida] [offsetMs]');
  process.exit(1);
}

const [inputPath, outputDir, offsetStr] = args;
const offsetMs = parseInt(offsetStr || '0', 10);
convertFile(inputPath, outputDir, offsetMs);
