import { Upload, X } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

type DropzoneSingleProps = {
  name: string;
  disabled?: boolean;
  maxSize?: number;
  accept?: Record<string, string[]>;
};

const DropzoneSingleNew = ({
  name,
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] }
}: DropzoneSingleProps) => {
  const {
    watch,
    setValue,
    formState: { isSubmitting }
  } = useFormContext();

  const image = watch(name);
  const isFieldDisabled = disabled || isSubmitting;

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any) => {
      if (fileRejections.length > 0) {
        const sizeError = fileRejections.some((rejection: any) =>
          rejection.errors.some((e: { code: string }) => e.code === "file-too-large")
        );

        const typeError = fileRejections.some((rejection: any) =>
          rejection.errors.some((e: { code: string }) => e.code === "file-invalid-type")
        );

        if (sizeError) {
          toast.error(`Image size exceeds the max limit of ${maxSize / 1024 / 1024}MB!`);
        }

        if (typeError) {
          const acceptedTypes = Object.values(accept).flat().join(", ");
          toast.error(`Invalid file type. Accepted types: ${acceptedTypes}`);
        }

        setValue(name, "", { shouldValidate: true });
        return;
      }

      if (!acceptedFiles?.length) return;

      const file = acceptedFiles[0];

      // Validate file type client-side as additional safety
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        setValue(name, "", { shouldValidate: true });
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      });

      setValue(name, fileWithPreview, {
        shouldValidate: true,
        shouldDirty: true
      });
    },
    [name, setValue, maxSize, accept]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxSize,
    onDrop,
    disabled: isFieldDisabled,
    multiple: false
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Revoke object URL to prevent memory leaks
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }

    setValue(name, "", {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className='w-full'>
      <input {...getInputProps()} />

      <div className='relative flex flex-col'>
        <div
          {...getRootProps()}
          className={`flex cursor-pointer items-center justify-center overflow-hidden bg-white shadow-xs transition-all duration-200 ${
            isFieldDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          } ${
            image
              ? "border-primary hover:border-primary/50 rounded-md border"
              : `rounded-md border-2 border-dashed border-gray-300 hover:border-black/90 ${isDragActive ? "border-blue-500 bg-blue-50" : ""}`
          } `}
        >
          {image ? (
            <div className='w-full'>
              <div className='flex items-center gap-3 px-3 py-2'>
                {/* Thumbnail */}
                <div className='h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-white'>
                  <img src={image?.preview || image} alt='preview' className='h-full w-full object-cover' />
                </div>

                {/* File info */}
                <div className='min-w-0 flex-1'>
                  <p className='text-foreground truncate text-sm font-medium'>{image.name}</p>
                  <p className='text-muted-foreground text-xs'>{formatFileSize(image.size)}</p>
                </div>

                {/* Remove button */}
                {!isFieldDisabled && (
                  <button
                    type='button'
                    onClick={handleRemove}
                    className='text-primary hover:bg-primary/10 hover:text-primary flex h-6 w-6 items-center justify-center rounded-full'
                  >
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center p-4 text-center'>
              <div className='flex flex-col items-center justify-center gap-2'>
                <div className='bg-primary/10 flex size-12 flex-col items-center justify-center rounded-full'>
                  <Upload className={`size-6! ${isFieldDisabled ? "text-primary/70" : "text-primary"}`} />
                </div>
                <div className='space-y-1'>
                  <span className={`p-text-12 block leading-4 ${isFieldDisabled ? "text-primary/70" : "text-primary/90"}`}>
                    {/* {isDragActive
                      ? "Drop the image here"
                      : "Drag and drop or browse to upload"} */}
                    Click to upload <span className='text-black'>or Drag and Drop image here.</span>
                  </span>
                  <span className='p-text-12 leading-4 text-[#777]'>Use jpg or png</span>
                  {/* <span
                    className={`text-sm block ${
                      isFieldDisabled ? "text-primary/70" : "text-primary/80"
                    }`}
                  >
                    Supports {Object.values(accept).flat().join(", ")} (Max.{" "}
                    {formatFileSize(maxSize)})
                  </span> */}
                </div>
                {/* {!isFieldDisabled && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    disabled={isFieldDisabled}
                  >
                    Browse Files
                  </Button>
                )} */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropzoneSingleNew;
