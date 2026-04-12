"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, Image, File, CheckCircle2, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  url?: string;
  error?: string;
}

interface FileUploadProps {
  onFilesChange: (urls: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string[];
  className?: string;
}

const ALLOWED_TYPES = ["application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain", "image/png", "image/jpeg", "image/jpg", "image/webp"];

const ALLOWED_EXT_LABEL = "PDF, DOCX, TXT, PNG, JPG";

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  if (type === "application/pdf" || type.includes("word") || type === "text/plain") return FileText;
  return File;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Component ────────────────────────────────────────────────────────────

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 50,
  accept = ALLOWED_TYPES,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!accept.includes(file.type)) {
        return `File type not allowed. Accepted: ${ALLOWED_EXT_LABEL}`;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File too large. Max size: ${maxSizeMB}MB`;
      }
      return null;
    },
    [accept, maxSizeMB]
  );

  const simulateUpload = useCallback(
    (id: string) => {
      // Simulate upload progress — replace with real presigned URL upload in production
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 5;
        if (progress >= 100) {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? { ...f, progress: 100, status: "done", url: `/uploads/${id}_${f.file.name}` }
                : f
            )
          );
          // Notify parent with the (mock) URLs
          setFiles((current) => {
            const doneFiles = current.filter((f) => f.status === "done" && f.url);
            onFilesChange(doneFiles.map((f) => f.url!));
            return current;
          });
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, progress: Math.min(progress, 99), status: "uploading" } : f
            )
          );
        }
      }, 200);
    },
    [onFilesChange]
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      setDragError(undefined);
      const arr = Array.from(incoming);
      const remaining = maxFiles - files.length;
      if (remaining <= 0) {
        setDragError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      const toAdd = arr.slice(0, remaining);

      const newFiles: UploadedFile[] = [];
      for (const file of toAdd) {
        const err = validateFile(file);
        const id = Math.random().toString(36).slice(2);
        const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
        newFiles.push({ file, id, preview, status: err ? "error" : "pending", progress: 0, error: err ?? undefined });
      }

      setFiles((prev) => [...prev, ...newFiles]);

      // Kick off upload for valid files
      newFiles.filter((f) => !f.error).forEach((f) => {
        setFiles((prev) =>
          prev.map((p) => (p.id === f.id ? { ...p, status: "uploading" } : p))
        );
        simulateUpload(f.id);
      });
    },
    [files.length, maxFiles, validateFile, simulateUpload]
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== id);
        onFilesChange(next.filter((f) => f.status === "done" && f.url).map((f) => f.url!));
        return next;
      });
    },
    [onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-accent bg-accent-surface scale-[1.01] shadow-glow-accent"
            : "border-card-border hover:border-card-border-hover hover:bg-surface/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept.join(",")}
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        <motion.div
          animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? "bg-accent/20" : "bg-surface"
          }`}
        >
          <Upload className={`w-6 h-6 ${isDragging ? "text-accent-light" : "text-foreground-muted"}`} />
        </motion.div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium">
            <span className="text-accent-light">Click to upload</span>{" "}
            <span className="text-foreground-muted">or drag and drop</span>
          </p>
          <p className="text-xs text-foreground-subtle">
            {ALLOWED_EXT_LABEL} · Max {maxSizeMB}MB · Up to {maxFiles} files
          </p>
        </div>
      </div>

      {/* Drag error */}
      <AnimatePresence>
        {dragError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-error flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {dragError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f) => {
              const Icon = getFileIcon(f.file.type);
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    f.status === "error"
                      ? "border-error/25 bg-error/5"
                      : f.status === "done"
                      ? "border-success/20 bg-success/5"
                      : "border-card-border bg-surface/20"
                  }`}
                >
                  {f.preview ? (
                    <img src={f.preview} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4.5 h-4.5 text-foreground-muted" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.file.name}</p>
                    {f.error ? (
                      <p className="text-xs text-error">{f.error}</p>
                    ) : (
                      <div className="space-y-1 mt-1">
                        <p className="text-xs text-foreground-subtle">
                          {formatSize(f.file.size)}
                          {f.status === "uploading" && ` · ${Math.round(f.progress)}%`}
                          {f.status === "done" && " · Uploaded"}
                        </p>
                        {f.status === "uploading" && (
                          <div className="xp-bar-track h-1">
                            <motion.div
                              className="xp-bar-fill h-1"
                              initial={{ width: 0 }}
                              animate={{ width: `${f.progress}%` }}
                              transition={{ ease: "linear" }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {f.status === "done" && <CheckCircle2 className="w-4 h-4 text-success" />}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                      className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-error/10 hover:text-error text-foreground-subtle transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
