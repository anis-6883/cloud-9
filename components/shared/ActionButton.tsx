import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ActionButtonProps = {
  icon: React.ReactNode;
  tooltip: string;
  className?: string;
} & (
  | {
      href: string;
      onClick?: never;
    }
  | {
      href?: never;
      onClick: () => void;
    }
);

export default function ActionButton({ icon, tooltip, href, onClick, className }: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <Button size='icon' asChild className={cn(className, "cursor-pointer")}>
            <Link href={href}>{icon}</Link>
          </Button>
        ) : (
          <Button size='icon' onClick={onClick} className={cn(className, "cursor-pointer")}>
            {icon}
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent className='text-black'>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
