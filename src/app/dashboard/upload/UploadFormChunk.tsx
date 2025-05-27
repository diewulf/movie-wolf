/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface FileUploadProps {
  onUploadComplete?: (fileName: string) => void;
  maxFileSize?: number; // en bytes, default 20GB
}

export default function FileUpload({
  onUploadComplete,
  maxFileSize = 20 * 1024 * 1024 * 1024, // 20GB
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [movieName, setMovieName] = useState<string>('');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  const sanitizeMovieName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales excepto espacios y guiones
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxFileSize) {
      console.log(
        `Error: El archivo ${file.name} excede el tamaño máximo permitido de ${formatFileSize(maxFileSize)}`,
      );
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    if (!movieName.trim()) {
      console.log('Error: Debe ingresar un nombre para la película');
      return;
    }

    const sanitizedName = sanitizeMovieName(movieName);
    if (!sanitizedName) {
      console.log('Error: El nombre de la película no es válido');
      return;
    }

    setIsUploading(true);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

    // Crear AbortController para poder cancelar el upload
    abortControllerRef.current = new AbortController();

    try {
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);

      console.log(
        `Iniciando upload de ${file.name} (${formatFileSize(file.size)}) en ${totalChunks} chunks`,
      );
      console.log(`Carpeta destino: ${sanitizedName}`);

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('fileName', file.name);
        formData.append('movieName', sanitizedName);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('fileSize', file.size.toString());

        const response = await fetch('/api/upload-chunk', {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `Error en chunk ${chunkIndex + 1}`,
          );
        }

        // Actualizar progreso
        const loaded = end;
        const percentage = Math.round((loaded / file.size) * 100);
        setUploadProgress({ loaded, total: file.size, percentage });

        console.log(
          `Chunk ${chunkIndex + 1}/${totalChunks} completado (${percentage}%)`,
        );
      }

      console.log(
        `Upload completado: ${file.name} en carpeta ${sanitizedName}`,
      );
      onUploadComplete?.(file.name);
      setSelectedFile(null);
      setMovieName('');
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Upload cancelado por el usuario');
      } else {
        console.log('Error durante el upload:', error.message);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
      abortControllerRef.current = null;
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      console.log(
        `Archivo seleccionado: ${file.name} (${formatFileSize(file.size)})`,
      );
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      console.log(
        `Archivo seleccionado: ${file.name} (${formatFileSize(file.size)})`,
      );
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFile(selectedFile);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Zona de Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="text-6xl text-gray-400">📁</div>
          <div>
            <p className="text-lg font-medium text-white hover:text-black">
              {isDragging
                ? 'Suelta el archivo aquí'
                : 'Arrastra un archivo o haz clic para seleccionar'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cualquier tipo de archivo, hasta {formatFileSize(maxFileSize)}
            </p>
          </div>
        </div>
      </div>

      {/* Campo de Nombre de Película */}
      <div className="mt-6">
        <label
          htmlFor="movieName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nombre de la Película
        </label>
        <input
          id="movieName"
          type="text"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          placeholder="Ej: Mi Película Favorita"
          disabled={isUploading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {movieName && (
          <p className="text-xs text-gray-500 mt-1">
            Carpeta:{' '}
            <code className="bg-gray-100 px-1 rounded">
              {sanitizeMovieName(movieName)}
            </code>
          </p>
        )}
      </div>

      {/* Archivo Seleccionado */}
      {selectedFile && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            {!isUploading && (
              <button
                onClick={handleRemoveFile}
                className="ml-4 text-red-500 hover:text-red-700 text-xl"
              >
                ✕
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subiendo...</span>
                <span>{uploadProgress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>
                  {formatFileSize(uploadProgress.loaded)} /{' '}
                  {formatFileSize(uploadProgress.total)}
                </span>
                <span>
                  {uploadProgress.total > 0 &&
                    `${Math.round((uploadProgress.loaded / uploadProgress.total) * 100)}% completado`}
                </span>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="mt-4 flex gap-3">
            {!isUploading ? (
              <button
                onClick={handleUpload}
                disabled={!movieName.trim()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  movieName.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Subir Archivo
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
