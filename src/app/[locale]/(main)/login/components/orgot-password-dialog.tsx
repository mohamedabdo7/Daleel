// components/auth/forgot-password-dialog.tsx
"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useToast } from "@/app/components/common/toast";
import { useForgotPassword } from "./use-auth";
import { CustomInput } from "@/app/components/common/form/CustomInput";
import { CustomButton } from "@/app/components/common/form/custom-button";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) {
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState<{ email?: string }>({});

  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});
    forgotPassword(
      { email },
      {
        onSuccess: () => {
          toast.success(
            "Password reset email sent",
            "Please check your email for reset instructions"
          );
          setEmail("");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(
            "Failed to send reset email",
            error.payload?.message || "Please try again later"
          );
        },
      }
    );
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email && value) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-semibold text-gray-900">
                Forgot Password
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Description className="text-gray-600 mb-6 text-sm">
              Enter your email address and we'll send you instructions to reset
              your password.
            </Dialog.Description>

            <form onSubmit={handleSubmit} className="space-y-4">
              <CustomInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                error={errors.email}
                required
              />

              <div className="flex gap-3 pt-4">
                <Dialog.Close asChild>
                  <CustomButton
                    type="button"
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </CustomButton>
                </Dialog.Close>
                <CustomButton
                  type="submit"
                  className="flex-1"
                  loading={isPending}
                  disabled={!email || isPending}
                >
                  Send Reset Link
                </CustomButton>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
