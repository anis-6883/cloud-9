import { deleteImageByURL, uploadMultipleImages } from "@/actions/upload-image/upload-image-actions";
import { TDropzoneMultiple } from "@/lib/types";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { FiPlusCircle } from "react-icons/fi";
import Toast from "../shared/Toast";
import { Progress } from "../ui/progress";

export default function DropzoneMultiple({
  name,
  maxNum = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/avif": [".avif"]
  },
  disabled = false, // Default to not disabled
  placeholder,
  folderName = "images",
  uploadMultipleImageCredentials,
  setUploadMultipleImageCredentials,
  setIsImageUploading
}: TDropzoneMultiple) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { watch, setValue } = useFormContext();
  const watchedFiles = watch(name);

  const files: (File | string)[] = useMemo(() => {
    return watchedFiles || [];
  }, [watchedFiles]);

  const allowedFormats = useMemo(() => {
    return Object.values(accept)
      .flat()
      .map(ext => ext.replace(".", "").toUpperCase())
      .join(", ");
  }, [accept]);
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

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any) => {
      setIsImageUploading?.(false);
      setUploadProgress(0);
      setUploading(false);

      // Strict validation: check extensions even if react-dropzone accepted them (can happen with broad MIME types like image/*)
      const allowedExtensions = Object.values(accept)
        .flat()
        .map(ext => ext.toLowerCase());
      const validatedFiles = acceptedFiles.filter(file => {
        const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
        return allowedExtensions.includes(ext);
      });

      const invalidTypeFiles = acceptedFiles.filter(file => !validatedFiles.includes(file));
      const hasTypeErrors = fileRejections.some((rejection: any) =>
        rejection.errors.some((e: { code: string }) => e.code === "file-invalid-type")
      );

      if (fileRejections.length > 0 || invalidTypeFiles.length > 0) {
        const sizeError = fileRejections.some((rejection: any) =>
          rejection.errors.some((e: { code: string }) => e.code === "file-too-large")
        );

        const typeError = hasTypeErrors || invalidTypeFiles.length > 0;

        if (sizeError) {
          Toast.error(`File exceeds the maximum size of ${maxSize / 1024 / 1024}MB`);
        }

        if (typeError) {
          Toast.error(`Invalid file type. Accepted types: ${allowedFormats}`);
        }
        return;
      }

      if (!validatedFiles?.length) return;

      // Check if the uploaded files exceed the maximum limit
      if (files.length + validatedFiles.length > maxNum) {
        Toast.error(`You can only upload up to ${maxNum} images.`);
        return;
      }

      setUploading(true);
      setIsImageUploading?.(true);
      // Add files to state, generate previews and upload in cloud
      const newPreviews = validatedFiles.map(file => URL.createObjectURL(file));
      const uploadRes = await uploadMultipleImages(validatedFiles, folderName);

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
      setIsImageUploading?.(false);
      setValue(name, [...files, ...validatedFiles], {
        shouldDirty: true,
        shouldValidate: true
      });
    },
    [
      files,
      maxNum,
      name,
      setValue,
      accept,
      maxSize,
      folderName,
      setUploadMultipleImageCredentials,
      uploadMultipleImageCredentials,
      allowedFormats
    ]
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
          className='border-light-gray flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center'
        >
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-primary/10 flex size-12 flex-col items-center justify-center rounded-full'>
              <BsFillCloudUploadFill className={`size-6! ${disabled ? "text-primary/70" : "text-primary"}`} />
            </div>
            <div className='space-y-1'>
              <span className={`block text-sm leading-4 ${disabled ? "text-primary/70" : "text-primary/90"}`}>
                Click to upload <span className='text-black'>or Drag and Drop image here.</span>
              </span>
              <span className='text-light-gray text-sm leading-4'>
                {placeholder ? placeholder : `Max size: ${maxSize / 1024 / 1024}MB | Allowed formats: ${allowedFormats}`}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5'>
            {filePreviews.map((preview, index) => (
              <div key={index} className='group relative'>
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
            ))}

            {filePreviews.length < maxNum && !disabled && (
              <div
                {...getRootProps()}
                className='border-primary @container relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed bg-gray-50 p-1'
              >
                <div className='flex flex-col items-center space-y-2'>
                  <div className='flex items-center justify-center rounded-full transition-colors'>
                    <span className='text-primary flex flex-col items-center gap-2'>
                      <FiPlusCircle className='text-lg @[80px]:text-xl @[120px]:text-2xl @[160px]:text-3xl @[200px]:text-4xl' />
                      <span className='text-center text-[10px] font-semibold @[80px]:text-xs @[120px]:text-sm'>Add More...</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
