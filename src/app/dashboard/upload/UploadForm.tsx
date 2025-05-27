'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [movieName, setMovieName] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file || !movieName.trim()) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', movieName.trim());

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setStatus('✅ Archivo subido correctamente');
    } else {
      setStatus('❌ Error al subir archivo');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Nombre de la película"
        value={movieName}
        onChange={(e) => setMovieName(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Subir
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
