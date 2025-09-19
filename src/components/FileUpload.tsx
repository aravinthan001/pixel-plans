import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  X,
  Download,
  Eye,
  Trash2
} from 'lucide-react';
import { Attachment, User } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploadProps {
  attachments: Attachment[];
  currentUser: User;
  onUpload: (files: File[]) => void;
  onDelete?: (attachmentId: string) => void;
  onPreview?: (attachment: Attachment) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
}

export default function FileUpload({
  attachments,
  currentUser,
  onUpload,
  onDelete,
  onPreview,
  maxFileSize = 10,
  allowedTypes = ['*']
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles: File[] = [];
    
    files.forEach(file => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${maxFileSize}MB limit`);
        return;
      }
      
      // Check file type if restrictions are set
      if (allowedTypes[0] !== '*') {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!fileExt || !allowedTypes.includes(`.${fileExt}`)) {
          toast.error(`${file.name} has an invalid file type`);
          return;
        }
      }
      
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      // Simulate upload progress
      validFiles.forEach(file => {
        const fileId = `${file.name}-${Date.now()}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Simulate progress
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[fileId] || 0;
            if (current >= 100) {
              clearInterval(interval);
              const { [fileId]: _, ...rest } = prev;
              return rest;
            }
            return { ...prev, [fileId]: Math.min(current + 20, 100) };
          });
        }, 200);
      });

      onUpload(validFiles);
      toast.success(`Uploading ${validFiles.length} file(s)`);
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (!ext) return File;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return FileImage;
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) return FileVideo;
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) return FileAudio;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return FileArchive;
    if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) return FileText;
    
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-all",
          "hover:border-primary/50 hover:bg-muted/50",
          isDragging && "border-primary bg-primary/10",
          "cursor-pointer group"
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          onChange={handleFileSelect}
          accept={allowedTypes.join(',')}
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className={cn(
              "h-10 w-10 mb-3 transition-all",
              "text-muted-foreground group-hover:text-primary",
              isDragging && "text-primary scale-110"
            )} />
            
            <p className="text-sm font-medium mb-1">
              {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
            </p>
            
            <p className="text-xs text-muted-foreground">
              Max file size: {maxFileSize}MB
              {allowedTypes[0] !== '*' && (
                <span> • Allowed: {allowedTypes.join(', ')}</span>
              )}
            </p>
          </div>
        </label>
      </div>

      {/* Upload Progress */}
      {Object.entries(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="truncate">{fileId.split('-')[0]}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Attachments ({attachments.length})</h4>
          
          <div className="grid gap-2">
            {attachments.map(attachment => {
              const Icon = getFileIcon(attachment.filename);
              
              return (
                <div
                  key={attachment.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
                >
                  <Icon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {attachment.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.size)} • Uploaded by {attachment.uploadedBy.name} • {format(attachment.uploadedAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPreview(attachment)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // In a real app, this would download the file
                        toast.success(`Downloading ${attachment.filename}`);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {onDelete && attachment.uploadedBy.id === currentUser.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onDelete(attachment.id);
                          toast.success('Attachment removed');
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}