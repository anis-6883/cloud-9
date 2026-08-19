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
  image?: string | { publicId: string; secureUrl: string };
  status?: boolean;
  slug: string;
  subCategories?: ProductCategory[];
  totalProducts?: number;
};

export type Product = {
  _id: string;
  name: string;
  image: { publicId: string; secureUrl: string };
  shortDesc: string;
  price: number;
  hasDiscount: boolean;
  discountPctAmount?: number;
  discountPrice?: number;
  status: boolean;
  createdAt: string;
};

export type ProductPagination = {
  page: number;
  limit: number;
  totalPage: number;
  totalDocs: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type Customer = {
  _id: string;
  name: string;
  email: string;
  provider: string;
  isEmailVerified?: boolean;
  image?: { publicId: string; secureUrl: string };
  dialCode?: string;
  phone?: string;
  dob?: string;
  status: boolean;
  createdAt: string;
};
