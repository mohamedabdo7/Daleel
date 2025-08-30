import React from "react";
import { Alert } from "@/lib/api/articles-alerts.service";
import { Eye, ThumbsUp, MessageSquare, Download, View } from "lucide-react";
import {
  downloadFile,
  generateSafeFileName,
  getFileExtension,
} from "@/lib/utils";
// import {
//   downloadFile,
//   generateSafeFileName,
//   getFileExtension,
// } from "@/lib/utils/download";

interface AlertCardProps {
  alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  // Extract description text from HTML
  const getDescriptionText = (htmlDesc: string) => {
    const div = document.createElement("div");
    div.innerHTML = htmlDesc;
    return div.textContent || div.innerText || "";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleView = () => {
    console.log("View alert:", alert.id);
    // Example: router.push(`/alerts/${alert.slug}`);
  };

  // Use the reusable download utility
  const handleDownload = async () => {
    if (!alert.file) return;

    try {
      const safeFileName = generateSafeFileName(alert.title || alert.slug);
      const fileExtension = getFileExtension(alert.file);
      await downloadFile(alert.file, safeFileName, fileExtension);
    } catch (error) {
      console.error("Download failed:", error);
      // You could show a toast notification here
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow duration-200">
      {/* Content */}
      <div className="space-y-4">
        {/* View count badge */}
        <div className="flex justify-end">
          <div className="bg-primary-dark text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {alert.views_count}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-primary text-base sm:text-lg leading-tight line-clamp-2">
          {alert.title}
        </h3>

        {/* Description */}
        {alert.desc && (
          <p className="text-muted-foreground text-sm sm:text-base line-clamp-3">
            {getDescriptionText(alert.desc)}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatDate(alert.created_at)}</span>
          <div className="flex items-center gap-3">
            {/* Likes */}
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {alert.likes_count}
            </div>
            {/* Comments */}
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {alert.comments.length}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleView}
            className="flex-1 bg-secondary text-primary-foreground text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <View className="w-4 h-4" />
            View
          </button>
          <button
            onClick={handleDownload}
            disabled={!alert.file}
            className="flex-1 bg-primary text-primary-foreground text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

// import React from "react";
// import { Alert } from "@/lib/api/articles-alerts.service";
// import { Eye, ThumbsUp, MessageSquare, Download, View } from "lucide-react";

// interface AlertCardProps {
//   alert: Alert;
// }

// export default function AlertCard({ alert }: AlertCardProps) {
//   // Extract description text from HTML
//   const getDescriptionText = (htmlDesc: string) => {
//     const div = document.createElement("div");
//     div.innerHTML = htmlDesc;
//     return div.textContent || div.innerText || "";
//   };

//   // Format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const handleView = () => {
//     console.log("View alert:", alert.id);
//     // Example: router.push(`/alerts/${alert.slug}`);
//   };

//   const handleDownload = () => {
//     if (alert.file) {
//       const link = document.createElement("a");
//       link.href = alert.file;
//       link.download = `${alert.slug}.pdf`;
//       link.target = "_blank";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   return (
//     <div className="bg-card rounded-2xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow duration-200">
//       {/* Content */}
//       <div className="space-y-4">
//         {/* View count badge */}
//         <div className="flex justify-end">
//           <div className="bg-primary-dark text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
//             <Eye className="w-3 h-3" />
//             {alert.views_count}
//           </div>
//         </div>

//         {/* Title */}
//         <h3 className="font-semibold text-primary text-base sm:text-lg leading-tight line-clamp-2">
//           {alert.title}
//         </h3>

//         {/* Description */}
//         {alert.desc && (
//           <p className="text-muted-foreground text-sm sm:text-base line-clamp-3">
//             {getDescriptionText(alert.desc)}
//           </p>
//         )}

//         {/* Meta info */}
//         <div className="flex items-center justify-between text-xs text-muted-foreground">
//           <span>{formatDate(alert.created_at)}</span>
//           <div className="flex items-center gap-3">
//             {/* Likes */}
//             <div className="flex items-center gap-1">
//               <ThumbsUp className="w-3 h-3" />
//               {alert.likes_count}
//             </div>
//             {/* Comments */}
//             <div className="flex items-center gap-1">
//               <MessageSquare className="w-3 h-3" />
//               {alert.comments.length}
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 pt-2">
//           <button
//             onClick={handleView}
//             className="flex-1 bg-secondary  text-primary-foreground text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
//           >
//             <View className="w-4 h-4" />
//             View
//           </button>
//           <button
//             onClick={handleDownload}
//             className="flex-1 bg-primary  text-primary-foreground text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
//           >
//             <Download className="w-4 h-4" />
//             Download
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
