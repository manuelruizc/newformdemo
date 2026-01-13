"use client";
import React, {
  useState,
  DragEvent,
  ChangeEvent,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Upload, X, File, Image, FileText } from "lucide-react";
import { trpc } from "@/utils/trpc";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

function FileDragAndDrop({
  accept = [],
  onHandleFiles,
}: {
  accept?: string[];
  onHandleFiles?: (files: UploadedFile[]) => void;
}): React.ReactElement {
  const filesRef = useRef<UploadedFile[]>([]);
  const [numberOfFiles, setNumberOfFiles] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const uploadedFile: UploadedFile = {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
      };
      if (!file.type.startsWith("video")) {
        console.error("Not a video");
        continue;
      }
      if (!file.type.endsWith("mp4") && !file.type.endsWith("webm")) {
        console.error("Not a video format supported");
        continue;
      }

      newFiles.push(uploadedFile);
      if (onHandleFiles) {
        onHandleFiles(newFiles);
      }
    }

    filesRef.current = [...filesRef.current, ...newFiles];
    setNumberOfFiles(filesRef.current.length);
  };

  const removeFile = (id: string) => {
    filesRef.current = filesRef.current.filter((f) => f.id !== id);
    setNumberOfFiles(filesRef.current.length);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="w-6 h-6" />;
    if (fileType.startsWith("text/") || fileType.includes("pdf"))
      return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };
  const ACCEPT = useMemo(() => {
    let str = "";
    for (const fileType of accept) {
      str += `${fileType}, `;
    }
    return str;
  }, [accept]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          File Upload
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Drag and drop files or click to browse
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50"
          }`}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            id="fileInput"
            type="file"
            accept={ACCEPT}
            multiple
            onChange={handleFileInput}
            className="hidden"
          />

          <Upload
            className={`w-16 h-16 mx-auto mb-4 ${
              isDragging ? "text-blue-500" : "text-gray-400"
            }`}
          />

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {isDragging ? "Drop your content" : "Drag & Drop your videos here"}
          </h3>
          <p className="text-gray-500">or click to browse from your computer</p>
        </div>

        {numberOfFiles > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Uploaded Files ({numberOfFiles})
            </h2>
            <div className="space-y-3">
              {filesRef.current.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  {/* Preview or Icon */}
                  <div className="flex-shrink-0">
                    {uploadedFile.preview ? (
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.file.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        {getFileIcon(uploadedFile.file.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">
                      {uploadedFile.file.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadedFile.file.size)} •{" "}
                      {uploadedFile.file.type || "Unknown type"}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="flex-shrink-0 p-2 hover:bg-red-50 rounded-full transition-colors group"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear All Button */}
            <button
              onClick={() => {
                filesRef.current = [];
                setNumberOfFiles(0);
              }}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileDragAndDrop;
