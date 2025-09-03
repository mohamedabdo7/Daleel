"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Loader2, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DeepSidebarItemMeta {
  /** "section" | "chapter" | "lesson" | custom */
  type?: string;
  /** force leaf if needed */
  isLeaf?: boolean;
  [k: string]: any;
}

export interface DeepSidebarItem {
  id: string; // unique key (slug)
  title: string;
  children?: DeepSidebarItem[];
  meta?: DeepSidebarItemMeta;
  icon?: React.ComponentType<{ className?: string }>; // Optional custom icon
}

export interface DeepSidebarConfig {
  title: string;
  subtitle?: string;
  defaultIcon?: React.ComponentType<{ className?: string }>;
  loadingText?: string;
  emptyText?: string;
  className?: string;
}

interface DeepSidebarProps {
  items: DeepSidebarItem[];
  onLeafClick: (item: DeepSidebarItem) => void;
  activeLeafId?: string;
  config: DeepSidebarConfig;
  isOpen?: boolean;
  onClose?: () => void;
  /** called when a node toggles (useful for lazy loading) */
  onToggle?: (item: DeepSidebarItem, willExpand: boolean) => void;
  loadingNodeId?: string | null;
  /** Expand these ids on mount / when they change (e.g., section+chapter from URL) */
  initialExpandedIds?: string[];
}

const DeepSidebar: React.FC<DeepSidebarProps> = ({
  items,
  onLeafClick,
  activeLeafId,
  config,
  isOpen = true,
  onClose,
  onToggle,
  loadingNodeId = null,
  initialExpandedIds,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const {
    title,
    subtitle,
    defaultIcon: DefaultIcon = FileText,
    loadingText = "Loading...",
    emptyText = "No items available",
    className = "",
  } = config;

  // Sync initialExpandedIds → expanded (union, no reset)
  useEffect(() => {
    if (!initialExpandedIds || initialExpandedIds.length === 0) return;
    setExpanded((prev) => {
      const ids = new Set(prev);
      for (const id of initialExpandedIds) ids.add(id);
      return ids;
    });
  }, [initialExpandedIds?.join("|")]);

  // Auto-expand ancestors of the active leaf when items change (e.g., after lazy loads)
  useEffect(() => {
    if (!activeLeafId) return;
    const path: string[] = [];
    const dfs = (
      arr: DeepSidebarItem[],
      target: string,
      acc: string[]
    ): boolean => {
      for (const n of arr) {
        const nextAcc = [...acc, n.id];
        if (n.id === target) {
          path.push(...nextAcc);
          return true;
        }
        if (n.children && n.children.length) {
          if (dfs(n.children, target, nextAcc)) return true;
        }
      }
      return false;
    };
    dfs(items, activeLeafId, []);
    if (path.length) {
      setExpanded((prev) => {
        const ids = new Set(prev);
        for (const id of path) ids.add(id);
        return ids;
      });
    }
  }, [items, activeLeafId]);

  const toggle = (item: DeepSidebarItem) => {
    const next = new Set(expanded);
    const willExpand = !next.has(item.id);
    if (willExpand) next.add(item.id);
    else next.delete(item.id);
    setExpanded(next);
    onToggle?.(item, willExpand);
  };

  const handleItemClick = (item: DeepSidebarItem) => {
    const isLeaf = item.meta?.type === "lesson" || item.meta?.isLeaf === true;
    if (isLeaf) {
      onLeafClick(item);
      if (window.innerWidth < 1024 && onClose) onClose();
    } else {
      toggle(item);
    }
  };

  const renderSidebarItem = (item: DeepSidebarItem, level: number = 0) => {
    const isExpanded = expanded.has(item.id);
    const isLoading = loadingNodeId === item.id;
    const hasChildren = Boolean(item.children?.length);
    const isLeaf = item.meta?.type === "lesson" || item.meta?.isLeaf === true;
    const isSelected = activeLeafId === item.id && isLeaf;
    const ItemIcon = item.icon || DefaultIcon;

    // Categories (level 0) - match GenericSidebar exactly
    if (level === 0) {
      return (
        <div key={item.id} className="mb-2">
          <Button
            variant="ghost"
            onClick={() => handleItemClick(item)}
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

    // Deep nested items (level 1+) - enhanced for multiple levels
    const getNestedClasses = () => {
      if (level === 1) {
        return cn(
          "w-full justify-between h-auto p-2 text-left text-sm font-normal transition-colors group",
          !isLeaf && hasChildren
            ? isExpanded
              ? "bg-[#0A2C75]/5 text-[#0A2C75]"
              : "text-gray-600 hover:bg-[#03847D]/10 hover:text-[#03847D]"
            : isSelected
            ? "bg-[#0A2C75] text-white hover:bg-[#0A2C75]/90"
            : "text-gray-600 hover:bg-[#03847D]/10 hover:text-[#03847D]"
        );
      } else {
        // Level 2+ - progressively smaller and more indented
        return cn(
          "w-full justify-start h-auto p-2 text-left text-xs font-normal rounded-md transition-colors group",
          `ml-${(level - 1) * 2}`,
          isSelected
            ? "bg-[#0A2C75] text-white hover:bg-[#0A2C75]/90"
            : "text-gray-600 hover:bg-[#03847D]/10 hover:text-[#03847D]"
        );
      }
    };

    return (
      <div key={item.id} className="relative">
        <Button
          variant={isSelected ? "default" : "ghost"}
          onClick={() => handleItemClick(item)}
          className={getNestedClasses()}
          title={item.title}
        >
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <ItemIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="flex-1 text-left break-words leading-tight">
                {item.title}
              </span>
            </div>

            {!isLeaf && hasChildren && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                <div
                  className={cn(
                    "transition-transform duration-200",
                    isExpanded ? "rotate-90" : "rotate-0"
                  )}
                >
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </Button>

        {hasChildren && !isLeaf && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div
              className={cn(
                "mt-1 space-y-1",
                level === 1 && "border-l-2 border-gray-200 pl-4"
              )}
            >
              {item.children?.map((child) =>
                renderSidebarItem(child, level + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div
      className={cn(
        "h-full flex flex-col bg-white border-r border-gray-200",
        className
      )}
    >
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#0A2C75]/5 to-[#03847D]/5">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-[#0A2C75] truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-[#03847D] mt-1 truncate">{subtitle}</p>
            )}
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden p-2 flex-shrink-0"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
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

  // Mobile overlay - only when onClose is provided AND on mobile
  return (
    <>
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          onClose
            ? cn(
                "fixed top-0 left-0 z-50 w-80 h-full transform transition-transform duration-300 ease-in-out lg:relative lg:w-full lg:max-w-none lg:transform-none lg:z-auto",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              )
            : "w-full h-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default DeepSidebar;
