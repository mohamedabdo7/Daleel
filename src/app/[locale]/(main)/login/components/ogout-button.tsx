// components/auth/logout-button.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useToast } from "@/app/components/common/toast";
import { CustomButton } from "@/app/components/common/form/custom-button";

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export function LogoutButton({
  variant = "ghost",
  size = "default",
  showIcon = true,
  showText = true,
  className,
}: LogoutButtonProps) {
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const getLocale = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const segments = pathname.split("/");
      return segments[1] || "en";
    }
    return "en";
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Clear auth state and cookies
      logout();

      // Show success toast
      toast.success("Logged out successfully", "See you soon!");

      // Redirect to home page with current locale
      const locale = getLocale();
      router.push(`/${locale}`);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed", "Please try again");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <CustomButton
      variant={variant}
      size={size}
      onClick={handleLogout}
      loading={isLoggingOut}
      disabled={isLoggingOut}
      className={className}
      title={`Logout ${user?.name || "User"}`}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && size !== "icon" && (
        <span className={showIcon ? "ml-2" : ""}>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </span>
      )}
    </CustomButton>
  );
}

// User Profile Button with Dropdown (Alternative/Advanced version)
export function UserProfileButton() {
  const { user, isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative">
      <CustomButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {user.name}
        </span>
      </CustomButton>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User className="h-4 w-4 mr-3" />
                Profile
              </button>

              <div className="border-t border-gray-100 my-1" />

              <div className="px-4 py-1">
                <LogoutButton
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:bg-red-50"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 1. Basic logout button
export const SimpleLogoutButton = () => <LogoutButton />;

// 2. Icon only button
export const IconLogoutButton = () => (
  <LogoutButton size="icon" variant="outline" showText={false} />
);

// 3. Navbar logout button
export const NavbarLogoutButton = () => (
  <LogoutButton
    variant="outline"
    size="sm"
    className="text-red-600 border-red-200 hover:bg-red-50"
  />
);

// 4. Destructive logout button
export const DestructiveLogoutButton = () => (
  <LogoutButton variant="destructive" showIcon={true} showText={true} />
);
