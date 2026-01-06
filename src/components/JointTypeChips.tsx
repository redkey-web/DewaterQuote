"use client"

import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface JointType {
  name: string
  url: string
  description: string
}

interface JointTypeChipsProps {
  jointTypes: JointType[]
}

export default function JointTypeChips({ jointTypes }: JointTypeChipsProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap gap-3">
        {jointTypes.map((type) => (
          <Tooltip key={type.name}>
            <TooltipTrigger asChild>
              <Link
                href={type.url}
                className="group relative px-5 py-2.5 bg-card border border-border text-sm font-medium transition-all duration-200 hover:border-[#39C5DA] hover:bg-[#39C5DA]/10 hover:text-[#2BA8BC] dark:hover:text-[#39C5DA] hover:shadow-md"
                style={{
                  clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                }}
              >
                {type.name}
                {/* Corner accent */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-border group-hover:border-[#39C5DA] transition-colors" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-border group-hover:border-[#39C5DA] transition-colors" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs bg-[#1a5a63] text-white border-[#39C5DA]">
              <p>{type.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
