"use client";

import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import routes from "@/config/routes";
import { ProductCategory } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
  const isEditMode = !!category?._id;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadImageCredentials, setUploadImageCredentials] = useState<{
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }>({
    fileKey: "",
    publicUrl: "",
    uploaded: false
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      status: category?.status ?? true,
      image: category?.image || ""
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
    console.log("Form data:", data);
    console.log("All form values:", form.getValues());
    console.log("Upload credentials:", uploadImageCredentials);
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
              existingImage={category?.image}
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
          <Link href={routes.privateRoutes.admin.productManagement.productCategory.home}>
            <Button type='button' variant='outline' disabled={isUploading} className='max-md:px-2'>
              Cancel
            </Button>
          </Link>
          <Button className='cool max-md:px-2' type='submit' disabled={isUploading}>
            {isEditMode ? "Update Product Category" : "Add New Product Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
