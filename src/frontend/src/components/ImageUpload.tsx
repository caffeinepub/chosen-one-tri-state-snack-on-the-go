import { useRef, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalBlob } from '../backend';

export type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageSelect: (blob: ExternalBlob | null) => void;
  onUploadStateChange?: (state: UploadState) => void;
}

export default function ImageUpload({ 
  currentImageUrl, 
  onImageSelect,
  onUploadStateChange 
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateUploadState = (state: UploadState) => {
    setUploadState(state);
    onUploadStateChange?.(state);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error state
    setErrorMessage('');
    updateUploadState('idle');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (JPEG, PNG, GIF, etc.)');
      updateUploadState('error');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrorMessage('Image file is too large. Maximum size is 10MB.');
      updateUploadState('error');
      return;
    }

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read image file');
        updateUploadState('error');
      };
      reader.readAsDataURL(file);

      // Convert to Uint8Array for backend
      updateUploadState('uploading');
      setUploadProgress(0);
      
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
      
      // Create ExternalBlob with upload progress tracking
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
        if (percentage === 100) {
          updateUploadState('success');
        }
      });
      
      // Pass ExternalBlob to parent immediately
      onImageSelect(blob);
      
      // If no progress callback is triggered, mark as success after a short delay
      setTimeout(() => {
        if (uploadState === 'uploading' && uploadProgress === 0) {
          setUploadProgress(100);
          updateUploadState('success');
        }
      }, 500);
      
    } catch (error) {
      console.error('Error processing image:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process image');
      updateUploadState('error');
      onImageSelect(null);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setUploadProgress(0);
    setErrorMessage('');
    updateUploadState('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null);
  };

  const handleRetry = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{errorMessage}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {previewUrl ? (
        <div className="relative">
          <div className="aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden border-2 border-border bg-muted">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
          {uploadState === 'uploading' && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center mt-1">
                Preparing image: {uploadProgress}%
              </p>
            </div>
          )}
          {uploadState === 'success' && (
            <p className="text-xs text-green-600 dark:text-green-400 text-center mt-2">
              ✓ Image ready to upload
            </p>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-48 border-2 border-dashed"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Click to upload image
            </span>
            <span className="text-xs text-muted-foreground">
              Max size: 10MB
            </span>
          </div>
        </Button>
      )}
    </div>
  );
}
