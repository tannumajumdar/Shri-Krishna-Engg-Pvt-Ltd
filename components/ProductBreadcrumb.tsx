import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function ProductBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-white/60 mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.label} className="flex items-center space-x-2">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-accent-500 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? "text-white font-medium" : "")}>
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-white/40" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
