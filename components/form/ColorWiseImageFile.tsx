import { deleteImageByURL, uploadMultipleImages } from "@/actions/upload-image/upload-image-actions";
import { TDropzoneMultiple } from "@/lib/types";
import { AlertTriangleIcon, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { FiPlusCircle } from "react-icons/fi";
import Toast from "../shared/Toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";

export default function ColorWiseImageFile({
  name,
  maxNum = 5,
  maxSize = 5 * 1024 * 1024,
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
  disabled = false,
  colors,
  folderName = "images",
  uploadMultipleImageCredentials,
  setUploadMultipleImageCredentials
}: TDropzoneMultiple) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { watch, setValue } = useFormContext();
  const watchedFiles = watch(name);

  const files: (File | string)[] = useMemo(() => {
    return watchedFiles || [];
  }, [watchedFiles]);

  // Derived: current color index = number of files uploaded so far (capped at last color)
  const flag = Math.min(files.length, (colors?.length ?? 1) - 1);

  // Keep files & previews in sync with colors — if a color is removed, drop its file too
  useEffect(() => {
    const colorCount = colors?.length ?? 0;
    if (files.length > colorCount) {
      setValue(name, files.slice(0, colorCount), { shouldDirty: true });
      setFilePreviews(prev => prev.slice(0, colorCount));
    }
  }, [colors?.length, files, name, setValue]);

  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  // Update file previews when the watched value changes
  useEffect(() => {
    if (!files || files.length === 0) {
      setFilePreviews([]);
      return;
    }

    const newPreviews = files.map(file => {
      if (typeof file === "string") {
        return file;
      } else {
        return URL.createObjectURL(file);
      }
    });

    setFilePreviews(prev => {
      if (prev.length !== newPreviews.length) {
        return newPreviews;
      }
      return prev;
    });
  }, [files]);

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any) => {
      setUploadProgress(0);
      setUploading(true);

      if (fileRejections.length > 0) {
        const sizeError = fileRejections.some((rejection: any) =>
          rejection.errors.some((e: { code: string }) => e.code === "file-too-large")
        );

        const typeError = fileRejections.some((rejection: any) =>
          rejection.errors.some((e: { code: string }) => e.code === "file-invalid-type")
        );

        if (sizeError) {
          Toast.warning(`File exceeds the maximum size of ${maxSize / 1024 / 1024}MB`);
        }

        if (typeError) {
          const acceptedTypes = Object.values(accept).flat().join(", ");
          Toast.warning(`Invalid file type. Accepted types: ${acceptedTypes}`);
        }
        return;
      }

      if (!acceptedFiles?.length) return;

      // Check if the uploaded files exceed the maximum limit
      if (files.length + acceptedFiles.length > maxNum) {
        Toast.warning(`You can only upload up to ${maxNum} images.`);
        return;
      }

      // Add files to state, generate previews and upload in cloud
      const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
      const uploadRes = await uploadMultipleImages(acceptedFiles, folderName);

      if (uploadRes?.status) {
        const temp = uploadRes?.data?.map((item: any) => {
          return {
            fileKey: item?.fileKey,
            publicUrl: item?.publicUrl,
            uploaded: true
          };
        });

        if (temp && setUploadMultipleImageCredentials && uploadMultipleImageCredentials) {
          setUploadMultipleImageCredentials([...uploadMultipleImageCredentials, ...temp]);
        }
      }

      setFilePreviews(prev => [...prev, ...newPreviews]);
      setUploading(false);

      setValue(name, [...files, ...acceptedFiles], {
        shouldDirty: true,
        shouldValidate: true
      });
    },
    [files, maxNum, name, setValue, accept, maxSize, folderName, setUploadMultipleImageCredentials, uploadMultipleImageCredentials]
  );

  // Handle removing images
  const handleRemove = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...filePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    let findItem;

    if (uploadMultipleImageCredentials) findItem = uploadMultipleImageCredentials[index];
    if (findItem?.publicUrl) deleteImageByURL(findItem?.publicUrl);

    if (uploadMultipleImageCredentials && setUploadMultipleImageCredentials) {
      const temp = uploadMultipleImageCredentials.filter((item, myIndex) => {
        return index !== myIndex;
      });

      setUploadMultipleImageCredentials(temp);
    }

    setValue(name, newFiles, { shouldDirty: true });
    setFilePreviews(newPreviews);
  };

  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // setUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [uploading]);

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxSize,
    onDrop,
    multiple: true,
    disabled: disabled || files.length >= maxNum
  });

  const nextColorLabel = colors?.[flag] ?? "";
  const uploadedColors = colors?.slice(0, files.length) ?? [];

  return (
    <div className='relative mt-4 w-full'>
      <input {...getInputProps()} />

      {uploading && (
        <div className='p-5'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>Uploading...</span>
            <span className='text-end text-sm text-gray-500'>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {maxNum <= 0 && (
        <Alert className='max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50'>
          <AlertTriangleIcon />
          <AlertTitle>Product color-wise image upload!</AlertTitle>
          <AlertDescription>Please, select at least one color attribute value!</AlertDescription>
        </Alert>
      )}

      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5'>
          {filePreviews.map((preview, index) => (
            <div key={index} className='space-y-1'>
              <div className='group relative'>
                <div className='relative aspect-square overflow-hidden rounded-xl border border-gray-200 shadow-sm'>
                  {typeof preview === "string" ? (
                    <img
                      src={preview}
                      alt={`Uploaded ${index + 1}`}
                      className='h-full w-full object-cover transition-transform group-hover:scale-105'
                    />
                  ) : (
                    <div className='h-full w-full animate-pulse bg-gray-200'></div>
                  )}
                </div>

                <button
                  type='button'
                  onClick={() => handleRemove(index)}
                  className='bg-primary absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg transition-colors hover:bg-red-600'
                >
                  <X className='h-3 w-3 text-white' />
                </button>

                <div className='bg-light-gray absolute bottom-2 left-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white'>
                  {index + 1}
                </div>
              </div>
              <p className='text-center text-sm font-semibold'>{uploadedColors[index]}</p>
            </div>
          ))}

          {filePreviews.length < maxNum && !disabled && (
            <div
              {...getRootProps()}
              className='border-primary relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed bg-gray-50'
            >
              <div className='flex flex-col items-center space-y-2'>
                <div className='flex items-center justify-center rounded-full transition-colors'>
                  <span className='text-primary flex flex-col items-center gap-2'>
                    <FiPlusCircle className='text-4xl' />
                    <span className='px-2 text-center text-sm font-semibold'>Browse the "{nextColorLabel}" related image file!</span>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-sm font-semibold'>
                      <span>{nextColorLabel}</span>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
