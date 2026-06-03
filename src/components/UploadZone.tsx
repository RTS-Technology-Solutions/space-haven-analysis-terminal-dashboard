import { useState, useRef } from 'react'
import './UploadZone.css'

interface UploadZoneProps {
  onFileUpload: (file: File) => void
}

// Validate if the file content is valid XML
const isValidXML = async (file: File): Promise<boolean> => {
  try {
    const text = await file.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'text/xml')
    
    // Check for parser errors
    const parseError = xmlDoc.getElementsByTagName('parsererror')
    if (parseError.length > 0) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('XML validation error:', error)
    return false
  }
}

export default function UploadZone({ onFileUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const validateAndUpload = async (file: File) => {
    setIsValidating(true)
    const isValid = await isValidXML(file)
    setIsValidating(false)

    if (isValid) {
      onFileUpload(file)
    } else {
      alert('❌ Invalid XML File\n\nThe selected file does not contain valid XML.\nPlease select a Space Haven save file (usually named "game" without an extension).')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      validateAndUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      validateAndUpload(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={`upload-zone ${isDragging ? 'dragging' : ''} ${isValidating ? 'validating' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {isValidating ? (
        <>
          <div className="loading-spinner" style={{ marginBottom: '1rem' }}></div>
          <p className="upload-text">Validating XML...</p>
        </>
      ) : (
        <>
          <div className="upload-icon">
            📁
          </div>

          <p className="upload-text">
            Drop your save file here or <span className="text-glow">click to browse</span>
          </p>

          <p className="upload-hint">
            Accepts: Space Haven save files (typically named "game" with no extension)
          </p>
        </>
      )}
    </div>
  )
}
