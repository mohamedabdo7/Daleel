"use client";

import React from "react";
import { ChevronDown, ChevronRight, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SidebarItem {
  id: string;
  title: string;
  children?: SidebarItem[];
  icon?: React.ComponentType<{ className?: string }>; // Optional custom icon
}

export interface SidebarConfig {
  title: string;
  subtitle?: string;
  defaultIcon?: React.ComponentType<{ className?: string }>;
  loadingText?: string;
  emptyText?: string;
  className?: string;
}

interface GenericSidebarProps {
  items: SidebarItem[];
  selectedItemId?: string;
  onItemClick: (item: SidebarItem) => void;
  onCategoryToggle: (categorySlug: string, willExpand: boolean) => void;
  loadingCategoryId: string | null;
  expandedCategories: Set<string>;
  config: SidebarConfig;
  isOpen?: boolean; // For mobile sidebar
  onClose?: () => void; // For mobile sidebar
}

const GenericSidebar: React.FC<GenericSidebarProps> = ({
  items,
  selectedItemId,
  onItemClick,
  onCategoryToggle,
  loadingCategoryId,
  expandedCategories,
  config,
  isOpen = true,
  onClose,
}) => {
  const {
    title,
    subtitle,
    defaultIcon: DefaultIcon = FileText,
    loadingText = "Loading...",
    emptyText = "No items available",
    className = "",
  } = config;

  const handleCategoryClick = (categoryId: string) => {
    const isExpanded = expandedCategories.has(categoryId);
    onCategoryToggle(categoryId, !isExpanded);
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedCategories.has(item.id);
    const isLoading = loadingCategoryId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isCategory = level === 0;
    const isSelected = selectedItemId === item.id;
    const ItemIcon = item.icon || DefaultIcon;

    if (isCategory) {
      return (
        <div key={item.id} className="mb-2">
          <Button
            variant="ghost"
            onClick={() => handleCategoryClick(item.id)}
            className={cn(
              "w-full justify-between h-auto p-3 text-left font-medium text-gray-700 hover:bg-[#03847D]/10 rounded-lg transition-colors group",
              isExpanded &&
                "bg-[#0A2C75]/10 text-[#0A2C75] border border-[#0A2C75]/20"
            )}
          >
            <div className="flex items-center flex-1 min-w-0">
              <ItemIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="flex-1 text-left break-words pr-2 leading-tight">
                {item.title}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="transition-transform duration-200">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </Button>
          {isExpanded && hasChildren && (
            <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
              {item.children!.map((child) =>
                renderSidebarItem(child, level + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <Button
        key={item.id}
        variant={isSelected ? "default" : "ghost"}
        onClick={() => onItemClick(item)}
        className={cn(
          "w-full justify-start h-auto p-2 text-left text-sm font-normal rounded-md transition-colors group",
          isSelected
            ? "bg-[#0A2C75] text-white hover:bg-[#0A2C75]/90"
            : "text-gray-600 hover:bg-[#03847D]/10 hover:text-[#03847D]"
        )}
        title={item.title} // Tooltip for full text
      >
        <ItemIcon className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="flex-1 text-left break-words leading-tight">
          {item.title}
        </span>
      </Button>
    );
  };

  const sidebarContent = (
    <div
      className={cn(
        "h-full flex flex-col bg-white border-r border-gray-200",
        className
      )}
    >
      <div
        className={cn(
          "p-4 border-b border-gray-200 bg-gradient-to-r from-[#0A2C75]/5 to-[#03847D]/5"
        )}
      >
        <h2 className="text-lg font-semibold text-[#0A2C75] truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#03847D] mt-1 truncate">{subtitle}</p>
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden absolute top-3 right-3 p-2"
          >
            ×
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              {emptyText}
            </div>
          ) : (
            items.map((item) => renderSidebarItem(item))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile overlay
  if (onClose) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        <div
          className={cn(
            "fixed top-0 left-0 z-50 w-80 h-full transform transition-transform duration-300 ease-in-out lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return sidebarContent;
};

export default GenericSidebar;
