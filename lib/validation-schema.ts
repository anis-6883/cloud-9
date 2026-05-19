import { z } from "zod";
import { stringField } from "./utils";

export const adminLoginSchema = z.object({
  email: stringField({ required: true, isEmail: true }),
  password: stringField({ required: true })
});

export const adminPasswordChangeSchema = z
  .object({
    oldPassword: stringField({ required: true }),
    newPassword: stringField({ required: true, minLength: 6 }),
    confirmPassword: stringField({ required: true })
  })
  .refine(data => data.newPassword !== data.oldPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"]
  });
