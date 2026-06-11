import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface IProps {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
  labelClassName?: string;
  prefixIcon?: React.ReactNode;
  className?: string;
  tooltipContent?: string;
}

export default function FormSwitch({
  name,
  label,
  description,
  disabled,
  labelClassName,
  prefixIcon,
  className,
  tooltipContent = ""
}: IProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-center justify-between rounded-lg border p-4", className)}>
          <div className='space-y-0.5'>
            <FormLabel className={`text-sm ${labelClassName}`}>
              {prefixIcon} {label}{" "}
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
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch disabled={disabled} checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
