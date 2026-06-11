import { deleteImageByURL, uploadMultipleImages } from "@/actions/upload-image/upload-image-actions";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { Icons } from "../icons";
import Toast from "../shared/Toast";
import { Progress } from "../ui/progress";

type DropzoneMultipleFilesProps = {
  name: string;
  maxNum?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  disabled?: boolean;
  placeholder?: string;
  folderName?: string;
  uploadMultipleImageCredentials?: {
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }[];
  setUploadMultipleImageCredentials?: (
    value: {
      fileKey: string;
      publicUrl: string;
      uploaded?: boolean;
    }[]
  ) => void;
};

const DropzoneMultipleFiles = ({
  name,
  maxNum = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
  disabled = false, // Default to not disabled
  placeholder,
  folderName = "others",
  uploadMultipleImageCredentials,
  setUploadMultipleImageCredentials
}: DropzoneMultipleFilesProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { watch, setValue } = useFormContext();
  const watchedFiles = watch(name);

  const files: (File | string)[] = useMemo(() => {
    return watchedFiles || [];
  }, [watchedFiles]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]); // Store the preview URLs

  // Update file previews when the watched value changes
  useEffect(() => {
    if (!files || files.length === 0) return;

    // Generate previews only when `files` change
    const newPreviews = files.map(file => {
      if (typeof file === "string") {
        // If the value is a string (URL), use it as-is
        return file;
      } else {
        // Otherwise, create a URL from the file
        return URL.createObjectURL(file);
      }
    });

    // Only update `filePreviews` if there is a change
    setFilePreviews(prev => {
      if (prev.length !== newPreviews.length) {
        return newPreviews;
      }
      return prev; // Avoid unnecessary update if preview array doesn't change
    });
  }, [files]); // Only trigger this effect when `files` change

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any) => {
      setUploadProgress(0);
      setUploading(false);

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

      setUploading(true);

      // Add files to state and generate previews
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

      setValue(name, [...files, ...acceptedFiles], {
        shouldDirty: true,
        shouldValidate: true
      });

      setFilePreviews(prev => [...prev, ...newPreviews]);
      setUploading(false);
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
      const temp = uploadMultipleImageCredentials.filter((_, myIndex) => index !== myIndex);
      setUploadMultipleImageCredentials(temp);
    }

    setValue(name, newFiles, { shouldDirty: true });
    setFilePreviews(newPreviews);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxSize,
    onDrop,
    multiple: true,
    disabled: disabled || files.length >= maxNum // Disable dropzone if max files are reached or if disabled is true
  });

  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [uploading]);

  return (
    <div className='relative w-full'>
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

      {filePreviews.length === 0 ? (
        <div
          {...getRootProps()}
          className='border-primary flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center'
        >
          <div className='flex flex-col items-center justify-center gap-2'>
            <Icons.galleryUpload className={`size-8! ${disabled ? "text-primary/70" : "text-primary"}`} />

            <div className='space-y-1'>
              <span className={`p-text-16 block leading-5 font-semibold ${disabled ? "text-black/70" : "text-black/90"}`}>
                Drag your file(s) or <span className='text-primary underline'>Browse</span>
              </span>
              <span className='p-text-14 leading-5 font-medium text-[#777]'>
                {placeholder ? placeholder : `Max ${maxSize / 1024 / 1024} MB files are allowed`}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4'>
            {filePreviews.map((preview, index) => {
              const file = files[index];
              const isImage = file instanceof File ? file.type.startsWith("image/") : /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(preview);

              return (
                <div key={index} className='group relative'>
                  <div className='relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm'>
                    {isImage ? (
                      <img
                        src={preview}
                        alt={`Uploaded ${index + 1}`}
                        className='h-full w-full object-cover transition-transform group-hover:scale-105'
                      />
                    ) : (
                      <span className='px-2 text-center text-sm font-medium wrap-break-word text-gray-700'>
                        {file instanceof File ? file.name : preview.split("/").pop()}
                      </span>
                    )}
                  </div>

                  <button
                    type='button'
                    onClick={() => handleRemove(index)}
                    className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600'
                  >
                    <X className='h-3 w-3 text-white' />
                  </button>

                  <div className='absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs font-bold text-white'>
                    {index + 1}
                  </div>
                </div>
              );
            })}

            {filePreviews.length < maxNum && !disabled && (
              <div
                {...getRootProps()}
                className='border-primary relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed bg-gray-50'
              >
                <div className='flex flex-col items-center space-y-2'>
                  <div className='flex size-8 items-center justify-center rounded-full transition-colors'>
                    <span className='text-primary text-[32px]'>+</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropzoneMultipleFiles;
