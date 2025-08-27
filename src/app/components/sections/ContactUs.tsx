"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SectionHeader from "../common/SectionHeader";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Textarea } from "../common/Textarea";
import { Loader2 } from "lucide-react";

interface ContactSectionProps {
  className?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ className }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form submitted:", formData);
    setLoading(false);

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section
      className={cn("py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8", className)}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          primaryText="Contact"
          secondaryText="DaleelFM"
          className="mb-8 sm:mb-10 md:mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Phone Image - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center order-2 lg:order-1"
          >
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md flex justify-center">
              <Image
                src="/images/phone.png"
                alt="DaleelFM Mobile App"
                width={300}
                height={600}
                className="w-48 sm:w-56 md:w-64 lg:w-60 xl:w-72 h-auto object-contain drop-shadow-2xl"
                priority
              />

              {/* Subtle background decoration */}
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full opacity-50 -z-10" />
              <div className="absolute -bottom-6 -left-6 w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full opacity-40 -z-10" />
            </div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-md xl:max-w-lg mx-auto lg:mx-0"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              {/* Name Input */}
              <div className="space-y-2">
                <Input
                  name="name"
                  type="text"
                  label="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="default"
                  size="lg"
                  fullWidth
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Input
                  name="email"
                  type="email"
                  label="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="default"
                  size="lg"
                  fullWidth
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              {/* Subject Input */}
              <div className="space-y-2">
                <Input
                  name="subject"
                  type="text"
                  label="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  variant="default"
                  size="lg"
                  fullWidth
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              {/* Message Textarea */}
              <div className="space-y-2">
                <Textarea
                  name="message"
                  label="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  variant="default"
                  size="sm"
                  fullWidth
                  required
                  rows={4}
                  className="text-sm sm:text-base min-h-[100px] sm:min-h-[120px] resize-none"
                  showCharCount
                  maxLength={500}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 sm:pt-4 flex justify-end">
                <div className="w-full sm:w-auto sm:min-w-[120px] md:min-w-[140px]">
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    loading={loading}
                    className="w-full sm:w-auto sm:px-8 md:px-10 h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-xl bg-[#136FB7] hover:bg-[#0f5a9a] transition-colors duration-200 shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        Sending...
                      </span>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
