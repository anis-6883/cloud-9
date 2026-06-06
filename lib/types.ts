export interface StringFieldOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  allowNumber?: boolean;
  isUrl?: boolean;
  enum?: string[];
}

export type TDropzoneMultiple = {
  name: string;
  folderName?: string;
  maxNum?: number; // Max files to be uploaded, default is 5
  maxSize?: number; // Max file size (in bytes), default is 5MB
  accept?: Record<string, string[]>; // Accepted file types
  disabled?: boolean; // Disable the dropzone
  placeholder?: string;
  colors?: string[];
  uploadMultipleImageCredentials?: {
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }[];
  setIsImageUploading?: (value: boolean) => void;
  setUploadMultipleImageCredentials?: (
    value: {
      fileKey: string;
      publicUrl: string;
      uploaded?: boolean;
    }[]
  ) => void;
};

export type ProductCategory = {
  _id: string;
  name: string;
  image: string;
  status?: boolean;
  slug: string;
  subCategories?: ProductCategory[];
  totalProducts?: number;
};
