"use client";

import { createProductCategory, updateProductCategory } from "@/actions/admin/product-management/product-category-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ProductCategory } from "@/lib/types";
import { generateSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(50, "Category name must be less than 50 characters"),
  status: z.boolean(),
  image: z.any().refine(
    value => {
      if (value instanceof File) return value.size > 0;
      if (typeof value === "string") return value.trim().length > 0;
      return false;
    },
    { message: "Logo is required!" }
  )
});

type FormValues = z.infer<typeof formSchema>;

interface ProductCategoryFormClientProps {
  category?: ProductCategory;
}

export default function ProductCategoryForm({ category }: ProductCategoryFormClientProps) {
  const { push } = useRouter();
  const isEditMode = !!category?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const existingImageUrl = typeof category?.image === "object" ? category?.image?.secureUrl : category?.image;
  const existingImagePublicId = typeof category?.image === "object" ? category?.image?.publicId : "";

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
      name: category?.name || "",
      status: category?.status ?? true,
      image: existingImageUrl || ""
    }
  });

  const initials =
    useWatch({
      control: form.control,
      name: "name",
      defaultValue: ""
    })
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "Logo";

  // Submit Handler
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating the category..." : "Creating the category..."
    });

    try {
      const payload = {
        name: data.name,
        slug: generateSlug(data.name),
        image: {
          publicId: uploadImageCredentials.publicId,
          secureUrl: uploadImageCredentials.secureUrl
        }
      };

      if (isEditMode) {
        const res = (await updateProductCategory(category._id, payload)) as any;
        if (!res?.status) throw new Error(res?.message || "Failed to update category!");
        Toast.remove(t);
        Toast.success("Category updated successfully!");
        push("/admin/foods/categories");
      } else {
        const res = (await createProductCategory(payload)) as any;
        if (!res?.status) throw new Error(res?.message || "Failed to create category!");
        Toast.remove(t);
        Toast.success("Category created successfully!");
        form.reset({ name: "", status: true, image: "" });
        setUploadImageCredentials({ publicId: "", secureUrl: "", uploaded: false });
      }
    } catch (error: any) {
      Toast.remove(t);
      Toast.error("Failed to save category!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col space-y-6 overflow-hidden'>
        <Card className='dark:border-white/10 dark:bg-[#151515] dark:text-white'>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>Basic information about the category</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <SingleImageUpload
              setIsUploading={setIsUploading}
              fallbackText={initials}
              existingImage={existingImageUrl}
              name='image'
              label='Logo'
              avatarSize='h-42 w-42'
              folderName='product-category'
              setUploadImageCredentials={setUploadImageCredentials}
              description='Hint: Circular Shape Image |'
              uploadImageCredentials={uploadImageCredentials}
              accept='image/jpg,image/jpeg,image/png,image/webp,image/avif'
            />
            <InputField name='name' label='Name' placeholder='Enter category name' type='text' required />
            <FormSwitch name='status' label='Visibility' description='Control whether this category appears on the landing page!' />
          </CardContent>
        </Card>

        <div className='flex justify-between gap-4 md:justify-end'>
          <Link href='/admin/foods/categories'>
            <Button type='button' variant='outline' disabled={isLoading || isUploading} className='max-md:px-2'>
              Cancel
            </Button>
          </Link>
          <Button className='cool max-md:px-2' type='submit' disabled={isLoading || isUploading}>
            {isLoading ? "Saving..." : isEditMode ? "Update Product Category" : "Add New Product Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
