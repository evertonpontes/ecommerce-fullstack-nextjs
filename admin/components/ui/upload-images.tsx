'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn, convertBlobUrlToFile } from '@/lib/utils';

import { CloudUpload, FolderInput, Paperclip, X } from 'lucide-react';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';

import Image from 'next/image';

import { Label } from './label';
import { Input } from './input';
import { Button } from './button';
import { CSS } from '@dnd-kit/utilities';
import { deleteImage, uploadImage } from '@/supabase/storage/client';
import Link from 'next/link';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

type UploadImageProps = {
  bucket?: string;
  folder?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  startTransition: React.TransitionStartFunction;
  disable?: boolean;
};

type UploadImagesContextValues = {
  urls: string[];
  setUrls: React.Dispatch<React.SetStateAction<string[]>>;
  disable?: boolean;
};

const UploadImagesContext = createContext<UploadImagesContextValues>(
  {} as UploadImagesContextValues
);

export const UploadImages: React.FC<UploadImageProps> = ({
  bucket = 'dashboard',
  folder = '',
  value = [],
  onChange = () => {},
  startTransition,
  disable = false,
}) => {
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(value);
  const [fileDetails, setFileDetails] = useState<
    {
      url: string;
      name: string;
      size: number;
    }[]
  >([]);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      // converting FileList to Array
      const filesToArray = Array.from(event.target.files);
      const fileUrlArray = filesToArray.map((file) =>
        URL.createObjectURL(file)
      );

      setUrls((prev) => [...prev, ...fileUrlArray]);
    }
    event.target.value = '';
  }

  const onUploadImages = () => {
    startTransition(async () => {
      console.log('Start process...');
      const listUrls: string[] = [];

      for (const url of urls) {
        const file = await convertBlobUrlToFile(url);
        const { imageUrl, error } = await uploadImage({
          bucket,
          folder,
          file,
        });

        if (error) {
          console.log(error);
          setError(error);
          return;
        }

        listUrls.push(imageUrl);
      }
      onChange(listUrls);
      setUploadedFiles(listUrls);
      setUrls([]);
      console.log('End process.');
    });
  };

  const onDeletedUploadedImage = (url: string) => {
    startTransition(async () => {
      await deleteImage(url);
      const urls = uploadedFiles;
      setUploadedFiles(urls.filter((value) => value !== url));
      onChange(urls.filter((value) => value !== url));
    });
  };

  useEffect(() => {
    const fetchFileDetails = async () => {
      const fileDetails = await Promise.all(
        uploadedFiles.map(async (url) => {
          const file = await convertBlobUrlToFile(url);
          return { url, name: file.name, size: file.size };
        })
      );
      setFileDetails(fileDetails);
    };
    fetchFileDetails();
  }, [uploadedFiles]);

  return (
    <UploadImagesContext.Provider value={{ urls, setUrls, disable }}>
      <div className="space-y-2">
        <Label htmlFor={!disable ? 'input-file' : ''} className="block">
          Upload Images
        </Label>
        <Input
          ref={inputRef}
          type="file"
          id="input-file"
          accept="image/png, image/jpeg"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="space-y-2">
          <Button
            type="button"
            variant={'outline'}
            onClick={() => inputRef.current?.click()}
            disabled={disable}
          >
            <FolderInput className="size-4 flex flex-shrink-0 mr-2" />
            Choose files
          </Button>
          <p className="text-sm text-muted-foreground">
            Select the images that will be displayed in the catalog.
          </p>
        </div>
        <ImageContent />
        <div className="block">
          <Button
            type="button"
            variant={'outline'}
            className={cn(
              'bg-zinc-950 text-primary-foreground hover:bg-zinc-900 hover:text-primary-foreground',
              !urls.length ? 'sr-only' : 'not-sr-only'
            )}
            onClick={onUploadImages}
            disabled={disable}
          >
            <CloudUpload className="size-4 flex flex-shrink-0 mr-2" />
            Upload to Cloud
          </Button>
        </div>
        {error ? <p className="text-sm text-destructive">error</p> : ''}
        <div
          className={cn(
            'flex flex-wrap gap-4',
            !fileDetails.length ? 'sr-only' : 'not-sr-only'
          )}
        >
          {fileDetails.map((file) => (
            <div key={file.url}>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="group flex gap-1 items-center">
                    <Link
                      target="_blank"
                      href={file.url}
                      className="text-sm text-muted-foreground flex gap-1 hover:text-primary transition-colors items-center"
                      title="Uploaded Image"
                    >
                      <Paperclip className="flex-shrink-0 size-4" />
                      {file.name.toString()} ({Math.floor(file.size / 1024)}KB)
                    </Link>
                    <Button
                      type="button"
                      variant={'ghost'}
                      size={'icon'}
                      className="p-0 size-4 opacity-0 group-hover:text-destructive group-hover:opacity-100 transition-all"
                      title="Delete Image"
                      onClick={() => onDeletedUploadedImage(file.url)}
                      disabled={disable}
                    >
                      <X />
                    </Button>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="size-[200px] relative">
                    <Image
                      src={file.url}
                      alt={`image-uploaded-${file.name}`}
                      fill
                      className={cn('object-contain rounded absolute')}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          ))}
        </div>
      </div>
    </UploadImagesContext.Provider>
  );
};

const ImageContent = () => {
  const { urls, setUrls } = useContext(UploadImagesContext);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active && over && active.id !== over.id) {
        const oldIndex = urls.indexOf(active.id.toString());
        const newIndex = urls.indexOf(over.id.toString());

        setUrls(() => arrayMove(urls, oldIndex, newIndex));
      }
    },
    [setUrls, urls]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        className={cn(
          'flex flex-wrap gap-4 p-4 bg-accent border-2 border-dashed rounded',
          !urls.length ? 'sr-only' : 'not-sr-only'
        )}
      >
        <SortableContext items={urls} strategy={rectSortingStrategy}>
          {urls.map((url, index) => (
            <ImageItem key={url} url={url} index={index} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

const ImageItem = ({ url, index }: { url: string; index: number }) => {
  const { setUrls, urls, disable } = useContext(UploadImagesContext);
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  const handleFileDelete = useCallback(
    async (url: string) => {
      const newUrls = urls.filter((value) => value !== url);

      setUrls(newUrls);
    },
    [setUrls, urls]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group size-[100px] border rounded shadow bg-card relative"
    >
      <Image
        src={url}
        alt={`image-uploaded-${index}`}
        fill
        className={cn(
          'object-cover rounded absolute',
          isDragging ? 'shadow-2xl cursor-grabbing' : 'shadow cursor-grab'
        )}
        {...listeners}
        {...attributes}
      />
      <Button
        type="button"
        size={'icon'}
        className="size-6 rounded-full p-0 m-auto flex items-center absolute transition-opacity opacity-0 group-hover:opacity-100 ml-1 mt-1 z-10"
        variant={'secondary'}
        onClick={() => handleFileDelete(url)}
        disabled={disable}
      >
        <X />
      </Button>
    </div>
  );
};
