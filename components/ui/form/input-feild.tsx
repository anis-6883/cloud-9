"use client";

import { cn } from "@/lib/utils";
import { BadgeInfo, Eye, EyeOff } from "lucide-react";
import React, { InputHTMLAttributes, useState } from "react";
import { Controller, get, useFormContext } from "react-hook-form";
import { Input } from "../input";

export const ErrorStr = ({ message = "Required", className }: { message?: string; className?: string }) => {
  return (
    <p className={cn("text-destructive flex items-center gap-1 text-sm", className)}>
      <BadgeInfo className='size-4 shrink-0' />
      {message}
    </p>
  );
};

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  name: string;
  label?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  onPrefixClick?: () => void;
  onSuffixClick?: () => void;
  prefixIconClassName?: string;
  suffixIconClassName?: string;
  minNum?: number;
  isFieldReadOnly?: boolean;
  isFieldDisabled?: boolean;
  allowDecimal?: boolean;
  inputClassName?: string;
}

export default function InputField({
  name,
  label,
  type = "text",
  className,
  prefixIcon,
  suffixIcon,
  onPrefixClick,
  onSuffixClick,
  prefixIconClassName,
  suffixIconClassName,
  minNum,
  isFieldReadOnly,
  isFieldDisabled,
  allowDecimal,
  inputClassName,
  maxLength,
  placeholder,
  required,
  ...props
}: InputFieldProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const renderIconButton = (icon: React.ReactNode, position: "left" | "right", onClick?: () => void, iconClass?: string) => (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-white",
        position === "left" ? "left-3" : "right-3",
        iconClass,
        onClick ? "cursor-pointer" : "cursor-default"
      )}
      tabIndex={-1}
    >
      {icon}
    </button>
  );

  const iconPaddingClass = cn(prefixIcon ? "pl-10" : "", suffixIcon || isPassword ? "pr-10" : "");

  const error = get(errors, name)?.message as string | undefined;

  return (
    <div className='flex flex-col gap-1.5'>
      {/* Label */}
      {label && (
        <label className='ml-1.5 text-sm font-medium text-gray-500'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className='relative flex items-center'>
            {/* Prefix icon */}
            {prefixIcon && renderIconButton(prefixIcon, "left", onPrefixClick, prefixIconClassName)}

            <Input
              min={minNum}
              {...field}
              {...props}
              className={cn(
                "h-11 w-full border px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0",
                isFieldReadOnly ? "bg-muted cursor-not-allowed text-black!" : "bg-black/30 backdrop-blur-md",
                error ? "border-red-500" : "border-gray-600",
                iconPaddingClass,
                inputClassName,
                className
              )}
              disabled={isFieldDisabled}
              type={isPassword ? (showPassword ? "text" : "password") : type === "number" ? "text" : type}
              id={name}
              placeholder={placeholder}
              readOnly={isFieldReadOnly}
              maxLength={maxLength}
              onWheel={e => type === "number" && (e.target as HTMLInputElement)?.blur()}
              onChange={e => {
                let value: string | number = e.target.value;

                if (type === "number") {
                  if (allowDecimal) {
                    // Allow digits and dot
                    value = value.replace(/[^0-9.]/g, "");

                    // Prevent more than one decimal point
                    const parts = value.split(".");
                    if (parts.length > 2) {
                      value = parts[0] + "." + parts.slice(1).join("");
                    }

                    // Smart conversion
                    const isIntermediateDecimal = value.includes(".") && (value.endsWith(".") || value.endsWith("0"));

                    if (value === "") {
                      field.onChange("");
                    } else if (isIntermediateDecimal) {
                      field.onChange(value);
                    } else {
                      field.onChange(Number(value));
                    }
                  } else {
                    value = value.replace(/[^0-9]/g, "");
                    field.onChange(value === "" ? "" : Number(value));
                  }
                } else {
                  if (maxLength && typeof value === "string") value = value.slice(0, maxLength);
                  field.onChange(value);
                }
              }}
            />

            {/* Suffix icon or Password Toggle */}
            {isPassword ? (
              <button
                type='button'
                onClick={() => setShowPassword(prev => !prev)}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 cursor-pointer'
                tabIndex={-1}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            ) : (
              suffixIcon && renderIconButton(suffixIcon, "right", onSuffixClick, suffixIconClassName)
            )}
          </div>
        )}
      />

      {/* Error Message */}
      {(() => {
        const fieldError = get(errors, name);
        return fieldError?.message ? <ErrorStr message={fieldError.message as string} /> : null;
      })()}
    </div>
  );
}
