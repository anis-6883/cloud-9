"use client";

import { createCustomer, updateCustomer } from "@/actions/admin/user-management/customer-actions";
import FormSwitch from "@/components/form/FormSwitch";
import InputField from "@/components/form/InputField";
import SingleImageUpload from "@/components/form/SingleImageUpload";
import Toast from "@/components/shared/Toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Customer } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().optional(),
    dialCode: z
      .string()
      .trim()
      .min(1, "Dial code is required")
      .regex(/^\+\d{1,4}$/, "Enter a valid dial code (e.g. +880)"),
    phone: z
      .string()
      .trim()
      .min(7, "Phone number must be at least 7 digits")
      .max(15, "Phone number must be at most 15 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    dob: z.string().min(1, "Date of birth is required"),
    status: z.boolean(),
    image: z
      .any()
      .optional()
      .nullable()
      .refine(
        value => {
          if (!value) return true;
          if (value instanceof File) return value.size > 0;
          if (typeof value === "string") return value.trim().length > 0;
          return false;
        },
        { message: "Invalid image!" }
      )
  })
  .superRefine((data, ctx) => {
    if (!data.password || data.password.length === 0) {
      // password required on create — handled per mode in the form
    } else if (data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 6 characters",
        path: ["password"]
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

interface CustomerFormProps {
  customer?: Customer;
}

export default function CustomerForm({ customer }: CustomerFormProps) {
  const { push } = useRouter();
  const isEditMode = !!customer?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const existingImageUrl = typeof customer?.image === "object" ? customer?.image?.secureUrl : (customer?.image as any);
  const existingImagePublicId = typeof customer?.image === "object" ? customer?.image?.publicId : "";

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
      name: customer?.name || "",
      email: customer?.email || "",
      password: "",
      dialCode: customer?.dialCode || "+880",
      phone: customer?.phone || "",
      dob: customer?.dob ? customer.dob.split("T")[0] : "",
      status: customer?.status ?? true,
      image: existingImageUrl || ""
    }
  });

  const initials =
    useWatch({ control: form.control, name: "name", defaultValue: "" })
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CU";

  const handleSubmit = async (data: FormValues) => {
    // Extra check: password required on create
    if (!isEditMode && (!data.password || data.password.trim().length === 0)) {
      form.setError("password", { message: "Password is required" });
      return;
    }

    setIsLoading(true);
    const t = Toast.loading({
      title: "Status",
      description: isEditMode ? "Updating the customer..." : "Creating the customer..."
    });

    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        provider: "email",
        dialCode: data.dialCode,
        phone: data.phone,
        dob: data.dob,
        status: data.status,
        image: {
          publicId: uploadImageCredentials.publicId,
          secureUrl: uploadImageCredentials.secureUrl
        }
      };

      if (!isEditMode) {
        payload.password = data.password;
      }

      if (isEditMode) {
        const res = (await updateCustomer(customer._id, payload)) as any;
        if (!res?.status) throw new Error(res?.message || "Failed to update customer!");
        Toast.remove(t);
        Toast.success("Customer updated successfully!");
        push("/admin/user-management/customer");
      } else {
        const res = (await createCustomer(payload)) as any;
        if (!res?.status) throw new Error(res?.message || "Failed to create customer!");
        Toast.remove(t);
        Toast.success("Customer created successfully!");
        form.reset({
          name: "",
          email: "",
          password: "",
          dialCode: "+880",
          phone: "",
          dob: "",
          status: true,
          image: ""
        });
        setUploadImageCredentials({ publicId: "", secureUrl: "", uploaded: false });
      }
    } catch (error: any) {
      Toast.remove(t);
      Toast.error(error?.message || "Failed to save customer!");
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
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Basic details about the customer</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <SingleImageUpload
              setIsUploading={setIsUploading}
              fallbackText={initials}
              existingImage={existingImageUrl}
              name='image'
              label='Profile Image'
              avatarSize='h-28 w-28'
              folderName='customers'
              setUploadImageCredentials={setUploadImageCredentials}
              description='Hint: Square Image recommended |'
              uploadImageCredentials={uploadImageCredentials}
              accept='image/jpg,image/jpeg,image/png,image/webp,image/avif'
            />

            <InputField name='name' label='Full Name' placeholder='Enter full name' type='text' required />
            <InputField name='email' label='Email Address' placeholder='Enter email address' type='text' required />

            {!isEditMode && <InputField name='password' label='Password' placeholder='Enter password' type='password' required />}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className='dark:border-white/10 dark:bg-[#151515] dark:text-white'>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
            <CardDescription>Phone number and date of birth</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <InputField name='dialCode' label='Dial Code' placeholder='+880' type='text' required />
              <div className='sm:col-span-2'>
                <InputField name='phone' label='Phone Number' placeholder='e.g. 1712345678' type='text' required />
              </div>
            </div>
            <InputField name='dob' label='Date of Birth' placeholder='Pick a date' type='date' required isDisabledPreviousDate={false} />
          </CardContent>
        </Card>

        {/* Status */}
        <Card className='dark:border-white/10 dark:bg-[#151515] dark:text-white'>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Control customer account availability</CardDescription>
          </CardHeader>
          <CardContent>
            <FormSwitch name='status' label='Active' description='Control whether this customer account is active' />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex justify-between gap-4 md:justify-end'>
          <Link href='/admin/user-management/customer'>
            <Button type='button' variant='outline' disabled={isLoading || isUploading} className='max-md:px-2'>
              Cancel
            </Button>
          </Link>
          <Button className='cool max-md:px-2' type='submit' disabled={isLoading || isUploading}>
            {isLoading ? "Saving..." : isEditMode ? "Update Customer" : "Add New Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
