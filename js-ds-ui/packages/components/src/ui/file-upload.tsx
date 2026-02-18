'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface FileUploadFile {
  file: File;
  id: string;
  preview?: string;
}

export interface FileUploadProps {
  /** Called when files are selected or dropped */
  onFilesChange?: (files: FileUploadFile[]) => void;
  /** Accepted file types (e.g., "image/*,.pdf") */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Descriptive text */
  description?: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * FileUpload component — drag-and-drop file upload with preview
 *
 * @example
 * ```tsx
 * <FileUpload
 *   accept="image/*"
 *   multiple
 *   maxSize={5 * 1024 * 1024}
 *   onFilesChange={(files) => console.log(files)}
 *   description="PNG, JPG up to 5MB"
 * />
 * ```
 */
const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      onFilesChange,
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      disabled = false,
      className,
      description,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<FileUploadFile[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const processFiles = React.useCallback(
      (fileList: FileList | File[]) => {
        setError(null);
        const newFiles: FileUploadFile[] = [];

        const incoming = Array.from(fileList);

        for (const file of incoming) {
          if (maxSize && file.size > maxSize) {
            setError(`File "${file.name}" exceeds ${formatFileSize(maxSize)} limit.`);
            continue;
          }

          const uploadFile: FileUploadFile = {
            file,
            id: generateId(),
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          };
          newFiles.push(uploadFile);
        }

        const updated = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1);
        const limited = maxFiles ? updated.slice(0, maxFiles) : updated;

        setFiles(limited);
        onFilesChange?.(limited);
      },
      [files, multiple, maxSize, maxFiles, onFilesChange]
    );

    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        processFiles(e.dataTransfer.files);
      },
      [disabled, processFiles]
    );

    const handleDragOver = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      },
      [disabled]
    );

    const handleDragLeave = React.useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          processFiles(e.target.files);
        }
      },
      [processFiles]
    );

    const handleRemove = React.useCallback(
      (id: string) => {
        const file = files.find((f) => f.id === id);
        if (file?.preview) URL.revokeObjectURL(file.preview);
        const updated = files.filter((f) => f.id !== id);
        setFiles(updated);
        onFilesChange?.(updated);
      },
      [files, onFilesChange]
    );

    // Cleanup previews on unmount
    React.useEffect(() => {
      return () => {
        files.forEach((f) => {
          if (f.preview) URL.revokeObjectURL(f.preview);
        });
      };
    }, []);

    return (
      <div ref={ref} className={cn('flex flex-col gap-3', className)} {...props}>
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-[var(--component-file-upload-border-radius,0.375rem)] border-2 border-dashed px-6 py-8 text-center transition-colors',
            isDragging
              ? 'border-[var(--color-interactive-primary)] bg-[var(--color-interactive-primary)]/5'
              : 'border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-background-secondary)]',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <svg className="mb-3 h-10 w-10 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="[font-size:var(--component-file-upload-font-size)] [font-weight:var(--component-file-upload-font-weight)] text-[var(--color-text-primary)]">
            {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          {description && (
            <p className="mt-1 [font-size:var(--component-file-upload-description-font-size)] text-[var(--color-text-tertiary)]">
              {description}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
            aria-label="File upload"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="[font-size:var(--component-file-upload-font-size)] text-[var(--color-text-error)]" role="alert">
            {error}
          </p>
        )}

        {/* File list */}
        {files.length > 0 && (
          <ul className="flex flex-col gap-2" role="list">
            {files.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-[var(--component-file-upload-border-radius,0.375rem)] border border-[var(--color-border-default)] p-2"
              >
                {/* Preview */}
                {f.preview ? (
                  <img src={f.preview} alt={f.file.name} className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--color-background-secondary)]">
                    <svg className="h-5 w-5 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                )}
                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate [font-size:var(--component-file-upload-font-size)] [font-weight:var(--component-file-upload-font-weight)] text-[var(--color-text-primary)]">
                    {f.file.name}
                  </p>
                  <p className="[font-size:var(--component-file-upload-description-font-size)] text-[var(--color-text-tertiary)]">
                    {formatFileSize(f.file.size)}
                  </p>
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(f.id); }}
                  className="shrink-0 rounded p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-error)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
                  aria-label={`Remove ${f.file.name}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };
