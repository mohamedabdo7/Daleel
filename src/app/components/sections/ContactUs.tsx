"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SectionHeader from "../common/SectionHeader";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Textarea } from "../common/Textarea";

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
    <section className={cn("pb-16 px-4 lg:px-8", className)}>
      <div className="max-w-6xl mx-auto ">
        {/* Section Header */}
        <SectionHeader
          primaryText="Contact"
          secondaryText="DaleelFM"
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Phone Image - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center order-2 lg:order-1"
          >
            <div className="flex justify-center relative max-w-sm w-full">
              <Image
                src="/images/phone.png"
                alt="DaleelFM Mobile App"
                width={200}
                height={400}
                className="w-60 h-auto object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2 max-w-md lg:max-w-lg mx-auto lg:mx-0"
          >
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Name Input */}
              <Input
                name="name"
                type="text"
                // placeholder="Enter your name"
                label="Name"
                value={formData.name}
                onChange={handleInputChange}
                variant="default"
                size="lg"
                fullWidth
                required
              />

              {/* Email Input */}
              <Input
                name="email"
                type="email"
                // placeholder="Enter your email address"
                label="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                variant="default"
                size="lg"
                fullWidth
                required
              />

              {/* Subject Input */}
              <Input
                name="subject"
                type="text"
                // placeholder="Enter the subject"
                label="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                variant="default"
                size="lg"
                fullWidth
                required
              />

              {/* Message Textarea */}
              <Textarea
                name="message"
                // placeholder="Enter your message"
                label="Message"
                value={formData.message}
                onChange={handleInputChange}
                variant="default"
                size="sm"
                fullWidth
                required
                rows={6}
                showCharCount
                maxLength={200}
              />

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  loading={loading}
                  fullWidth
                  containerClassName="w-1/4 ml-auto"
                  className="h-12 text-base font-semibold rounded-xl w-full bg-[#136FB7]"
                >
                  {loading ? "Sending..." : "Send"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
