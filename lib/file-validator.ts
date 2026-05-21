// lib/file-validator.ts
export type FileValidationOptions = {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  required?: boolean;
};

export type FileValidationResult = {
  valid: boolean;
  error?: string;
  file?: File;
};

export function fileValidator(file: File | null, options: FileValidationOptions = {}): FileValidationResult {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"],
    required = true,
  } = options;

  // Check if file exists
  if (!file) {
    if (required) {
      return { valid: false, error: "Image is required!" };
    }
    return { valid: true };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type! Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB!`,
    };
  }

  return { valid: true, file };
}

export function validateMultipleFiles(files: (File | null)[], options: FileValidationOptions = {}): FileValidationResult {
  for (const file of files) {
    const result = fileValidator(file, options);
    if (!result.valid) {
      return result;
    }
  }
  return { valid: true };
}
