// utils/download.ts

/**
 * Downloads a file from a URL
 * @param fileUrl - The URL of the file to download
 * @param fileName - The name to save the file as (optional, will extract from URL if not provided)
 * @param fileExtension - The file extension (optional, defaults to .pdf)
 */
export const downloadFile = async (
  fileUrl: string,
  fileName?: string,
  fileExtension: string = "pdf"
): Promise<void> => {
  try {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;

    // Set download attribute with filename
    if (fileName) {
      link.download = fileName.includes(".")
        ? fileName
        : `${fileName}.${fileExtension}`;
    } else {
      // Extract filename from URL or use default
      const urlParts = fileUrl.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      link.download = lastPart || `download.${fileExtension}`;
    }

    link.target = "_blank";

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download file");
  }
};

/**
 * Downloads a file using fetch (for better control and error handling)
 * @param fileUrl - The URL of the file to download
 * @param fileName - The name to save the file as
 * @param fileExtension - The file extension (optional, defaults to .pdf)
 */
export const downloadFileWithFetch = async (
  fileUrl: string,
  fileName?: string,
  fileExtension: string = "pdf"
): Promise<void> => {
  try {
    // Show loading state could be added here
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;

    // Set filename
    if (fileName) {
      link.download = fileName.includes(".")
        ? fileName
        : `${fileName}.${fileExtension}`;
    } else {
      // Try to extract filename from response headers or URL
      const contentDisposition = response.headers.get("content-disposition");
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch) {
          link.download = fileNameMatch[1];
        }
      } else {
        const urlParts = fileUrl.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        link.download = lastPart || `download.${fileExtension}`;
      }
    }

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download file");
  }
};

/**
 * Extracts file extension from URL or filename
 * @param url - The URL or filename
 * @returns The file extension without the dot
 */
export const getFileExtension = (url: string): string => {
  const match = url.match(/\.([^./?#]+)(?:[?#]|$)/);
  return match ? match[1].toLowerCase() : "pdf";
};

/**
 * Generates a safe filename from a string (removes special characters)
 * @param input - The input string
 * @param maxLength - Maximum length of the filename (default: 50)
 * @returns A safe filename
 */
export const generateSafeFileName = (
  input: string,
  maxLength: number = 50
): string => {
  return input
    .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase()
    .substring(0, maxLength)
    .trim();
};
