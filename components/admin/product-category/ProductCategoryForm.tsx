"use client";

import { createProductCategory, updateProductCategory } from "@/actions/admin/product-management/product-category-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import routes from "@/config/routes";
import { ProductCategory } from "@/lib/types";
import { generateSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { BsTrash } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import * as z from "zod";

const subcategorySchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(2, "Subcategory name must be at least 2 characters")
    .max(50, "Subcategory name must be less than 50 characters"),
  // .regex(/^[a-zA-Z0-9\s&-]+$/, "Only letters, numbers, spaces, &, and - are allowed"),
  status: z.boolean()
});

const formSchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(50, "Category name must be less than 50 characters"),
  // .regex(/^[a-zA-Z0-9\s&-]+$/, "Only letters, numbers, spaces, &, and - are allowed"),
  status: z.boolean(),
  image: z.any().refine(
    value => {
      if (value instanceof File) return value.size > 0;
      if (typeof value === "string") return value.trim().length > 0;
      return false;
    },
    {
      message: "Logo is required!"
    }
  ),
  subCategories: z.array(subcategorySchema)
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
      image: category?.image || "",
      subCategories: category?.subCategories || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subCategories"
  });

  const addSubcategory = () => {
    append({
      name: "",
      status: true
    });
  };

  const initials =
    useWatch({
      control: form.control,
      name: "name",
      defaultValue: ""
    })
      ?.split(" ")
      .map(n => n[0])
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
      if (isEditMode) {
        const updatedSubcategoryIds = new Set(data.subCategories.map((sub: any) => sub._id));

        const deletedSubcategories = category?.subCategories
          ? category?.subCategories.filter((sub: any) => !updatedSubcategoryIds.has(sub._id)).map((sub: any) => ({ ...sub, _delete: true }))
          : [];

        const _updatedCategory: any = {
          ...data,
          subCategories: [
            ...data.subCategories.map((sub: any) => ({
              ...sub,
              slug: generateSlug(sub.name)
            })),
            ...deletedSubcategories
          ]
        };

        if (uploadImageCredentials.uploaded) {
          _updatedCategory.image = uploadImageCredentials.publicUrl;
          _updatedCategory._uploaded = true;
        }

        await updateProductCategory(category._id, _updatedCategory);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Category updated successfully!" });
        push(routes.privateRoutes.admin.productManagement.productCategory.home);
      } else {
        if (uploadImageCredentials.uploaded) {
          data.image = uploadImageCredentials.publicUrl;
        }

        // Generate slug on Create
        data.slug = generateSlug(data.name);
        data.subCategories = data.subCategories.map((sub: any) => ({
          ...sub,
          slug: generateSlug(sub.name)
        }));

        await createProductCategory(data);
        setIsLoading(false);
        Toast.remove(t);
        Toast.success({ title: "Success", description: "Category created successfully!" });
        push(routes.privateRoutes.admin.productManagement.productCategory.home);
      }
    } catch (error: any) {
      setIsLoading(false);
      Toast.remove(t);
      Toast.error({ title: "Failed", description: error?.message || "Failed to category operation!" });
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

        <Card className='dark:border-white/10 dark:bg-[#151515] dark:text-white'>
          <CardHeader>
            <CardTitle>Subcategories</CardTitle>
            <CardDescription>Manage subcategories for this category</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {fields.length === 0 ? (
              <div className='space-y-6 border border-dashed p-8 text-center dark:border-white/10'>
                <p className='text-muted-foreground text-sm'>No subcategories yet. Click "Add Subcategory" to create one.</p>
                <Button type='button' variant='outline' className='' onClick={addSubcategory}>
                  <FiPlus className='mr-2 h-4 w-4' />
                  Add Subcategory
                </Button>
              </div>
            ) : (
              fields.map((field, index) => (
                <Card key={field.id} className='shadow-none dark:border-white/10 dark:bg-[#151515] dark:text-white'>
                  <CardContent className='space-y-4 pt-6'>
                    <div className='mb-4 flex items-center justify-between'>
                      <Badge className='rounded-full font-bold text-white ring-1'>Subcategory: {index + 1}</Badge>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='outline'
                            className='border-primary rounded-full'
                            size='icon'
                            onClick={() => remove(index)}
                          >
                            <BsTrash className='text-primary text-2xl dark:text-white' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className='bg-primary [&_svg]:bg-primary [&_svg]:fill-primary text-white'>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <InputField
                      name={`subCategories.${index}.name`}
                      label='Name'
                      placeholder='Enter subcategory name'
                      type='text'
                      required
                    />
                    <FormSwitch
                      name={`subCategories.${index}.status`}
                      label='Visibility'
                      description='Control whether this subcategory appears on the landing page!'
                    />
                  </CardContent>
                </Card>
              ))
            )}

            {fields.length > 0 && (
              <div className='mt-10 flex justify-end'>
                <Button type='button' variant='outline' onClick={addSubcategory}>
                  <FiPlus className='mr-2 h-4 w-4' />
                  Add Subcategory
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <div className='flex justify-between gap-4 md:justify-end'>
          <Link href={routes.privateRoutes.admin.productManagement.productCategory.home}>
            <Button type='button' variant='outline' disabled={isLoading || isUploading} className='max-md:px-2'>
              Cancel
            </Button>
          </Link>
          <Button className='cool max-md:px-2' type='submit' disabled={isLoading || isUploading}>
            {isEditMode ? "Update Product Category" : "Add New Product Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
