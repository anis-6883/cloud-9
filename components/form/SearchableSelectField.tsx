import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import ImageWithFallback from "../shared/ImageWithFallback";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
export function SearchableSelectField({ field, options, placeholder, isFieldDisabled, cb }: any) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options?.filter((opt: any) => opt.label.toLowerCase().includes(search.toLowerCase()));

  const selectedOption = options?.find((opt: any) => opt.value === field.value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <PopoverTrigger asChild>
        <button
          type='button'
          disabled={isFieldDisabled}
          className={cn(
            "flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
            "bg-background",
            !field.value && "text-muted-foreground"
          )}
        >
          <span className='flex items-center gap-2 truncate'>
            {selectedOption?.image && (
              <ImageWithFallback
                src={selectedOption.image}
                fallbackSrc='/images/placeholders/userPlaceholder.jpg'
                alt={selectedOption.label}
                width={20}
                height={20}
                className='rounded-full'
              />
            )}
            {selectedOption?.label || placeholder || "Select option"}
          </span>

          <ChevronDown className='h-4 w-4 opacity-60' />
        </button>
      </PopoverTrigger>

      {/* Dropdown */}
      <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' align='start'>
        {/* Search */}
        <div className='border-b px-3 py-2'>
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search...' className='h-8' />
        </div>

        {/* Options */}
        <div className='max-h-56 overflow-y-auto'>
          {filteredOptions?.length === 0 ? (
            <div className='text-muted-foreground py-4 text-center text-sm'>No options found</div>
          ) : (
            filteredOptions.map((option: any) => {
              const isSelected = field.value === option.value;

              return (
                <div
                  key={option.value}
                  onClick={() => {
                    field.onChange(option.value);
                    if (cb) cb(option.value); // ✅ pass value only
                    setOpen(false);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between px-3 py-2 text-sm",
                    "hover:bg-muted",
                    isSelected && "bg-muted font-medium"
                  )}
                >
                  <div className='flex items-center gap-2'>
                    {option.image && (
                      <ImageWithFallback
                        src={option.image}
                        fallbackSrc='/images/placeholders/userPlaceholder.jpg'
                        alt={option.label}
                        width={20}
                        height={20}
                        className='rounded-full'
                      />
                    )}
                    {option.label}
                  </div>

                  {isSelected && <Check className='h-4 w-4' />}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
