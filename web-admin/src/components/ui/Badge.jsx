import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100",
        secondary:
          "bg-blue-500/20 text-blue-400 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100",
        success:
          "bg-green-500/20 text-green-400 hover:bg-green-100 dark:bg-green-900 dark:text-green-100",
        destructive: 
          "bg-red-500/20 text-red-400 hover:bg-red-200 dark:bg-red-900 dark:text-red-100",
        warning:
          "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
        outline:
          "border border-gray-200 text-gray-900 dark:border-gray-800 dark:text-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
