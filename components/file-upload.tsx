"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { Upload, X, FileText } from "lucide-react"

interface FileUploadProps {
  bucket?: string
  folder?: string
  onUploadComplete: (url: string, fileData: any) => void
  acceptedFileTypes?: string
  maxSizeMB?: number
  className?: string
}

export function FileUpload({
  bucket = "documents",
  folder = "",
  onUploadComplete,
  acceptedFileTypes = "*",
  maxSizeMB = 5,
  className = "",
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const { t } = useLanguage()

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (selectedFile: File) => {
    setError(null)

    // Check file type if specified
    if (acceptedFileTypes !== "*") {
      const fileType = selectedFile.type
      const acceptedTypes = acceptedFileTypes.split(",").map((type) => type.trim())

      if (!acceptedTypes.some((type) => fileType.match(type))) {
        setError(t("invalidFileType") || "Invalid file type")
        return
      }
    }

    // Check file size
    if (selectedFile.size > maxSizeBytes) {
      setError(t("fileTooLarge", { size: maxSizeMB }) || `File too large (max ${maxSizeMB}MB)`)
      return
    }

    setFile(selectedFile)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        validateAndSetFile(e.dataTransfer.files[0])
      }
    },
    [maxSizeBytes, acceptedFileTypes],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const uploadFile = async () => {
    if (!file) return

    try {
      setUploading(true)
      setProgress(0)

      // Simulate a local upload for now
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      await new Promise(resolve => setTimeout(resolve, 1100))

      // Create a mock local URL
      const mockUrl = `/uploads/${bucket}/${folder}/${Date.now()}_${file.name}`

      // Call the completion handler with the mock URL and file metadata
      onUploadComplete(mockUrl, {
        name: file.name,
        size: file.size,
        type: file.type,
        path: mockUrl,
      })

      // Reset state
      setFile(null)
    } catch (error: any) {
      setError(error.message || t("uploadFailed") || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const cancelUpload = () => {
    setFile(null)
    setError(null)
  }

  return (
    <div className={`w-full ${className}`}>
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} accept={acceptedFileTypes} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium">{t("dragDropOrClick") || "Drag & drop or click to upload"}</p>
          <p className="mt-1 text-xs text-gray-500">
            {acceptedFileTypes !== "*"
              ? t("acceptedFileTypes", { types: acceptedFileTypes.replace(/\*/g, "") }) || `Accepted types: ${acceptedFileTypes}`
              : t("allFileTypes") || "All file types accepted"}
          </p>
          <p className="text-xs text-gray-500">{t("maxFileSize", { size: maxSizeMB }) || `Max size: ${maxSizeMB}MB`}</p>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
            </div>
            {!uploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  cancelUpload()
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center">{progress}%</p>
            </div>
          ) : (
            <div className="flex justify-end mt-2">
              <Button onClick={uploadFile} size="sm">
                {t("upload") || "Upload"}
              </Button>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
