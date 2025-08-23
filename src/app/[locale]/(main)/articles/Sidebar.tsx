"use client";

import React, { useState } from "react";

// Simple icons as SVG components
const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const Stethoscope = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
    />
  </svg>
);

const Heart = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const Baby = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const Activity = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const Sparkles = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const Menu = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Types
export interface SidebarItem {
  id: string;
  title: string;
  children?: SidebarItem[];
  isActive?: boolean;
  onClick?: () => void;
}

export interface CreativeSidebarProps {
  title: string;
  items: SidebarItem[];
  onItemClick: (item: SidebarItem) => void;
  activeItemId?: string;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

// Creative Sidebar with CSS custom properties
const CreativeSidebar: React.FC<CreativeSidebarProps> = ({
  title,
  items,
  onItemClick,
  activeItemId,
  className = "",
  isOpen = false,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState(new Set<string>());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getIcon = (itemId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "family-medicine": <Stethoscope className="w-5 h-5" />,
      pediatrics: <Baby className="w-5 h-5" />,
      "internal-medicine": <Heart className="w-5 h-5" />,
      cardiology: <Activity className="w-5 h-5" />,
      general: <Users className="w-5 h-5" />,
    };
    return iconMap[itemId] || <FileText className="w-4 h-4" />;
  };

  interface SidebarItemProps {
    item: SidebarItem;
    level?: number;
    parentId?: string | null;
  }

  const SidebarItemComponent: React.FC<SidebarItemProps> = ({
    item,
    level = 0,
    parentId = null,
  }) => {
    const isExpanded = expandedSections.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeItemId === item.id;
    const isParentSection = level === 0;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (hasChildren && isParentSection) {
        toggleSection(item.id);
      } else {
        onItemClick(item);
        if (window.innerWidth < 1024 && onClose) {
          onClose();
        }
      }
    };

    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className={`
            w-full text-left group relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02]
            ${
              isParentSection
                ? `p-4 rounded-2xl mb-3 shadow-sm border
                 ${
                   isExpanded
                     ? "bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] text-white border-[var(--primary-color)] shadow-lg shadow-[var(--primary-color)]/25"
                     : "bg-white hover:bg-gradient-to-r hover:from-[var(--primary-light)] hover:to-[var(--primary-lighter)] text-gray-700 border-gray-200 hover:border-[var(--primary-color)] hover:shadow-md"
                 }`
                : `p-3 rounded-xl mb-2 ml-4 border-l-4 transform transition-all duration-200 hover:translate-x-1
                 ${
                   isActive
                     ? "bg-[var(--primary-light)] border-[var(--primary-color)] text-[var(--primary-dark)] shadow-sm"
                     : "bg-white border-transparent hover:bg-[var(--primary-light)] hover:border-[var(--primary-color)] text-gray-600 hover:text-[var(--primary-dark)]"
                 }`
            }
          `}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              {isParentSection && (
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isExpanded
                      ? "bg-white/20"
                      : "bg-[var(--primary-light)] group-hover:bg-[var(--primary-lighter)]"
                  }`}
                >
                  <div
                    className={
                      isExpanded ? "text-white" : "text-[var(--primary-color)]"
                    }
                  >
                    {getIcon(item.id)}
                  </div>
                </div>
              )}
              {!isParentSection && (
                <div className="w-2 h-2 rounded-full bg-current opacity-50" />
              )}
              <span
                className={`font-medium truncate ${
                  isParentSection ? "text-base" : "text-sm"
                }`}
              >
                {item.title}
              </span>
            </div>

            {hasChildren && isParentSection && (
              <div
                className="flex-shrink-0 transition-transform duration-200"
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <ChevronDown
                  className={`w-4 h-4 ${
                    isExpanded ? "text-white" : "text-gray-400"
                  }`}
                />
              </div>
            )}

            {isActive && !isParentSection && (
              <div className="w-2 h-2 rounded-full bg-[var(--primary-color)]" />
            )}
          </div>

          {/* Animated background for parent sections */}
          {isParentSection && !isExpanded && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{ zIndex: 1 }}
            />
          )}
        </button>

        {/* Children with smooth animation */}
        {hasChildren && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-2">
              {item.children?.map((child) => (
                <SidebarItemComponent
                  key={child.id}
                  item={child}
                  level={level + 1}
                  parentId={item.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar Toggle Button (Hamburger Menu) */}
      <button
        onClick={() => onClose && onClose()}
        className={`
          fixed top-4 left-4 z-[60] lg:hidden p-3 rounded-xl
          bg-white shadow-lg border border-gray-200
          hover:bg-[var(--primary-light)] hover:border-[var(--primary-color)]
          transition-all duration-300 group
          ${isOpen ? "transform rotate-90" : ""}
        `}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <div className="flex items-center space-x-2">
          {isOpen ? (
            <X className="w-5 h-5 text-gray-700 group-hover:text-[var(--primary-color)]" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700 group-hover:text-[var(--primary-color)]" />
          )}
          <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--primary-color)]">
            {isOpen ? "Close Menu" : "Menu"}
          </span>
        </div>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-gradient-to-b from-gray-50 to-white border-r border-gray-200/60 shadow-xl backdrop-blur-sm
          h-full overflow-y-auto relative transform transition-all duration-500 ease-out
           lg:relative top-0 left-0 z-[58] w-80 max-w-[85vw]
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${className}
        `}
        style={
          {
            "--primary-color": "#1D4671",
            "--primary-dark": "#153654",
            "--primary-light": "#E8F2FF",
            "--primary-lighter": "#F5F9FF",
            "--secondary-color": "#64748b",
            "--secondary-light": "#f1f5f9",
          } as React.CSSProperties
        }
      >
        {/* Header with glassmorphism */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 p-6 z-20">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-dark)] shadow-lg shadow-[var(--primary-color)]/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-2">
          {items.map((item) => (
            <SidebarItemComponent key={item.id} item={item} />
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--primary-light)]/30 to-transparent pointer-events-none" />
      </aside>
    </>
  );
};

export default CreativeSidebar;
