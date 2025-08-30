// app/events/[slug]/event-client.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { useParams } from "next/navigation";
import { getEventBySlug, Event } from "@/lib/api/events.service";
import {
  Calendar,
  ExternalLink,
  Image as ImageIcon,
  Share2,
  Copy,
  Twitter,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function EventDetailPage({ slug }: { slug?: string }) {
  const [copied, setCopied] = useState(false);

  // Fallback: read slug from the dynamic route if prop is missing
  const params = useParams();
  const rawSlug = (slug ?? (params?.slug as string) ?? "").toString();
  const decodedSlug = decodeURIComponent(rawSlug);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: qk.events?.itemBySlug(decodedSlug) || [
      "events",
      "detail",
      decodedSlug,
    ],
    queryFn: () => getEventBySlug(decodedSlug),
    enabled: !!decodedSlug,
  });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share && data) {
      try {
        await navigator.share({
          title: data.title,
          text: data.desc,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Failed to share");
      }
    } else {
      handleCopyLink();
    }
  };

  if (!decodedSlug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid URL</h1>
          <p className="text-gray-600">Missing event identifier.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-blue-50/30">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-6 w-32 bg-gray-200 rounded-full mb-4" />
              <div className="h-10 w-3/4 bg-gray-200 rounded-lg mb-2" />
              <div className="h-6 w-1/2 bg-gray-200 rounded" />
            </div>

            {/* Hero image skeleton */}
            <div className="aspect-[21/9] w-full bg-gray-200 rounded-3xl mb-12" />

            {/* Content skeleton */}
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-6" />
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <Calendar className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Event not found
          </h1>
          <p className="text-gray-600 mb-6">
            {isError
              ? (error as Error)?.message
              : "This event may have been removed or doesn't exist."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Process description to handle line breaks and formatting
  const processedDesc =
    data.desc?.split("\n").filter((line) => line.trim()) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50/30">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Breadcrumb & Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              <span>Medical Events</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Event Details</span>
            </div>

            <motion.h1
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {data.title}
            </motion.h1>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Event #{data.id}
              </span>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </motion.div>

          {/* Hero Image */}
          {data.image && (
            <motion.div
              className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="aspect-[21/9] relative">
                <img
                  src={data.image}
                  alt={data.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating action buttons on image */}
                <div className="absolute bottom-6 right-6 flex gap-3">
                  {data.buttons &&
                    data.buttons.slice(0, 2).map((button) => (
                      <motion.a
                        key={button.id}
                        href={button.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/95 backdrop-blur-sm text-gray-900 font-medium rounded-xl hover:bg-white transition-colors shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{button.title}</span>
                        <ExternalLink className="h-4 w-4" />
                      </motion.a>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  About This Event
                </h2>

                <div className="prose prose-lg prose-gray max-w-none">
                  {processedDesc.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      className="text-gray-700 leading-relaxed mb-6 text-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                {/* Additional Images Gallery */}
                {data.images && data.images.length > 1 && (
                  <motion.div
                    className="mt-12 pt-8 border-t border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                      Event Gallery
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.images.slice(1).map((img, index) => (
                        <motion.div
                          key={img.id}
                          className="relative aspect-video overflow-hidden rounded-2xl group cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <img
                            src={img.image}
                            alt={`${data.title} - Image ${index + 2}`}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Action Buttons */}
              {data.buttons && data.buttons.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Take Action
                  </h3>
                  <div className="space-y-4">
                    {data.buttons.map((button, index) => (
                      <motion.a
                        key={button.id}
                        href={button.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <span className="mr-2">{button.title}</span>
                        <ExternalLink className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Stats */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Event Details
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <span className="text-gray-600 font-medium">Event ID</span>
                    <span className="font-bold text-gray-900">#{data.id}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <span className="text-gray-600 font-medium">Category</span>
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      Medical Event
                    </span>
                  </div>

                  {data.images && data.images.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                      <span className="text-gray-600 font-medium">Gallery</span>
                      <span className="flex items-center gap-2 text-gray-900 font-bold">
                        <ImageIcon className="h-4 w-4 text-blue-600" />
                        {data.images.length}{" "}
                        {data.images.length === 1 ? "image" : "images"}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Share Section */}
              <motion.div
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Share Event
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => {
                      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Check out this medical event: ${data.title}`
                      )}&url=${encodeURIComponent(window.location.href)}`;
                      window.open(url, "_blank");
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 font-medium rounded-xl hover:bg-blue-200 transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                    Tweet
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
