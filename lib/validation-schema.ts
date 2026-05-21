import { z } from "zod";
import { stringField } from "./utils";

export const adminLoginSchema = z.object({
  email: stringField({ required: true, isEmail: true }),
  password: stringField({ required: true, allowNumber: true })
});

export const adminPasswordChangeSchema = z
  .object({
    oldPassword: stringField({ required: true, allowNumber: true }),
    newPassword: stringField({ required: true, minLength: 6, allowNumber: true }),
    confirmPassword: stringField({ required: true, allowNumber: true })
  })
  .refine(data => data.newPassword !== data.oldPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"]
  });

export const uploadFileSchema = z.object({
  folderName: stringField({ required: false })
});

export const imgDeleteSchema = z.object({
  url: stringField({ required: true, isUrl: true })
});
