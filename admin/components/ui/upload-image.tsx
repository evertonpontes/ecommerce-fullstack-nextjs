'use client';

import React, {
  ChangeEvent,
  InputHTMLAttributes,
  TransitionStartFunction,
  useState,
} from 'react';
import { Input } from './input';
import { File, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from './button';
import { cn, convertBlobUrlToFile } from '@/lib/utils';
import { deleteImage, uploadImage } from '@/supabase/storage/client';

interface UploadImageProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string[];
  onTransition: TransitionStartFunction;
  onChangeImages: (imageUrls: string[]) => void;
  bucket?: string;
  folder?: string;
}

export const UploadImage: React.FC<UploadImageProps> = ({
  value,
  onChangeImages,
  onTransition,
  bucket,
  folder,
  ...props
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>(value);

  const onInputFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const imagesArray = Array.from(event.target.files);
      const fileToUrls = imagesArray.map((file) => URL.createObjectURL(file));

      setImageUrls((prev) => [...prev, ...fileToUrls]);
      event.target.value = '';
    }
  };

  const onDeleteImage = async (imageUrl: string) => {
    if (imageUrls.length) {
      setImageUrls(imageUrls.filter((url) => url !== imageUrl));
      return;
    }
    onTransition(async () => {
      await deleteImage(imageUrl);
      const urls = uploadedImages;
      setUploadedImages(urls.filter((url) => url !== imageUrl));
      onChangeImages(urls.filter((url) => url !== imageUrl));
    });
  };

  const onUploadImage = async () => {
    onTransition(async () => {
      let urls = [];
      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);

        const { imageUrl, error } = await uploadImage({
          bucket: bucket || 'dashboard',
          file: imageFile,
          folder,
        });

        if (error) {
          console.log(error);
          return;
        }

        urls.push(imageUrl);
      }
      setUploadedImages(urls);
      onChangeImages(urls);
      setImageUrls([]);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden">
      <div className="px-6 py-8">
        <div className="grid gap-4">
          {!uploadedImages.length ? (
            <div className="flex items-center justify-center w-full h-32 border border-dashed border-muted rounded-lg group hover:border-primary transition-colors relative">
              <div className="text-center text-muted-foreground space-y-1">
                <Upload className="w-8 h-8 mx-auto" />
                <p className="text-sm font-medium">
                  Drag and drop your images here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to select files
                </p>
              </div>
              <Input
                type="file"
                onChange={onInputFileChange}
                className="opacity-0 w-full h-full absolute cursor-pointer disabled:cursor-not-allowed disabled:opacity-0"
                disabled={props.disabled}
              />
            </div>
          ) : (
            <div className="text-sm flex items-center gap-4">
              <File className="w-4 h-4" />
              <span>({uploadedImages.length}) Image(s) uploaded.</span>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <ViewImage
                key={index}
                url={url}
                alt={`img-${index}`}
                onDeleteImage={onDeleteImage}
                disabled={props.disabled}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((url, index) => (
              <div key={index}>
                <ViewImage
                  url={url}
                  alt={`img-${index}`}
                  onDeleteImage={onDeleteImage}
                  disabled={props.disabled}
                >
                  <span className="text-sm">{url.split('/').pop()}</span>
                </ViewImage>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!uploadedImages.length && (
        <div className="px-6 pb-6 flex justify-end">
          <Button
            type="button"
            onClick={onUploadImage}
            disabled={props.disabled}
          >
            Upload Image(s)
          </Button>
        </div>
      )}
    </div>
  );
};

interface ViewImageProps {
  url: string;
  onDeleteImage: (url: string) => void;
  disabled?: boolean;
  alt: string;
  children?: React.ReactNode;
}

const ViewImage: React.FC<ViewImageProps> = ({
  url,
  onDeleteImage,
  disabled,
  alt,
  children,
}) => {
  return (
    <div className="relative w-full h-full">
      <div
        className={cn(
          'w-full h-full absolute flex items-center justify-center bg-muted/30',
          !disabled && 'hidden'
        )}
      >
        <Loader2 className="text-accent-foreground animate-spin" />
      </div>
      <Image
        src={url}
        alt={alt}
        width={300}
        height={300}
        className="aspect-square object-contain rounded-md border p-4"
      />
      <Button
        onClick={() => onDeleteImage(url)}
        type="button"
        variant={'ghost'}
        size={'icon'}
        className="rounded-full absolute -top-2 -left-2"
        disabled={disabled}
      >
        <X className="w-4 h-4" />
      </Button>
      {children}
    </div>
  );
};
