"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { getAlertBySlug, type Alert } from "@/lib/api/articles-alerts.service";
import { qk } from "@/lib/queryKeys";
// import {
//   downloadFile,
//   generateSafeFileName,
//   getFileExtension,
// } from "@/lib/utils/download";
import { Button } from "@/app/components/common/Button";
import {
  downloadFile,
  generateSafeFileName,
  getFileExtension,
} from "@/lib/utils";

export default function AlertDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const {
    data: alert,
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk.alerts.itemBySlug(String(slug)),
    queryFn: ({ signal }) => getAlertBySlug(String(slug), signal),
    staleTime: 5 * 60 * 1000,
  });

  // Helper function to download file using the reusable utility
  const handleDownload = async () => {
    if (!alert?.file) return;

    try {
      const safeFileName = generateSafeFileName(alert.title || alert.slug);
      const fileExtension = getFileExtension(alert.file);
      await downloadFile(alert.file, safeFileName, fileExtension);
    } catch (error) {
      console.error("Download failed:", error);
      // You could show a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div className="h-8 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
              <div className="aspect-video w-full bg-gray-200 rounded-2xl animate-pulse" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded-lg animate-pulse"
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isError || !alert) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚫</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Alert Not Found
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {`The alert you're looking for doesn't exist or may have been removed. Please check the link or return to the alerts list.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.back()}
                variant="outline"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Go Back
              </Button>
              <Button>
                <Link href="/alerts" className="flex items-center gap-2">
                  View All Alerts
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 py-12"
      >
        {/* Navigation */}
        <motion.div variants={itemVariants} className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="mb-4"
          >
            Back to Alerts
          </Button>
        </motion.div>

        {/* Main Content Card */}
        <motion.article
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#136fb7] to-[#0a2c75] p-8 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {alert.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(alert.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>
                      {alert.views_count?.toLocaleString() ?? 0} views
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {alert.file && (
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    leftIcon={<Download className="w-4 h-4" />}
                    // className=" hover:bg-white/30 text-white border-white/30"
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Image Display */}
            {alert.file && (
              <motion.div variants={itemVariants} className="mb-8 group">
                <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-50">
                  <img
                    src={alert.file}
                    alt={alert.title}
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            )}

            {/* Description Content */}
            <motion.div variants={itemVariants} className="mb-8">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#136fb7] prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: alert.desc || "" }}
              />
            </motion.div>

            {/* Engagement Section */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-gray-100"
            >
              {/* Engagement Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-medium">{alert.likes_count ?? 0}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ThumbsDown className="w-5 h-5" />
                  <span className="font-medium">
                    {alert.dislikes_count ?? 0}
                  </span>
                </div>
                {alert.comments?.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">
                      {alert.comments.length} comments
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ThumbsUp className="w-4 h-4" />}
                >
                  Like
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                >
                  Comment
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.article>

        {/* Related or Additional Info */}
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📋 Document Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Document ID:</span>
              <span className="text-gray-600 ml-2">{alert.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Category:</span>
              <span className="text-gray-600 ml-2">Medical Research</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="text-green-600 ml-2 font-medium">
                {alert.active ? "✅ Active" : "❌ Inactive"}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
