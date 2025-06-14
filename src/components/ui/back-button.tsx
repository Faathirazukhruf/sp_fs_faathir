"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackButton({ 
  href, 
  className = "",
  children = "Kembali ke Dashboard" 
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-1.5" />
      {children}
    </button>
  );
}
