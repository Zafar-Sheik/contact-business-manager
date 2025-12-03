"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  icon: React.ElementType;
  title: string;
  to: string;
  className?: string;
  index?: number; 
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  icon: Icon,
  title,
  to,
  className,
}) => {
  
  return (
    <Link to={to} className={cn("block", className)}>
      <Card className={cn(
        "flex flex-col items-center justify-center p-3 h-28 w-full text-center transition-all duration-300",
        "shadow-lg border border-border hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] hover:border-primary", // Added shadow-lg and enhanced hover shadow
        "bg-blue-100 dark:bg-secondary"
      )}>
        <CardContent className="flex flex-col items-center justify-center p-0">
          <Icon className="h-6 w-6 mb-1 text-primary" /> 
          <p className="text-sm text-foreground">{title}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MenuItemCard;