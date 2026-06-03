// AddImage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { toast } from 'react-toastify';
import { Button } from '../../../../components/ui/Button';
import { IoClose } from 'react-icons/io5';
import { FiUpload } from 'react-icons/fi';
import { formatBytes } from '../../../../utils/helpers';
import { productService } from '../../../../services/product.service';

interface Props {
  show: boolean;
  hide: () => void;
  onSave: () => void;
  productId?: string;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const AddImage: React.FC<Props> = ({ show, hide, onSave, productId }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('Image size cannot be more than 2 MBs')

  // Add image handler
  const addImages = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return;
      }
      
      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB`);
        return;
      }
      
      newImages.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file)
      });
    });
    
    setImages(prev => [...prev, ...newImages]);
  }, []);

  // Remove image
  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter(img => img.id !== id);
    });
  }, []);

  // Drag & drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addImages(e.dataTransfer.files);
  };

  // File input handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('')
    addImages(e.target.files);
    e.target.value = ''; // Reset input
  };

  // Upload all images
  const uploadImages = async () => {
    if (!productId) {
      toast.error('Product ID missing');
      return;
    }
    if (images.length === 0) {
      toast.error('No images to upload');
      return;
    }
    setIsUploading(true);
    
    const formData = new FormData();

    images.forEach(image => {
        formData.append('images', image.file);
    });  

    productService.uploadImages(productId, formData)
    .then(({data})=>{
        if (data.success) {
            toast.success(`Uploaded ${images.length} image(s) successfully`);
            // Clean up preview URLs
            images.forEach(img => URL.revokeObjectURL(img.preview));
            setImages([]);
            onSave();
            hide();
        } else {
            toast.error(data.message || 'Upload failed');
        }
    }).catch((error)=>toast.error(error.response?.data?.message || 'Upload failed'))
    .finally(()=>setIsUploading(false))
  }

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  useEffect(() => {
    setUploadError('')
  }, [images]);

  return (
    <Modal isOpen={show} onClose={hide} title="Add Images" size="xl">
      <div className="flex flex-col gap-4">
        {/* Drop area */}
        <div
          className={`relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onClick={()=>setUploadError('')}
            onChange={handleFileSelect}
            className="sr-only"
            id="image-upload"
          />
          
          {images.length > 0 ? (
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">
                  Selected ({images.length} {images.length>1?'images':'image'})
                </h3>
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
                >
                  <FiUpload className="size-3.5" />
                  Add more
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1 pt-2.5">
                {images.map((image) => (
                  <div key={image.id} className="relative aspect-square rounded-md bg-gray-100 group">
                    <img
                      src={image.preview}
                      alt={image.file.name}
                      className="size-full rounded-md object-contain border border-gray-300"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute cursor-pointer -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <IoClose className="size-3.5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate rounded-b-md flex justify-between items-end">
                      <p>{image.file.name}</p>
                      <p>{formatBytes(image.file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
              <div className="mb-3 p-3 rounded-full bg-gray-100">
                <FiUpload className="size-6 text-gray-500" />
              </div>
              <p className="mb-1 font-medium text-sm">Drop your images here</p>
              <p className="text-gray-500 text-xs mb-3">
                SVG, PNG, JPG or GIF (max. 5MB each)
              </p>
              <label
                htmlFor="image-upload"
                className="cursor-pointer px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
              >
                Select images
              </label>
            </div>
          )}
        </div>

        {uploadError&&
            <p className='text-base text-red-500 font-bold font-mono'>Error: {uploadError}</p>
        }

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button 
            className='cursor-pointer'
            variant="outline" 
            onClick={hide} 
            disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={uploadImages} 
            disabled={images.length === 0 || isUploading}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            {isUploading ? 'Uploading...' : `Upload ${images.length} ${images.length>1?'images':'image'}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddImage;