"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { BadgeInfo, CalendarIcon, Clock, Eye, EyeOff, FileText, InfoIcon, UploadCloud } from "lucide-react";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import { Controller, get, useFormContext } from "react-hook-form";
import ReactSelect from "react-select";
import ImageWithFallback from "../shared/ImageWithFallback";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ColorWiseImageFile from "./ColorWiseImageFile";
import DropzoneMultiple from "./DropzoneMultiple";
import DropzoneMultipleFiles from "./DropzoneMultipleFiles";
import DropzoneSingle from "./DropzoneSingle";
import DropzoneSingleFile from "./DropzoneSingleFile";
import DropzoneSingleNew from "./DropzoneSingleNew";
import RichTextEditor from "./RichTextEditor";
import { SearchableSelectField } from "./SearchableSelectField";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string; type?: string; image?: string; [key: string]: any }[];
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  radioGroupClassName?: string;
  selectTriggerClassName?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  allowDecimal?: boolean;
  rowCount?: number;
  maxNum?: number;
  minNum?: number;
  maxSize?: number;
  maxLength?: number;
  autoComplete?: "current-password" | "new-password" | "off";
  folderName?: string;
  editorHeight?: string;
  setIsImageUploading?: (value: boolean) => void;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "rich-text"
    | "react-select"
    | "react-select-multi"
    | "image-zip-multiple"
    | "image"
    | "colorWiseImage"
    | "image-c"
    | "image-multiple"
    | "file"
    | "checkbox"
    | "switch"
    | "datetime"
    | "date"
    | "custom-file"
    | "time"
    | "phone"
    | "radio-group"
    | "dropdown-select"
    | "input-with-search";
  flatpickrOptions?: any;
  colors?: string[];

  // ── CustomInput optional props ──────────────────────────────────────────────
  /** Node rendered above the input on the left side */
  topLeftLabel?: React.ReactNode;
  /** Node rendered above the input on the right side */
  topRightLabel?: React.ReactNode;
  /** Node rendered below the input on the left side */
  bottomLeftLabel?: React.ReactNode;
  /** Node rendered below the input on the right side */
  bottomRightLabel?: React.ReactNode;
  /** Icon/element placed inside the input on the left */
  prefixIcon?: React.ReactNode;
  /** Icon/element placed inside the input on the right */
  suffixIcon?: React.ReactNode;
  /** Tooltip content for the prefix icon */
  prefixTooltipContent?: string;
  /** Tooltip content for the suffix icon */
  suffixTooltipContent?: string;
  /** Click handler for the prefix icon – makes it interactive when provided */
  onPrefixClick?: () => void;
  /** Click handler for the suffix icon – makes it interactive when provided */
  onSuffixClick?: () => void;
  /** Extra className applied to the prefix icon wrapper */
  prefixIconClassName?: string;
  /** Extra className applied to the suffix icon wrapper */
  suffixIconClassName?: string;
  /** Tooltip content for the label */
  tooltipContent?: string;
  uploadMultipleImageCredentials?: {
    fileKey: string;
    publicUrl: string;
    uploaded?: boolean;
  }[];

  setUploadMultipleImageCredentials?: (
    value: {
      fileKey: string;
      publicUrl: string;
      uploaded?: boolean;
    }[]
  ) => void;
  // cb mean callback function, this use for select filed only
  cb?: (value: any) => any;
  isDisabledPreviousDate?: boolean;
};

function InputField(props: Props) {
  const {
    name,
    type,
    label,
    placeholder,
    options = [],
    className,
    labelClassName,
    inputClassName,
    radioGroupClassName,
    readOnly,
    disabled,
    maxNum,
    autoComplete,
    editorHeight,
    maxLength,
    maxSize = 5 * 1024 * 1024, // 5MB default
    required,
    minNum,
    allowDecimal = true,
    flatpickrOptions = {},
    rowCount = 2,
    selectTriggerClassName,
    colors,
    setIsImageUploading,
    // CustomInput props (all optional)
    folderName,
    topLeftLabel,
    topRightLabel,
    bottomLeftLabel,
    bottomRightLabel,
    prefixIcon,
    suffixIcon,
    onPrefixClick,
    onSuffixClick,
    prefixIconClassName,
    suffixIconClassName,
    tooltipContent,
    prefixTooltipContent,
    suffixTooltipContent,
    uploadMultipleImageCredentials,
    setUploadMultipleImageCredentials,
    cb,
    isDisabledPreviousDate = true
  } = props;

  const {
    control,
    formState: { errors, isSubmitting }
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Combined disabled / read-only state
  const isFieldDisabled = disabled || isSubmitting;
  const isFieldReadOnly = readOnly || isSubmitting;

  // ── Inline label row helper ────────────────────────────────────────────────
  /**
   * Renders the top or bottom label row only when at least one side has content.
   * `side` controls spacing: "top" → mb-2, "bottom" → mt-2.
   */
  const renderLabelRow = (left: React.ReactNode | undefined, right: React.ReactNode | undefined, side: "top" | "bottom") => {
    if (!left && !right) return null;
    return (
      <div className={cn("flex items-center justify-between", side === "top" ? "mb-2" : "mt-2")}>
        {left && <div className='text-muted-foreground text-xs font-medium'>{left}</div>}
        {right && <div className='text-muted-foreground text-xs font-medium'>{right}</div>}
      </div>
    );
  };

  // ── Icon wrapper helper ────────────────────────────────────────────────────
  /**
   * Wraps a prefix/suffix icon in a correctly-positioned button.
   * The button is interactive only when an onClick handler is supplied.
   */
  const renderIconButton = (icon: React.ReactNode, side: "left" | "right", onClick: (() => void) | undefined, extraClassName?: string) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type='button'
          onClick={onClick}
          disabled={!onClick}
          className={cn(
            "absolute top-1/2 flex -translate-y-1/2 items-center justify-center",
            side === "left" ? "left-3" : "right-3",
            onClick ? "cursor-pointer" : "cursor-default",
            !onClick && "pointer-events-none",
            extraClassName
          )}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className='max-w-xs'>{side === "left" ? prefixTooltipContent : suffixTooltipContent}</p>
      </TooltipContent>
    </Tooltip>
  );

  // ── Input padding helper ───────────────────────────────────────────────────
  /**
   * Returns additional padding classes for the inner <Input /> so text is
   * never obscured by a prefix/suffix icon.
   */
  const iconPaddingClass = cn(prefixIcon ? "pl-9!" : "pl-3", suffixIcon ? "pr-9!" : "pr-3");

  // ── Field renderer ─────────────────────────────────────────────────────────
  const renderInputField = (field: any) => {
    switch (type) {
      // ── Checkbox ────────────────────────────────────────────────────────────
      case "checkbox":
        return (
          <div className='flex flex-col gap-3'>
            <div className='flex flex-wrap gap-4'>
              {options?.map(({ label, value, type }) => (
                <div className='flex w-60 items-center gap-3' key={value}>
                  <Checkbox
                    className='h-5 w-5'
                    checked={field.value?.includes(value)}
                    onCheckedChange={checked =>
                      checked
                        ? field.onChange([...(field?.value || []), value])
                        : field.onChange(field.value?.filter((v: string) => v !== value))
                    }
                    id={`${name}-${value}`}
                    value={value}
                    disabled={isFieldDisabled}
                  />
                  <label htmlFor={`${name}-${value}`} className='flex cursor-pointer flex-col text-sm'>
                    {label}
                    <span className={`text-xs font-medium capitalize ${type === "ios" ? "text-green-500" : "text-blue-500"}`}>{type}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "input-with-search":
        return (
          <SearchableSelectField field={field} options={options} placeholder={placeholder} isFieldDisabled={isFieldDisabled} cb={cb} />
        );

      case "custom-file":
        return (
          <div className='space-y-1'>
            <label
              htmlFor={name}
              className={cn(
                "border-input hover:border-primary flex h-11 w-full cursor-pointer items-center justify-between rounded-md border px-3 transition-colors",
                field.value?.[0] ? "border-primary/50 bg-primary/5" : "bg-background border-dashed"
              )}
            >
              <span className={cn(field.value?.[0] ? "text-foreground text-sm" : "text-muted-foreground text-sm")}>
                {field.value?.[0]?.name ?? placeholder ?? "Upload file"}
              </span>

              {field.value?.[0] ? (
                <FileText className='text-primary size-4 shrink-0' />
              ) : (
                <UploadCloud className='text-muted-foreground size-4 shrink-0' />
              )}
            </label>

            <input
              id={name}
              type='file'
              accept='.pdf,.jpg,.jpeg,.png'
              className='hidden'
              disabled={isFieldDisabled}
              onChange={e => field.onChange(e.target.files)}
            />
          </div>
        );

      // ── Switch ──────────────────────────────────────────────────────────────
      case "switch":
        return (
          <div className='flex items-center gap-3'>
            <Label htmlFor={name}>{field.value ? "Active" : "Inactive"}</Label>
            <Switch checked={!!field.value} onCheckedChange={val => field.onChange(val)} id={name} disabled={isFieldDisabled} />
          </div>
        );
      case "radio-group":
        return (
          <RadioGroup
            value={field.value}
            onValueChange={val => field.onChange(val)}
            className={cn("flex flex-wrap gap-5", radioGroupClassName)}
            disabled={isFieldDisabled}
          >
            {options?.map(option => (
              <div key={option.value} className={"flex items-center gap-2"}>
                <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                <Label htmlFor={`${name}-${option.value}`} className='cursor-pointer'>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      // ── Date picker ─────────────────────────────────────────────────────────
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn("w-full justify-start text-left font-normal", inputClassName, !field.value && "text-muted-foreground")}
                disabled={isFieldDisabled}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {field.value ? format(new Date(field.value), "yyyy-MM-dd") : placeholder || "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={date => {
                  if (!date) return;
                  field.onChange(format(date, "yyyy-MM-dd"));
                }}
                disabled={
                  isFieldDisabled
                    ? true
                    : isDisabledPreviousDate && {
                        before: new Date()
                      }
                }
                captionLayout='dropdown'
              />
            </PopoverContent>
          </Popover>
        );

      // ── Phone ───────────────────────────────────────────────────────────────
      case "phone":
        return (
          <div className='flex flex-col gap-1'>
            <div className={cn("bg-background flex w-full items-center overflow-hidden rounded-lg border", isFocused && "border-primary")}>
              {/* Country code */}
              <div className='bg-muted flex items-center gap-2 border-r px-3 py-2.5'>
                <svg xmlns='http://www.w3.org/2000/svg' width='31' height='20' viewBox='0 0 31 20' fill='none'>
                  <path
                    d='M2.38095 0H28.0952C29.4107 0 30.4762 1.06548 30.4762 2.38095V17.619C30.4762 18.9345 29.4107 20 28.0952 20H2.38095C1.06548 20 0 18.9345 0 17.619V2.38095C0 1.06548 1.06548 0 2.38095 0Z'
                    fill='#006A4E'
                  />
                  <path
                    d='M13.8924 16.1775C17.3047 16.1775 20.071 13.4112 20.071 9.99889C20.071 6.58655 17.3047 3.82031 13.8924 3.82031C10.4801 3.82031 7.71382 6.58655 7.71382 9.99889C7.71382 13.4112 10.4801 16.1775 13.8924 16.1775Z'
                    fill='#F42A41'
                  />
                  <path
                    d='M29.9345 0.869048C29.4821 0.315476 28.8036 0 28.0952 0H2.38095C1.06548 0 0 1.06548 0 2.38095V17.619C0 18.1786 0.196429 18.7143 0.553572 19.1429C0.601191 19.2024 0.654762 19.256 0.708333 19.3155C1.15476 19.756 1.75595 20 2.38095 20H28.0952C29.4107 20 30.4762 18.9345 30.4762 17.619V2.38095C30.4762 1.82738 30.2857 1.29167 29.9345 0.869048ZM2.38095 18.5714C2.23214 18.5714 2.08333 18.5357 1.95238 18.4702C1.8631 18.4286 1.78571 18.369 1.72024 18.2976C1.53571 18.119 1.43452 17.875 1.43452 17.625V2.375C1.43452 1.85119 1.85714 1.42857 2.38095 1.42857H28.1071C28.5357 1.43452 28.9107 1.72024 29.0238 2.1369C28.3691 13.2679 21.0476 17.2381 17.1071 18.5714H2.38095Z'
                    fill='url(#paint0_linear_2001_79812)'
                  />
                  <defs>
                    <linearGradient
                      id='paint0_linear_2001_79812'
                      x1='3.31679'
                      y1='-1.92202'
                      x2='27.1601'
                      y2='21.9213'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopOpacity='0.05' />
                      <stop offset='1' stopOpacity='0.3' />
                    </linearGradient>
                  </defs>
                </svg>
                <span className='text-muted-foreground text-sm font-medium'>+880</span>
              </div>

              {/* Phone number input */}
              <Input
                {...field}
                type='text'
                placeholder={placeholder || "XXXXXXXXXX"}
                className={cn(
                  "flex-1 rounded-none border-0 tracking-wide focus-visible:ring-0 focus-visible:ring-offset-0",
                  inputClassName,
                  isFieldReadOnly ? "bg-muted cursor-not-allowed" : "bg-background"
                )}
                readOnly={isFieldReadOnly}
                disabled={isFieldDisabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={field.value?.startsWith("+880") ? field.value.slice(4) : field.value}
                onChange={e => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  const limitedValue = maxLength ? value.slice(0, maxLength) : value;
                  field.onChange("+880" + limitedValue);
                }}
                inputMode='numeric'
                pattern='[0-9]*'
              />

              {/* Character counter */}
              {maxLength && (
                <span className='text-muted-foreground p-2 text-xs'>
                  {(field.value?.startsWith("+880") ? field.value.slice(4) : field.value)?.length || 0}/{maxLength}
                </span>
              )}
            </div>
          </div>
        );

      // ── Datetime ────────────────────────────────────────────────────────────
      case "datetime":
        return (
          <div className='relative'>
            <Flatpickr
              id={name}
              value={field.value && new Date(field.value)}
              onChange={date => field.onChange(format(date[0], "yyyy-MM-dd HH:mm:ss"))}
              options={{ enableTime: true, time_24hr: false, ...flatpickrOptions }}
              className='placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 pr-10 text-sm shadow-xs focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50'
              disabled={isFieldDisabled}
            />
            <CalendarIcon size={18} className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2' />
          </div>
        );

      // ── Time ────────────────────────────────────────────────────────────────
      case "time":
        return (
          <div className='relative'>
            <Flatpickr
              id={name}
              value={field.value || ""}
              onChange={date => {
                if (!date[0]) return;
                field.onChange(format(date[0], "HH:mm"));
              }}
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                ...flatpickrOptions
              }}
              className='placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-1 pr-10 text-sm shadow-xs focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50'
              disabled={isFieldDisabled}
            />
            <Clock size={18} className='text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2' />
          </div>
        );

      // ── Textarea ────────────────────────────────────────────────────────────
      case "textarea":
        return (
          <Textarea
            disabled={isFieldDisabled}
            {...field}
            id={name}
            placeholder={placeholder}
            rows={rowCount}
            className={cn("focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0", inputClassName)}
          />
        );

      // ── Rich-text ───────────────────────────────────────────────────────────
      case "rich-text":
        return <RichTextEditor name={name} disabled={isFieldDisabled} height={editorHeight} />;

      // ── React-select (single + multi) ───────────────────────────────────────
      case "react-select":
      case "react-select-multi":
        return (
          <ReactSelect
            classNames={{
              option: () => "text-base font-normal",
              singleValue: () => "text-sm font-normal",
              placeholder: () => "text-sm font-normal",
              menu: () => "text-sm"
            }}
            theme={theme => ({
              ...theme,
              borderRadius: 6,
              colors: { ...theme.colors, primary25: "#EEEEEE", primary: "#EEEEEE" }
            })}
            styles={{
              singleValue: base => ({ ...base, color: "black" }),
              option: (base, state) => ({
                ...base,
                color: state.isSelected ? "black" : base.color,
                backgroundColor: state.isSelected ? "#EEEEEE" : base.backgroundColor,
                ":active": { backgroundColor: "#EEEEEE" }
              }),
              control: (base, state) => ({
                ...base,
                border: state.isFocused ? "1px solid black" : "1px solid #ccc",
                boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
                "&:hover": { borderColor: "black" }
              }),
              menu: base => ({ ...base, zIndex: 100 })
            }}
            id={name}
            isMulti={type === "react-select-multi"}
            options={options}
            value={
              type === "react-select-multi"
                ? options?.filter(opt => field.value?.includes(opt.value)) || []
                : options?.find(opt => opt.value === field.value) || null
            }
            onChange={selected =>
              type === "react-select-multi"
                ? field.onChange((selected as any[]).map(s => s.value))
                : field.onChange((selected as any)?.value ?? "")
            }
            isDisabled={isFieldDisabled}
          />
        );
      case "dropdown-select": {
        const currentOption = options?.find(opt => opt.value === field.value);

        return (
          <Select
            disabled={isFieldDisabled}
            value={field.value || ""}
            onValueChange={val => {
              field.onChange(val);
              if (cb) cb(val);
            }}
          >
            {/* Trigger */}
            <SelectTrigger className='flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm'>
              <SelectValue placeholder={placeholder || "Select option"}>
                <span className='flex items-center gap-2'>
                  {currentOption?.label && (
                    <ImageWithFallback
                      fallbackSrc='/images/placeholders/userPlaceholder.jpg'
                      src={currentOption.image}
                      alt={currentOption.label}
                      width={20}
                      height={20}
                      className='rounded-full'
                    />
                  )}
                  {currentOption?.label || placeholder || "Select option"}
                </span>
              </SelectValue>
            </SelectTrigger>

            {/* Options */}
            <SelectContent className='rounded-md border border-gray-200 bg-white shadow-md'>
              {options?.map(option => (
                <SelectItem key={option.value} value={option.value} className='flex items-center gap-2 text-sm text-gray-700'>
                  {option.label && (
                    <ImageWithFallback
                      fallbackSrc='/images/placeholders/userPlaceholder.jpg'
                      src={option.image}
                      alt={option.label}
                      width={20}
                      height={20}
                      className='rounded-full'
                    />
                  )}
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      // ── Image / file dropzones ──────────────────────────────────────────────
      case "image":
        return <DropzoneSingle name={name} disabled={isFieldDisabled} />;

      case "image-c":
        return <DropzoneSingleNew name={name} disabled={isFieldDisabled} />;

      case "image-multiple":
        return (
          <DropzoneMultiple
            setIsImageUploading={setIsImageUploading}
            name={name}
            maxNum={maxNum}
            disabled={isFieldDisabled}
            maxSize={maxSize}
            placeholder={placeholder}
            folderName={folderName}
            uploadMultipleImageCredentials={uploadMultipleImageCredentials}
            setUploadMultipleImageCredentials={setUploadMultipleImageCredentials}
          />
        );

      case "colorWiseImage":
        return (
          <ColorWiseImageFile
            name={name}
            colors={colors}
            maxNum={maxNum}
            disabled={isFieldDisabled}
            maxSize={maxSize}
            placeholder={placeholder}
            folderName={folderName}
            uploadMultipleImageCredentials={uploadMultipleImageCredentials}
            setUploadMultipleImageCredentials={setUploadMultipleImageCredentials}
          />
        );

      case "image-zip-multiple":
        return (
          <DropzoneMultipleFiles
            name={name}
            maxNum={maxNum}
            disabled={isFieldDisabled}
            placeholder={placeholder}
            folderName={folderName}
            uploadMultipleImageCredentials={uploadMultipleImageCredentials}
            setUploadMultipleImageCredentials={setUploadMultipleImageCredentials}
            accept={{
              "image/*": [".jpg", ".png", ".svg"],
              "application/zip": [".zip"]
            }}
          />
        );

      case "file":
        return <DropzoneSingleFile name={name} disabled={isFieldDisabled} />;

      // ── Select ──────────────────────────────────────────────────────────────

      case "select": {
        // if (!options || options.length === 0) {
        //   return <></>; // Return empty fragment instead of null
        // }

        const currentValue = field.value?.toString() || "";
        const isValidOption = options?.some(opt => opt.value === currentValue);
        const selectValue = isValidOption ? currentValue : undefined;

        // if (name === "subCategory") {
        //   console.log("subCategory selectValue", selectValue);
        //   console.log("subCategory currentValue", currentValue);
        // }

        return (
          <Select
            disabled={isFieldDisabled}
            onValueChange={val => {
              if (val) {
                field.onChange(val);
                if (cb) cb(val);
              }
            }}
            value={selectValue}
          >
            <SelectTrigger className={cn("bg-background h-10! w-full", selectTriggerClassName)} id={name}>
              <SelectValue placeholder={placeholder || "Select an Option"} />
            </SelectTrigger>
            <SelectContent position='popper' sideOffset={2} className='z-100 max-h-60 overflow-auto'>
              {options?.length > 0 ? (
                options?.map((option, i) => (
                  <SelectItem key={i} value={option.value} disabled={option?.disabled}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <div className='flex h-20 items-center justify-center text-sm text-gray-500'>No data found!</div>
              )}
            </SelectContent>
          </Select>
        );
      }
      // ── Password ────────────────────────────────────────────────────────────
      case "password":
        return (
          <div className='relative'>
            <Input
              {...field}
              className={cn(
                `pr-10 ${isFieldReadOnly ? "bg-muted cursor-not-allowed" : "bg-background"}`,
                // honour prefix icon padding even for password
                prefixIcon && "pl-9!",
                inputClassName
              )}
              disabled={isFieldDisabled}
              type={showPassword ? "text" : "password"}
              id={name}
              placeholder={placeholder}
              readOnly={isFieldReadOnly}
              maxLength={maxLength}
              onChange={e => {
                let value = e.target.value;
                if (maxLength) value = value.slice(0, maxLength);
                field.onChange(value);
              }}
              autoComplete={autoComplete}
            />

            {/* Prefix icon for password (optional) */}
            {prefixIcon && renderIconButton(prefixIcon, "left", onPrefixClick, prefixIconClassName)}

            {/* Show/hide toggle always sits on the right; suffix icon is not shown for password */}
            <button
              type='button'
              onClick={() => setShowPassword(prev => !prev)}
              className='text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2'
              tabIndex={-1}
              disabled={isFieldDisabled}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        );

      // ── Text / email / number (default) ─────────────────────────────────────
      case "text":
      case "email":
      case "number":
      default:
        return (
          <div className='relative flex items-center'>
            {/* Prefix icon */}
            {prefixIcon && renderIconButton(prefixIcon, "left", onPrefixClick, prefixIconClassName)}

            <Input
              min={minNum}
              {...field}
              className={cn(
                `text-black! ${isFieldReadOnly ? "bg-muted cursor-not-allowed" : "bg-background"}`,
                iconPaddingClass,
                inputClassName
              )}
              disabled={isFieldDisabled}
              type={type === "number" ? "text" : type}
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

                    // Smart conversion: Keep as string if it's an intermediate state (ends with . or has trailing zeros after a dot)
                    // This prevents formatting from being lost while typing
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

            {/* Suffix icon */}
            {suffixIcon && renderIconButton(suffixIcon, "right", onSuffixClick, suffixIconClassName)}
          </div>
        );
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* ── Field-level label (existing behaviour) ──────────────────────── */}
      {label && (
        <Label htmlFor={name} className='capitalize'>
          <span className={cn(labelClassName)}>{label}</span>
          {!required && <span className={cn("text-dark-gray opacity-50", labelClassName)}>(optional)</span>}
          {tooltipContent && (
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className='text-muted-foreground h-4 w-4 cursor-help' />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </Label>
      )}

      {/* ── Top inline labels (from CustomInput) ────────────────────────── */}
      {renderLabelRow(topLeftLabel, topRightLabel, "top")}

      {/* ── The actual field ─────────────────────────────────────────────── */}
      <Controller control={control} name={name} render={({ field }) => renderInputField(field)} />

      {/* ── Bottom inline labels (from CustomInput) ──────────────────────── */}
      {renderLabelRow(bottomLeftLabel, bottomRightLabel, "bottom")}

      {/* ── Validation error ─────────────────────────────────────────────── */}
      {/* <ErrorMessage errors={errors} name={name} render={({ message }) => <ErrorStr message={message} />} /> */}
      {(() => {
        const fieldError = get(errors, name);
        return fieldError?.message ? <ErrorStr message={fieldError.message} /> : null;
      })()}
    </div>
  );
}

export default InputField;

export const ErrorStr = ({ message = "Required", className }: { message?: string; className?: string }) => {
  return (
    <p className={cn("text-destructive flex items-center gap-1 text-sm", className)}>
      <BadgeInfo className='size-4 shrink-0' />
      {message}
    </p>
  );
};
