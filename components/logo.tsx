"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className, size = "lg", showText = false }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <Image
          src="/images/joldhara-logo.png"
          alt="জলধারা Logo"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            // Fallback to text if image fails to load
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML =
                '<div class="w-full h-full bg-blue-100 rounded-full flex items-center justify-center"><span class="text-blue-600 font-bold text-lg">জ</span></div>';
            }
          }}
        />
      </div>
      {showText && (
        <span className={cn("font-bold text-blue-600", textSizeClasses[size])}>
          জলধারা
        </span>
      )}
    </div>
  );
}
