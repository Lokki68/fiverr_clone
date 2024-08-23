import {
  Tooltip, TooltipContent,
  TooltipProvider as BaseTooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip"

interface TooltipProviderProps {
  text: string,
  children: React.ReactNode
}

export const TooltipProvider = ({text, children}: TooltipProviderProps) => {
  return (
      <BaseTooltipProvider >
        <Tooltip>
          <TooltipTrigger>
            {children}
          </TooltipTrigger>
          <TooltipContent>
            <p>{text}</p>
          </TooltipContent>
        </Tooltip>
      </BaseTooltipProvider >
  );
};

