"use client";

import { createProduct, updateProduct } from "@/actions/admin/product-management/product-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Product } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    name: z.string().trim().min(2, "Product name must be at least 2 characters").max(100, "Product name must be less than 100 characters"),
    shortDesc: z
      .string()
      .trim()
      .min(5, "Short description must be at least 5 characters")
      .max(300, "Short description must be less than 300 characters"),
    price: z.coerce.number({ invalid_type_error: "Price must be a number" }).positive("Price must be greater than 0"),
    hasDiscount: z.boolean(),
    discountPctAmount: z.coerce.number().min(0).max(100).optional().nullable(),
    discountPrice: z.coerce.number().min(0).optional().nullable(),
    status: z.boolean(),
    image: z.any().refine(
      value => {
        if (value instanceof File) return value.size > 0;
        if (typeof value === "string") return value.trim().length > 0;
        return false;
      },
      { message: "Product image is required!" }
    )
  })
  .superRefine((data, ctx) => {
    if (data.hasDiscount) {
      if (!data.discountPctAmount || data.discountPctAmount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount percentage is required when discount is enabled",
          path: ["discountPctAmount"]
        });
      }
      if (!data.discountPrice || data.discountPrice <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount price is required when discount is enabled",
          path: ["discountPrice"]
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const { push } = useRouter();
  const isEditMode = !!product?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const existingImageUrl = typeof product?.image === "object" ? product?.image?.secureUrl : (product?.image as any);
  const existingImagePublicId = typeof product?.image === "object" ? product?.image?.publicId : "";

  const [uploadImageCredentials, setUploadImageCredentials] = useState<{
    publicId: string;
    secureUrl: string;
    uploaded?: boolean;
  }>({
    publicId: existingImagePublicId || "",
    secureUrl: existingImageUrl || "",
    uploaded: false
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      shortDesc: product?.shortDesc || "",
      price: product?.price || (undefined as any),
      hasDiscount: product?.hasDiscount ?? false,
      discountPctAmount: product?.discountPctAmount ?? null,
      discountPrice: product?.discountPrice ?? null,
      status: product?.status ?? true,
      image: existingImageUrl || ""
    }
  });

  const hasDiscount = useWatch({ control: form.control, name: "hasDiscount" });

  const initials =
    useWatch({ control: form.control, name: "name", defaultValue: "" })
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "PR";

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating the product..." : "Creating the product..."
    });

    try {
      const payload: any = {
        name: data.name,
        shortDesc: data.shortDesc,
        price: data.price,
        hasDiscount: data.hasDiscount,
        status: data.status,
        image: {
          publicId: uploadImageCredentials.publicId,
          secureUrl: uploadImageCredentials.secureUrl
        }
      };

      if (data.hasDiscount) {
        payload.discountPctAmount = data.discountPctAmount;
        payload.discountPrice = data.discountPrice;
      }

      if (isEditMode) {
        const res = (await updateProduct(product._id, payload)) as any;
        if (!res?.status) throw new Error(res?.message || "Failed to update product!");
        Toast.remove(t);
        Toast.success("Product updated successfully!");
        push("/admin/product-management/brand");
      } else {
        const res = (await createProduct(payload)) as any;
        if (!res?.status) throw new Error(res?.message || "Failed to create product!");
        Toast.remove(t);
        Toast.success("Product created successfully!");
        form.reset({
          name: "",
          shortDesc: "",
          price: undefined as any,
          hasDiscount: false,
          discountPctAmount: null,
          discountPrice: null,
          status: true,
          image: ""
        });
        setUploadImageCredentials({ publicId: "", secureUrl: "", uploaded: false });
      }
    } catch (error: any) {
      Toast.remove(t);
      Toast.error(error?.message || "Failed to save product!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col space-y-6 overflow-hidden'>
        {/* Basic Info */}
        <Card className='dark:border-white/10 dark:bg-[#151515] dark:text-white'>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Basic details about the product</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <SingleImageUpload
              setIsUploading={setIsUploading}
              fallbackText={initials}
              existingImage={existingImageUrl}
              name='image'
              label='Product Image'
              avatarSize='h-42 w-42'
              folderName='products'
              setUploadImageCredentials={setUploadImageCredentials}
              description='Hint: Landscape or Square Image |'
              uploadImageCredentials={uploadImageCredentials}
              accept='image/jpg,image/jpeg,image/png,image/webp,image/avif'
            />

            <InputField name='name' label='Product Name' placeholder='Enter product name' type='text' required />

            <InputField
              name='shortDesc'
              label='Short Description'
              placeholder='Enter a short description'
              type='textarea'
              rowCount={3}
              required
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className='dark:border-white/10 dark:bg-[#151515] dark:text-white'>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Set the product price and discount</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <InputField name='price' label='Price (৳)' placeholder='Enter price' type='number' required />

            <FormSwitch name='hasDiscount' label='Has Discount' description='Enable to add a discount on this product' />

            {hasDiscount && (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <InputField name='discountPctAmount' label='Discount Percentage (%)' placeholder='e.g. 15' type='number' required />
                <InputField name='discountPrice' label='Discount Price (৳)' placeholder='e.g. 102' type='number' required />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card className='dark:border-white/10 dark:bg-[#151515] dark:text-white'>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
            <CardDescription>Control product availability</CardDescription>
          </CardHeader>
          <CardContent>
            <FormSwitch name='status' label='Active' description='Control whether this product is visible to customers' />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex justify-between gap-4 md:justify-end'>
          <Link href='/admin/product-management/brand'>
            <Button type='button' variant='outline' disabled={isLoading || isUploading} className='max-md:px-2'>
              Cancel
            </Button>
          </Link>
          <Button className='cool max-md:px-2' type='submit' disabled={isLoading || isUploading}>
            {isLoading ? "Saving..." : isEditMode ? "Update Product" : "Add New Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
