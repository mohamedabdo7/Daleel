import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Download utility functions for handling file downloads
 * Path: @/lib/utils/download.ts
 */

/**
 * Downloads a file from a URL with a specified filename
 * @param url - The URL of the file to download
 * @param filename - The desired filename for the downloaded file
 * @param fileExtension - The file extension (optional, will be auto-detected if not provided)
 */
export const downloadFile = async (
  url: string,
  filename: string,
  fileExtension?: string
): Promise<void> => {
  try {
    // Fetch the file
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Get the blob data
    const blob = await response.blob();

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Set filename with extension
    const finalFilename = fileExtension
      ? `${filename}.${fileExtension}`
      : filename;

    link.download = finalFilename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};

/**
 * Generates a safe filename by removing/replacing invalid characters
 * @param title - The original title/name
 * @param maxLength - Maximum length for the filename (default: 100)
 * @returns A safe filename string
 */
export const generateSafeFileName = (
  title: string,
  maxLength: number = 100
): string => {
  if (!title) {
    return "untitled";
  }

  return (
    title
      // Remove HTML tags if any
      .replace(/<[^>]*>/g, "")
      // Replace invalid filename characters with underscores
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
      // Replace multiple spaces with single space
      .replace(/\s+/g, " ")
      // Trim whitespace
      .trim()
      // Limit length
      .substring(0, maxLength)
      // Remove trailing dots and spaces (Windows compatibility)
      .replace(/[.\s]+$/, "") ||
    // Fallback if empty after cleaning
    "untitled"
  );
};

/**
 * Extracts file extension from a URL or filename
 * @param url - The URL or filename
 * @returns The file extension without the dot, or empty string if none found
 */
export const getFileExtension = (url: string): string => {
  if (!url) return "";

  try {
    // Parse URL to get pathname
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Extract extension from pathname
    const lastDotIndex = pathname.lastIndexOf(".");
    const lastSlashIndex = pathname.lastIndexOf("/");

    // Make sure the dot is after the last slash (not part of a directory name)
    if (lastDotIndex > lastSlashIndex && lastDotIndex !== -1) {
      return pathname.substring(lastDotIndex + 1).toLowerCase();
    }

    return "";
  } catch {
    // If URL parsing fails, try simple string extraction
    const lastDotIndex = url.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      const extension = url.substring(lastDotIndex + 1);
      // Basic validation - extension shouldn't contain slashes or be too long
      if (
        extension.length <= 10 &&
        !extension.includes("/") &&
        !extension.includes("?")
      ) {
        return extension.toLowerCase();
      }
    }
    return "";
  }
};

/**
 * Gets the MIME type based on file extension
 * @param extension - File extension without dot
 * @returns MIME type string
 */
export const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Text
    txt: "text/plain",
    csv: "text/csv",
    json: "application/json",
    xml: "application/xml",

    // Archives
    zip: "application/zip",
    rar: "application/x-rar-compressed",

    // Audio/Video
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    avi: "video/x-msvideo",

    // Default
    "": "application/octet-stream",
  };

  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
};

/**
 * Downloads a file with proper error handling and user feedback
 * @param url - The URL of the file to download
 * @param title - The title to base the filename on
 * @param customExtension - Optional custom extension to override auto-detection
 */
export const downloadFileWithFeedback = async (
  url: string,
  title: string,
  customExtension?: string
): Promise<void> => {
  try {
    const safeFileName = generateSafeFileName(title);
    const fileExtension = customExtension || getFileExtension(url);

    await downloadFile(url, safeFileName, fileExtension);

    // You can add toast notification here if needed
    // toast.success('File downloaded successfully!');
  } catch (error) {
    console.error("Download failed:", error);
    // toast.error('Failed to download file. Please try again.');
    throw error;
  }
};

/**
 * Checks if a URL is likely downloadable
 * @param url - The URL to check
 * @returns Boolean indicating if the URL appears to be a downloadable file
 */
export const isDownloadableUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    const extension = getFileExtension(url);

    // Check if it has a file extension
    if (extension) return true;

    // Check if the URL path suggests it's a file endpoint
    const pathname = urlObj.pathname.toLowerCase();
    return (
      pathname.includes("/download") ||
      pathname.includes("/file") ||
      pathname.includes("/attachment")
    );
  } catch {
    return false;
  }
};
