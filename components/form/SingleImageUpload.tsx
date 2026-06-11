"use client";

// import { deleteImageByURL, uploadImage } from "@/actions/upload-image/upload-image-actions";
import { deleteImageByURL, uploadImage } from "@/actions/upload-image/upload-image-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconUpload, IconX } from "@tabler/icons-react";
import { BadgeInfoIcon, CloudUpload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, get, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

// ─── Standard Ratios ──────────────────────────────────────
export type ImageRatio = "1:1" | "16:9" | "4:3" | "3:2" | "2:1" | "16:7" | "9:16" | "7:8" | "1400:480" | "1400:350";

const RATIO_MAP: Record<ImageRatio, number> = {
  "1:1": 1,
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "2:1": 2,
  "16:7": 16 / 7,
  "9:16": 9 / 16,
  "7:8": 7 / 8,
  "1400:480": 1400 / 480,
  "1400:350": 1400 / 350
};

// Allow ±5% tolerance for ratio validation
const RATIO_TOLERANCE = 0.05;

interface IProps {
  label?: string;
  name: string;
  description?: string;
  accept?: string;
  existingImage?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  fallbackText?: string;
  avatarSize?: string;
  folderName?: string;
  uploadImageCredentials?: { publicId: string; secureUrl: string; uploaded?: boolean };
  setUploadImageCredentials: (data: { publicId: string; secureUrl: string; uploaded?: boolean }) => void;
  variant?: "avatar" | "placeholder" | "dropzone";
  placeholder?: string;
  setIsUploading?: (value: boolean) => void;
  // ── Ratio props ──
  // allowedRatios?: ImageRatio[]; // e.g. ["1:1", "16:9"]
  aspect?: AspectShape | AspectShape[];
}

// ─── Ratio Validator ──────────────────────────────────────
// const validateImageRatio = (file: File, allowedRatios: ImageRatio[]): Promise<boolean> => {
//   return new Promise((resolve) => {
//     const img = new Image();
//     const url = URL.createObjectURL(file);

//     img.onload = () => {
//       URL.revokeObjectURL(url);
//       const actualRatio = img.width / img.height;
//       const isValid = allowedRatios.some((ratio) => {
//         const expectedRatio = RATIO_MAP[ratio];
//         return Math.abs(actualRatio - expectedRatio) / expectedRatio <= RATIO_TOLERANCE;
//       });

//       resolve(isValid);
//     };

//     img.onerror = () => {
//       URL.revokeObjectURL(url);
//       resolve(false);
//     };

//     img.src = url;
//   });
// };
const validateImageShape = (file: File, allowedShapes: AspectShape[]): Promise<boolean> => {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const width = img.width;
      const height = img.height;
      const ratio = width / height;

      const isValid = allowedShapes.some(shape => {
        switch (shape) {
          case "square":
            return ratio >= 0.8 && ratio <= 1.2; // forgiving square

          case "landscape":
            return ratio > 1.1; // wider than tall

          case "portrait":
            return ratio < 0.9; // taller than wide

          case "banner":
            return ratio >= 2; // very wide

          case "tall":
            return ratio <= 0.6; // very tall

          default:
            return false;
        }
      });

      resolve(isValid);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
};
export type AspectShape =
  | "square"
  | "landscape" // rectangle (width > height)
  | "portrait" // rotated rectangle (height > width)
  | "banner" // very wide
  | "tall";

export default function SingleImageUpload({
  label,
  name,
  description,
  accept = "image/*",
  existingImage,
  disabled,
  maxSizeMB = 5,
  fallbackText = "U",
  avatarSize = "h-20 w-20",
  folderName = "images",
  uploadImageCredentials,
  setUploadImageCredentials,
  variant = "avatar",
  placeholder,
  setIsUploading,
  // allowedRatios,
  aspect
}: IProps) {
  const form = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreview(existingImage || null);
  }, [existingImage]);

  const getFileTypeDescription = () => {
    if (accept === "image/*") return "any image format";
    const extensions = accept
      .split(",")
      .map(type => {
        const trimmed = type.trim();
        if (trimmed.startsWith(".")) return trimmed.substring(1).toUpperCase();
        if (trimmed.startsWith("image/")) return trimmed.substring(6).toUpperCase();
        return trimmed.toUpperCase();
      })
      .filter(Boolean);
    return extensions.join(", ");
  };

  const validateFileType = (file: File): boolean => {
    // if (accept === "image/*") return file.type.startsWith("image/");
    if (accept === "image/*") {
      return file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|avif)$/i.test(file.name);
    }
    const acceptedTypes = accept.split(",").map(type => type.trim());
    return acceptedTypes.some(acceptedType => {
      if (acceptedType.startsWith(".")) return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
      if (acceptedType.includes("*")) return file.type.startsWith(acceptedType.split("/")[0] + "/");
      return file.type === acceptedType;
    });
  };

  const validateFileSize = (file: File): boolean => {
    return file.size <= maxSizeMB * 1024 * 1024;
  };

  const handleFileChange = async (file: File | null, onChange: (value: File | null) => void) => {
    if (file) {
      // ── Type validation ──
      if (!validateFileType(file)) {
        toast.error(`Invalid file type. Please upload ${getFileTypeDescription()}`);
        return;
      }

      // ── Size validation ──
      if (!validateFileSize(file)) {
        toast.error(`File size exceeds ${maxSizeMB}MB limit`);
        return;
      }

      // ── Ratio validation ──
      // if (allowedRatios && allowedRatios.length > 0) {
      //   const isRatioValid = await validateImageRatio(file, allowedRatios);
      //   if (!isRatioValid) {
      //     const ratioList = allowedRatios.join(" or ");
      //     toast.error(`Invalid image ratio. Please upload an image with ratio ${ratioList}`);
      //     return;
      //   }
      // }
      if (aspect) {
        const shapes = Array.isArray(aspect) ? aspect : [aspect];

        const isValid = await validateImageShape(file, shapes);

        if (!isValid) {
          toast.error(`Invalid image shape. Expected ${shapes.join(" or ")}`);
          return;
        }
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onChange(file);
      // Set form value immediately so validation passes even if upload is pending
      form.setValue(name, file);
      form.clearErrors(name);
      setIsUploading?.(true);

      const uploadRes = await uploadImage(file, folderName);
      if (uploadRes?.publicId) {
        setUploadImageCredentials({
          publicId: uploadRes?.publicId,
          secureUrl: uploadRes?.secureUrl,
          uploaded: true
        });
        form.setValue(name, uploadRes?.secureUrl);
      } else {
        // upload failed or skipped — keep the File object in the form
        form.setValue(name, file);
      }
      form.clearErrors(name);
      setIsUploading?.(false);
    } else {
      setIsUploading?.(false);
      setPreview(existingImage || null);
      onChange(null);
    }
  };

  const handleRemove = (onChange: (value: File | null) => void) => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX <= rect.left || e.clientX >= rect.right || e.clientY <= rect.top || e.clientY >= rect.bottom) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, onChange: (value: File | null) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFileChange(files[0], onChange);
  };

  const [imageMarkedForDeletion, setImageMarkedForDeletion] = useState<string | null>(null);
  const {
    formState: { isSubmitSuccessful }
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful && imageMarkedForDeletion) {
      deleteImageByURL(imageMarkedForDeletion);
      setImageMarkedForDeletion(null);
    }
  }, [isSubmitSuccessful, imageMarkedForDeletion]);

  // ── Ratio hint text for UI ─────────────────────────────
  // const ratioHint = allowedRatios && allowedRatios.length > 0 ? `Ratio: ${allowedRatios.join(" or ")}` : "";
  const ratioHint = aspect ? (Array.isArray(aspect) ? `Shape: ${aspect.join(" or ")}` : `Shape: ${aspect}`) : "";

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, formState: { errors } }) => (
        <Field className={cn(variant === "avatar" ? "gap-2" : "gap-1")}>
          {label && (
            <div className={cn("flex items-center", variant === "avatar" && "gap-1")}>
              <FieldLabel>
                <div>{label}</div>
              </FieldLabel>
            </div>
          )}

          <div
            className={cn("flex flex-col items-center", variant === "avatar" && "gap-4")}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, field.onChange)}
          >
            {variant === "dropzone" ? (
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, field.onChange)}
                className={cn(
                  "relative flex aspect-square w-full max-w-2xl flex-col items-center justify-center overflow-hidden rounded border-2 border-dashed border-gray-300 text-center text-gray-600 transition-colors md:aspect-16/7",
                  isDragging && "border-primary bg-primary/10",
                  preview ? "p-0" : "p-8",
                  disabled && "cursor-not-allowed border-gray-200 opacity-70"
                )}
              >
                {preview ? (
                  <img src={preview} alt='Preview' className='h-full rounded object-contain' />
                ) : (
                  <>
                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                      <IconUpload className='h-6 w-6 text-gray-400' />
                    </div>
                    <p className='mb-1 text-sm font-semibold text-gray-900'>
                      Drag your file or{" "}
                      <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        className={cn(
                          "text-primary cursor-pointer font-semibold underline",
                          disabled && "text-muted-foreground/60 cursor-not-allowed no-underline"
                        )}
                      >
                        Browse
                      </button>
                    </p>
                    <p className='mb-1 text-xs text-gray-500'>Only {getFileTypeDescription()} files allowed.</p>
                    {/* ── Ratio hint ── */}
                    <p className='text-xs text-gray-500'>
                      File size: Max {maxSizeMB}MB {ratioHint && `| ${ratioHint}`}
                    </p>
                  </>
                )}
                {preview && !disabled && (
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation();
                      handleRemove(field.onChange);
                      setUploadImageCredentials({ publicId: "", secureUrl: "", uploaded: false });
                      form.setValue(name, "");
                      if (existingImage && !uploadImageCredentials?.uploaded) {
                        setImageMarkedForDeletion(existingImage);
                      }
                    }}
                    className='bg-primary hover:bg-primary/80 focus:ring-primary absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-white focus:ring-2 focus:outline-none'
                    aria-label='Remove Image'
                  >
                    <IconX className='h-4 w-4' />
                  </button>
                )}
              </div>
            ) : variant === "avatar" ? (
              <div
                className={cn(
                  "relative rounded-full transition-all",
                  isDragging && "ring-primary ring-2 ring-offset-2",
                  disabled && "opacity-70 grayscale-[0.5]"
                )}
              >
                <Avatar className={cn(avatarSize, "border-primary border-2 text-xl")}>
                  <AvatarImage src={preview || undefined} className='object-cover' />
                  <AvatarFallback className='text-xl'>{fallbackText}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div
                onClick={() => !disabled && fileInputRef.current?.click()}
                className={cn(
                  "text-muted-foreground flex w-full items-center justify-between rounded-md border px-4 py-1.75 text-sm transition-all",
                  !disabled && "cursor-pointer",
                  isDragging && "ring-primary ring-2 ring-offset-2",
                  disabled && "bg-secondary/30 cursor-not-allowed opacity-70"
                )}
              >
                <span className='flex items-center gap-2 truncate'>
                  {preview ? (
                    <img src={preview} alt='Preview' className={cn("h-5 w-5 rounded object-cover", disabled && "opacity-50 grayscale")} />
                  ) : null}
                  <span className='py-0.5'>{placeholder || "Upload Image"}</span>
                </span>
                {preview && !disabled ? (
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation();
                      handleRemove(field.onChange);
                      setUploadImageCredentials({ publicId: "", secureUrl: "", uploaded: false });
                      form.setValue(name, "");
                      if (existingImage && !uploadImageCredentials?.uploaded) {
                        setImageMarkedForDeletion(existingImage);
                      }
                    }}
                    className='bg-primary hover:bg-primary/80 focus:ring-primary flex h-6 w-6 items-center justify-center rounded-full text-white focus:ring-2 focus:outline-none'
                    aria-label='Remove Image'
                  >
                    <IconX className='h-4 w-4' />
                  </button>
                ) : !preview ? (
                  <CloudUpload className={cn("size-5 text-black", disabled && "text-muted-foreground/40")} />
                ) : null}
              </div>
            )}

            <div className='flex items-center gap-1'>
              {variant === "avatar" ? (
                <label htmlFor={`${name}-upload`}>
                  <Button type='button' variant='outline' size='sm' disabled={disabled} asChild>
                    <span className={cn(!disabled && "cursor-pointer")}>
                      <IconUpload className='mr-2 h-4 w-4' />
                      Upload Image
                    </span>
                  </Button>
                </label>
              ) : null}

              <input
                id={`${name}-upload`}
                ref={fileInputRef}
                type='file'
                accept={accept}
                onChange={e => handleFileChange(e.target.files?.[0] || null, field.onChange)}
                disabled={disabled}
                className='hidden'
              />

              {preview && variant === "avatar" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type='button'
                      variant='outline'
                      className='bg-primary! text-white!'
                      size='icon'
                      disabled={disabled}
                      onClick={() => {
                        if (existingImage && !uploadImageCredentials?.uploaded) {
                          setImageMarkedForDeletion(existingImage);
                        }
                        handleRemove(field.onChange);
                        setUploadImageCredentials({ publicId: "", secureUrl: "", uploaded: false });
                        form.setValue(name, "");
                      }}
                    >
                      <IconX className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className='bg-primary [&_svg]:bg-primary [&_svg]:fill-primary text-white'>
                    <p>Remove Image</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {variant === "avatar" ? (
              <p className='text-muted-foreground text-center text-xs'>
                {description} (max. {maxSizeMB}MB)
                <br />
                Only {getFileTypeDescription()} files allowed.
              </p>
            ) : null}
          </div>

          {get(errors, name) && (
            <div
              className={cn(
                "text-destructive flex items-center gap-1",
                variant === "avatar" && "justify-center text-center",
                variant === "dropzone" && "pl-8"
              )}
            >
              <BadgeInfoIcon className='size-4' />
              <FieldError className='text-center' errors={[{ message: `${get(errors, name)?.message || "Image is required!"}` }]} />
            </div>
          )}
        </Field>
      )}
    />
  );
}
