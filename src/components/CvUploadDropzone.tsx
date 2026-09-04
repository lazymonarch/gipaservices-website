"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_CV_BYTES = 5 * 1024 * 1024;
const VALID_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const VALID_CV_EXTENSIONS = [".pdf", ".doc", ".docx"];
const CV_ERROR_MESSAGE =
  "Upload failed — Please select a PDF, DOC or DOCX file under 5MB.";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAcceptedCv(file: File) {
  const name = file.name.toLowerCase();
  const extensionOk = VALID_CV_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (!extensionOk) return false;
  if (file.size > MAX_CV_BYTES) return false;
  if (file.type && !VALID_CV_TYPES.includes(file.type)) return false;
  return true;
}

function assignFileToInput(input: HTMLInputElement, file: File | null) {
  const transfer = new DataTransfer();
  if (file) transfer.items.add(file);
  input.files = transfer.files;
}

type CvUploadDropzoneProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  className?: string;
};

export default function CvUploadDropzone({
  file,
  onFileChange,
  className,
}: CvUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file]);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!isAcceptedCv(uploadedFile)) {
      setError(CV_ERROR_MESSAGE);
      if (inputRef.current) assignFileToInput(inputRef.current, file);
      return;
    }

    setError(null);
    onFileChange(uploadedFile);
  };

  const handleRemove = () => {
    setError(null);
    onFileChange(null);
    if (inputRef.current) assignFileToInput(inputRef.current, null);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name="cvFile"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className={cn(
          "w-full rounded-gipa border-2 border-dashed px-4 py-8 text-center transition",
          error ? "border-red-400" : "border-slate-300 hover:border-[#F5C518]/70",
          className,
        )}
      >
        {file ? (
          <div className="flex flex-col items-center gap-4">
            <p className="break-all text-sm font-medium text-slate-900">
              ✓ {file.name} — {formatFileSize(file.size)}
            </p>
            {error ? (
              <p className="text-xs text-red-500" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={openPicker}
                className="inline-flex min-h-11 items-center justify-center rounded-gipa border border-[#1C1C1C]/15 px-4 text-sm font-semibold text-[#1C1C1C] transition hover:border-[#F5C518]"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex min-h-11 items-center justify-center rounded-gipa px-4 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="w-full"
          >
            <Upload className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            {error ? (
              <p className="mt-2 text-sm font-medium text-red-500" role="alert">
                {error}
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Click to upload your CV
                </p>
                <p className="mt-1 text-xs text-slate-500">PDF, DOC, DOCX — Max 5MB</p>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
