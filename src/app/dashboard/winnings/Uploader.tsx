'use client'

import { useState, useRef } from 'react'
import { UploadCloud, FileImage, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadProofAction } from './actions'

export function Uploader({ winnerId }: { winnerId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0]
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const onSubmit = async () => {
    if (!file) return
    setIsUploading(true)

    // For a real app, you'd upload directly to Supabase Storage here via client
    // or pass FormData to a server action.
    const formData = new FormData()
    formData.append('file', file)
    formData.append('winnerId', winnerId)

    try {
      await uploadProofAction(formData)
    } catch (e) {
      console.error(e)
    } finally {
      setIsUploading(false)
    }
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
          <img src={preview} alt="Proof preview" className="w-full h-48 object-cover" />
          <Button 
            size="icon" 
            variant="destructive" 
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={() => { setFile(null); setPreview(null) }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={onSubmit} className="w-full bg-blue-600 hover:bg-blue-700" disabled={isUploading}>
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? 'Uploading...' : 'Submit Proof'}
        </Button>
      </div>
    )
  }

  return (
    <div 
      className="border-2 border-dashed border-blue-200 dark:border-blue-900 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <UploadCloud className="h-8 w-8 text-blue-500 mb-2" />
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click or drag image to upload</p>
      <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
    </div>
  )
}
