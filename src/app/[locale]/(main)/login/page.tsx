// app/login/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useLogin } from "./components/use-auth";
import { useToast } from "@/app/components/common/toast";
import { ApiError } from "@/lib/api/client";
import { CustomInput } from "@/app/components/common/form/CustomInput";
import { CustomCheckbox } from "@/app/components/common/form/custom-checkbox";
import { CustomButton } from "@/app/components/common/form/custom-button";
import { ForgotPasswordDialog } from "./components/orgot-password-dialog";

interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const { mutate: login } = useLogin();
  const { toast } = useToast();

  const [formData, setFormData] = React.useState<FormData>({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);

  // Get current locale from pathname
  const getLocale = () => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const segments = pathname.split("/");
      return segments[1] || "en";
    }
    return "en";
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const locale = getLocale();
      router.push(`/${locale}`);
    }
  }, [isAuthenticated, isLoading, router]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === "remember" ? e.target.checked : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    login(
      {
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      },
      {
        onSuccess: (response) => {
          const locale = getLocale();
          toast.success(
            "Login successful",
            `Welcome back, ${response.data.name}!`
          );
          router.push(`/${locale}`);
        },
        onError: (error: ApiError) => {
          const errorMessage =
            error.payload?.message || "Login failed. Please try again.";
          setErrors({ general: errorMessage });
          toast.error("Login failed", errorMessage);
        },
      }
    );
  };

  if (isAuthenticated && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-12"
      >
        <div className="max-w-lg text-center">
          {/* Image Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative mb-8"
          >
            <Image
              src="/images/login-img.svg"
              alt="Healthcare professionals"
              width={500}
              height={400}
              className="w-full max-w-lg h-auto object-contain mx-auto"
              priority
            />
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-3xl font-bold text-blue-900 mb-4"
          >
            Welcome to Healthcare
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="text-blue-700 text-lg leading-relaxed"
          >
            Join our community of healthcare professionals and unlock premium
            features to enhance your practice.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center p-8 lg:p-12"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-left mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sign in now
            </h1>
            <p className="text-gray-600">to unlock all premium features</p>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                Don't have an account?{" "}
              </span>
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Register Now
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <CustomInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange("email")}
                error={errors.email}
                required
              />

              <CustomInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange("password")}
                error={errors.password}
                required
              />

              <div className="flex items-center justify-between">
                <CustomCheckbox
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, remember: !!checked }))
                  }
                  label="Remember me"
                />

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forget Password ?
                </button>
              </div>

              <CustomButton
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
              >
                Sign in
              </CustomButton>
            </form>
          </motion.div>

          {/* Terms and Privacy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </div>
  );
}

// // app/login/page.tsx
// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { useAuthStore } from "@/store/auth-store";
// import { useLogin } from "./components/use-auth";
// import { useToast } from "@/app/components/common/toast";
// import { ApiError } from "@/lib/api/client";
// import { CustomInput } from "@/app/components/common/form/CustomInput";
// import { CustomCheckbox } from "@/app/components/common/form/custom-checkbox";
// import { CustomButton } from "@/app/components/common/form/custom-button";
// import { ForgotPasswordDialog } from "./components/orgot-password-dialog";

// interface FormData {
//   email: string;
//   password: string;
//   remember: boolean;
// }

// interface FormErrors {
//   email?: string;
//   password?: string;
//   general?: string;
// }

// export default function LoginPage() {
//   const router = useRouter();
//   const { isAuthenticated, isLoading } = useAuthStore();
//   const { mutate: login } = useLogin();
//   const { toast } = useToast();

//   const [formData, setFormData] = React.useState<FormData>({
//     email: "",
//     password: "",
//     remember: false,
//   });

//   const [errors, setErrors] = React.useState<FormErrors>({});
//   const [showForgotPassword, setShowForgotPassword] = React.useState(false);

//   // Get current locale from pathname
//   const getLocale = () => {
//     if (typeof window !== "undefined") {
//       const pathname = window.location.pathname;
//       const segments = pathname.split("/");
//       return segments[1] || "en";
//     }
//     return "en";
//   };

//   // Redirect if already authenticated
//   React.useEffect(() => {
//     if (isAuthenticated && !isLoading) {
//       const locale = getLocale();
//       router.push(`/${locale}`); // redirect to home with current locale
//     }
//   }, [isAuthenticated, isLoading, router]);

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     return newErrors;
//   };

//   const handleInputChange =
//     (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = field === "remember" ? e.target.checked : e.target.value;
//       setFormData((prev) => ({ ...prev, [field]: value }));

//       // Clear error when user starts typing
//       if (errors[field as keyof FormErrors]) {
//         setErrors((prev) => ({ ...prev, [field]: undefined }));
//       }
//     };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setErrors({});

//     login(
//       {
//         email: formData.email,
//         password: formData.password,
//         remember: formData.remember,
//       },
//       {
//         onSuccess: (response) => {
//           const locale = getLocale();
//           toast.success(
//             "Login successful",
//             `Welcome back, ${response.data.name}!`
//           );
//           router.push(`/${locale}`); // redirect to home with current locale
//         },
//         onError: (error: ApiError) => {
//           const errorMessage =
//             error.payload?.message || "Login failed. Please try again.";
//           setErrors({ general: errorMessage });
//           toast.error("Login failed", errorMessage);
//         },
//       }
//     );
//   };

//   if (isAuthenticated && !isLoading) {
//     return null; // Prevent flash of login form
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//               className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center"
//             >
//               {/* Doctor Illustration */}
//               <div className="flex space-x-1">
//                 <div className="w-6 h-8 bg-blue-400 rounded-full relative">
//                   <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1"></div>
//                 </div>
//                 <div className="w-6 h-8 bg-blue-500 rounded-full relative">
//                   <div className="w-4 h-4 bg-blue-700 rounded-full absolute top-0 left-1"></div>
//                   <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2"></div>
//                 </div>
//                 <div className="w-6 h-8 bg-blue-300 rounded-full relative">
//                   <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-0 left-1"></div>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="text-2xl font-bold text-white mb-1"
//             >
//               Sign in now
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="text-blue-100 text-sm"
//             >
//               to unlock all premium features
//             </motion.p>
//           </div>

//           {/* Form Section */}
//           <div className="p-8">
//             {errors.general && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
//               >
//                 {errors.general}
//               </motion.div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <CustomInput
//                 label="Email Address"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleInputChange("email")}
//                 error={errors.email}
//                 required
//               />

//               <CustomInput
//                 label="Password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleInputChange("password")}
//                 error={errors.password}
//                 required
//               />

//               <div className="flex items-center justify-between">
//                 <CustomCheckbox
//                   checked={formData.remember}
//                   onCheckedChange={(checked) =>
//                     setFormData((prev) => ({ ...prev, remember: !!checked }))
//                   }
//                   label="Remember me"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowForgotPassword(true)}
//                   className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
//                 >
//                   Forgot Password?
//                 </button>
//               </div>

//               <CustomButton
//                 type="submit"
//                 className="w-full"
//                 size="lg"
//                 loading={isLoading}
//                 disabled={isLoading}
//               >
//                 Sign In
//               </CustomButton>
//             </form>

//             {/* Register Link */}
//             <div className="mt-6 text-center">
//               <p className="text-gray-600 text-sm">
//                 Don't have an account?{" "}
//                 <Link
//                   href="/register"
//                   className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
//                 >
//                   Register Now
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Alternative Login Options */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="mt-6 text-center"
//         >
//           <p className="text-xs text-gray-500">
//             By signing in, you agree to our{" "}
//             <Link href="/terms" className="text-blue-600 hover:underline">
//               Terms of Service
//             </Link>{" "}
//             and{" "}
//             <Link href="/privacy" className="text-blue-600 hover:underline">
//               Privacy Policy
//             </Link>
//           </p>
//         </motion.div>
//       </motion.div>

//       {/* Forgot Password Dialog */}
//       <ForgotPasswordDialog
//         open={showForgotPassword}
//         onOpenChange={setShowForgotPassword}
//       />
//     </div>
//   );
// }

// // app/login/page.tsx
// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { useAuthStore } from "@/store/auth-store";
// import { useLogin } from "./components/use-auth";
// import { useToast } from "@/app/components/common/toast";
// import { CustomInput } from "@/app/components/common/form/CustomInput";
// import { CustomCheckbox } from "@/app/components/common/form/custom-checkbox";
// import { CustomButton } from "@/app/components/common/form/custom-button";
// import { ForgotPasswordDialog } from "./components/orgot-password-dialog";
// import { ROUTES } from "@/app/constants/routes";
// import { ApiError } from "@/lib/api/client";

// interface FormData {
//   email: string;
//   password: string;
//   remember: boolean;
// }

// interface FormErrors {
//   email?: string;
//   password?: string;
//   general?: string;
// }

// export default function LoginPage() {
//   const router = useRouter();
//   const { isAuthenticated, isLoading } = useAuthStore();
//   const { mutate: login } = useLogin();
//   const { toast } = useToast();

//   const [formData, setFormData] = React.useState<FormData>({
//     email: "",
//     password: "",
//     remember: false,
//   });

//   const [errors, setErrors] = React.useState<FormErrors>({});
//   const [showForgotPassword, setShowForgotPassword] = React.useState(false);

//   // Redirect if already authenticated
//   React.useEffect(() => {
//     if (isAuthenticated && !isLoading) {
//       router.push(ROUTES.HOME);
//     }
//   }, [isAuthenticated, isLoading, router]);

//   const validateForm = (): FormErrors => {
//     const newErrors: FormErrors = {};

//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     return newErrors;
//   };

//   const handleInputChange =
//     (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
//       const value = field === "remember" ? e.target.checked : e.target.value;
//       setFormData((prev) => ({ ...prev, [field]: value }));

//       // Clear error when user starts typing
//       if (errors[field as keyof FormErrors]) {
//         setErrors((prev) => ({ ...prev, [field]: undefined }));
//       }
//     };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setErrors({});

//     login(
//       {
//         email: formData.email,
//         password: formData.password,
//         remember: formData.remember,
//       },
//       {
//         onSuccess: (response) => {
//           toast.success(
//             "Login successful",
//             `Welcome back, ${response.data.name}!`
//           );
//           router.push(ROUTES.HOME);
//         },
//         onError: (error: ApiError) => {
//           const errorMessage =
//             error.payload?.message || "Login failed. Please try again.";
//           setErrors({ general: errorMessage });
//           toast.error("Login failed", errorMessage);
//         },
//       }
//     );
//   };

//   if (isAuthenticated && !isLoading) {
//     return null; // Prevent flash of login form
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//               className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center"
//             >
//               {/* Doctor Illustration */}
//               <div className="flex space-x-1">
//                 <div className="w-6 h-8 bg-blue-400 rounded-full relative">
//                   <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1"></div>
//                 </div>
//                 <div className="w-6 h-8 bg-blue-500 rounded-full relative">
//                   <div className="w-4 h-4 bg-blue-700 rounded-full absolute top-0 left-1"></div>
//                   <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2"></div>
//                 </div>
//                 <div className="w-6 h-8 bg-blue-300 rounded-full relative">
//                   <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-0 left-1"></div>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="text-2xl font-bold text-white mb-1"
//             >
//               Sign in now
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="text-blue-100 text-sm"
//             >
//               to unlock all premium features
//             </motion.p>
//           </div>

//           {/* Form Section */}
//           <div className="p-8">
//             {errors.general && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
//               >
//                 {errors.general}
//               </motion.div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <CustomInput
//                 label="Email Address"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleInputChange("email")}
//                 error={errors.email}
//                 required
//               />

//               <CustomInput
//                 label="Password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleInputChange("password")}
//                 error={errors.password}
//                 required
//               />

//               <div className="flex items-center justify-between">
//                 <CustomCheckbox
//                   checked={formData.remember}
//                   onCheckedChange={(checked) =>
//                     setFormData((prev) => ({ ...prev, remember: !!checked }))
//                   }
//                   label="Remember me"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowForgotPassword(true)}
//                   className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
//                 >
//                   Forgot Password?
//                 </button>
//               </div>

//               <CustomButton
//                 type="submit"
//                 className="w-full"
//                 size="lg"
//                 loading={isLoading}
//                 disabled={isLoading}
//               >
//                 Sign In
//               </CustomButton>
//             </form>

//             {/* Register Link */}
//             <div className="mt-6 text-center">
//               <p className="text-gray-600 text-sm">
//                 Don't have an account?{" "}
//                 <Link
//                   href="/register"
//                   className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
//                 >
//                   Register Now
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Alternative Login Options */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="mt-6 text-center"
//         >
//           <p className="text-xs text-gray-500">
//             By signing in, you agree to our{" "}
//             <Link href="/terms" className="text-blue-600 hover:underline">
//               Terms of Service
//             </Link>{" "}
//             and{" "}
//             <Link href="/privacy" className="text-blue-600 hover:underline">
//               Privacy Policy
//             </Link>
//           </p>
//         </motion.div>
//       </motion.div>

//       {/* Forgot Password Dialog */}
//       <ForgotPasswordDialog
//         open={showForgotPassword}
//         onOpenChange={setShowForgotPassword}
//       />
//     </div>
//   );
// }
