"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MenuItemCardProps {
  icon: React.ElementType;
  title: string;
  to: string;
  className?: string;
  count?: number;
  isNew?: boolean;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  icon: Icon,
  title,
  to,
  className,
  count,
  isNew = false,
  variant = "default",
}) => {
  const variantColors = {
    default:
      "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
    primary:
      "bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200",
    success:
      "bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200",
    warning:
      "bg-gradient-to-br from-orange-50 to-amber-100 hover:from-orange-100 hover:to-amber-200",
    danger:
      "bg-gradient-to-br from-red-50 to-pink-100 hover:from-red-100 hover:to-pink-200",
  };

  const iconColors = {
    default: "text-blue-600",
    primary: "text-indigo-600",
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-red-600",
  };

  const borderColors = {
    default: "border-blue-200 hover:border-blue-400",
    primary: "border-indigo-200 hover:border-indigo-400",
    success: "border-emerald-200 hover:border-emerald-400",
    warning: "border-amber-200 hover:border-amber-400",
    danger: "border-red-200 hover:border-red-400",
  };

  return (
    <Link to={to} className={cn("block relative", className)}>
      {isNew && (
        <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 text-xs px-2 py-1 shadow-lg animate-pulse">
          NEW
        </Badge>
      )}

      <Card
        className={cn(
          "flex flex-col items-center justify-center p-4 h-32 w-full text-center transition-all duration-300",
          "shadow-lg hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98]",
          variantColors[variant],
          borderColors[variant],
          "border-2 relative overflow-hidden group"
        )}>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-current"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-current"></div>
        </div>

        <CardContent className="flex flex-col items-center justify-center p-0 relative z-10">
          <div
            className={cn(
              "p-3 rounded-xl mb-2 bg-white shadow-sm group-hover:shadow-md transition-shadow",
              "group-hover:scale-110 transition-transform"
            )}>
            <Icon className={cn("h-6 w-6", iconColors[variant])} />
          </div>

          <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
            {title}
          </p>

          {count !== undefined && (
            <Badge
              variant="secondary"
              className="mt-2 h-5 px-2 text-xs font-medium bg-white/80 backdrop-blur-sm">
              {count}
            </Badge>
          )}
        </CardContent>

        {/* Animated Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Card>
    </Link>
  );
};

export default MenuItemCard;
