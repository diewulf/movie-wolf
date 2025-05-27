import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function sanitizeName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['"“”‘’]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get('file') as File;
  const rawName = formData.get('name') as string;

  if (!file || !rawName) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const sanitized = sanitizeName(rawName);

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || '.bin'; // ✅ usa extensión original

  const baseDir = path.join(process.cwd(), 'public', 'films', sanitized);
  if (!existsSync(baseDir)) mkdirSync(baseDir, { recursive: true });

  const finalFilename = `${sanitized}${ext}`;
  const filePath = path.join(baseDir, finalFilename);

  await fs.promises.writeFile(filePath, fileBuffer);

  const publicUrl = `/films/${sanitized}/${finalFilename}`;

  return NextResponse.json({
    success: true,
    filename: finalFilename,
    path: publicUrl,
  });
}
