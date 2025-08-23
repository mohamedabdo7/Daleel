"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/app/components/common/PageHeader";
import {
  getArticlesByCategorySlug,
  getCategories,
} from "@/lib/api/articles.service";
import { qk } from "@/lib/queryKeys";
import CreativeSidebar, { SidebarItem } from "./components/sidebar";
import EmptyState from "./EmptyState";
import ArticleContent from "./components/ArticleContent";

export default function ArticlesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const selectedCategory = searchParams.get("cat") || undefined; // category slug
  const selectedArticle = searchParams.get("sec") || undefined; // article slug

  // --- Load categories once ---
  const {
    data: categories,
    isLoading: catsLoading,
    isError: catsError,
  } = useQuery({
    queryKey: qk.categories,
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: 5 * 60_000,
  });

  // Map categories → sidebar items (no children initially)
  const initialItems = useMemo<SidebarItem[]>(() => {
    return (categories || []).map((c) => ({ id: c.slug, title: c.title }));
  }, [categories]);

  const [items, setItems] = useState<SidebarItem[]>(initialItems);
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const updateQuery = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") sp.delete(k);
      else sp.set(k, v);
    });
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const onCategoryToggle = async (
    categorySlug: string,
    willExpand: boolean
  ) => {
    if (!willExpand) return; // only fetch on expand

    // If children are already present, skip
    const already = items.find((i) => i.id === categorySlug)?.children;
    if (already && already.length) return;

    setLoadingCategoryId(categorySlug);
    try {
      const list = await queryClient.fetchQuery({
        queryKey: qk.sections(categorySlug),
        queryFn: ({ signal }) =>
          getArticlesByCategorySlug(categorySlug, signal),
        staleTime: 60_000,
      });

      setItems((prev) =>
        prev.map((it) =>
          it.id === categorySlug
            ? {
                ...it,
                children: (list || []).map((a) => ({
                  id: a.slug,
                  title: a.title,
                })),
              }
            : it
        )
      );

      // If no article selected yet, select first one for better UX
      if (!selectedArticle && list && list[0]) {
        updateQuery({ cat: categorySlug, sec: list[0].slug });
      }
    } finally {
      setLoadingCategoryId(null);
    }
  };

  const onChildClick = (item: SidebarItem) => {
    // item.id is the article slug; find parent category that is expanded/owns this child
    const parent = items.find((it) =>
      it.children?.some((c) => c.id === item.id)
    );
    const catSlug = parent?.id || selectedCategory || undefined;
    updateQuery({ cat: catSlug, sec: item.id });
    setIsSidebarOpen(false);
  };

  const title = "Articles";
  const description = "Browse Articles of family medicine guide";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <PageHeader
        title={title}
        description={description}
        iconSrc="/api/placeholder/120/120"
        iconAlt="Articles Icon"
        showSearch={false}
      />

      <div className="flex relative">
        {/* Sidebar */}
        <div className="fixed lg:static top-0 left-0 z-40 w-80 lg:w-96 h-screen lg:h-auto transform transition-transform duration-300 ease-in-out lg:transform-none">
          <CreativeSidebar
            title="Medical Articles"
            items={items}
            onItemClick={onChildClick}
            activeItemId={selectedArticle}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onCategoryToggle={onCategoryToggle}
            loadingCategoryId={loadingCategoryId}
            className="h-full"
          />
        </div>

        {/* Content */}
        <main className="flex-1 lg:ml-0 p-4 lg:p-8 min-h-screen">
          {catsLoading && (
            <div className="max-w-5xl mx-auto">
              <div className="p-8 bg-white rounded-2xl border shadow-sm animate-pulse">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                <div className="h-4 w-11/12 bg-gray-200 rounded" />
              </div>
            </div>
          )}

          {catsError && (
            <div className="max-w-5xl mx-auto p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
              Failed to load categories.
            </div>
          )}

          {!selectedArticle ? (
            <EmptyState
              title="Select an article to begin reading"
              description="Explore our comprehensive collection of medical articles and guides"
            />
          ) : (
            <div className="max-w-5xl mx-auto">
              <ArticleContent articleSlug={selectedArticle} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, Sparkles } from "lucide-react";
// import EmptyState from "./EmptyState";
// import CreativeSidebar, { SidebarItem } from "./Sidebar";
// import PageHeader from "@/app/components/common/PageHeader";

// // Sample data with enhanced structure
// const articlesData: SidebarItem[] = [
//   {
//     id: "family-medicine",
//     title: "Family Medicine",
//     children: [
//       { id: "pertussis", title: "Pertussis: Common Questions and Answers" },
//       {
//         id: "acute-headache",
//         title: "Acute Headache in Adults: Outpatient Evaluation",
//       },
//       {
//         id: "treatment-common",
//         title: "Treatment of the Common Cold in Children and Adults",
//       },
//       { id: "alpha-beta-thalassemia", title: "Alpha- and Beta-thalassemia" },
//       { id: "bioterrorism", title: "Bioterrorism" },
//       { id: "college-student-care", title: "Care of the College Student" },
//     ],
//   },
//   {
//     id: "pediatrics",
//     title: "Pediatrics",
//     children: [
//       { id: "child-development", title: "Child Development Milestones" },
//       {
//         id: "vaccination-schedule",
//         title: "Vaccination Schedule for Children",
//       },
//       {
//         id: "common-pediatric-conditions",
//         title: "Common Pediatric Conditions",
//       },
//       { id: "pediatric-emergencies", title: "Pediatric Emergency Management" },
//     ],
//   },
//   {
//     id: "internal-medicine",
//     title: "Internal Medicine",
//     children: [
//       { id: "diabetes-management", title: "Diabetes Management Guidelines" },
//       {
//         id: "hypertension-treatment",
//         title: "Hypertension Treatment Protocols",
//       },
//       { id: "cardiac-assessment", title: "Cardiovascular Risk Assessment" },
//     ],
//   },
// ];

// // Enhanced article content with more details
// interface ArticleContent {
//   title: string;
//   content: string;
//   keyPoints: string[];
//   category: string;
//   readTime: string;
// }

// const articleContent: Record<string, ArticleContent> = {
//   pertussis: {
//     title: "Pertussis: Common Questions and Answers",
//     content:
//       "Pertussis, also known as whooping cough, is a highly contagious respiratory disease caused by the bacterium Bordetella pertussis. This comprehensive guide covers diagnosis, treatment, and prevention strategies for healthcare providers. The disease is characterized by severe coughing fits followed by a distinctive 'whooping' sound during inhalation. Early recognition and appropriate management are crucial for preventing transmission and complications.",
//     keyPoints: [
//       "Highly contagious respiratory infection with characteristic 'whooping' sound",
//       "Most dangerous in infants under 1 year of age",
//       "Vaccination is the most effective prevention method",
//       "Early antibiotic treatment reduces transmission and severity",
//     ],
//     category: "Family Medicine",
//     readTime: "8 min read",
//   },
//   "acute-headache": {
//     title: "Acute Headache in Adults: Outpatient Evaluation",
//     content:
//       "Headache is one of the most common complaints in outpatient medicine. The evaluation of acute headache in adults requires a systematic approach to identify potentially serious underlying conditions while managing the majority of benign cases effectively. This guide provides a structured framework for assessment, red flag identification, and appropriate management strategies.",
//     keyPoints: [
//       "Systematic approach crucial for proper evaluation",
//       "Red flags indicate need for immediate intervention",
//       "Most headaches are benign but require proper assessment",
//       "Consider secondary causes in new-onset severe headaches",
//     ],
//     category: "Family Medicine",
//     readTime: "12 min read",
//   },
//   "child-development": {
//     title: "Child Development Milestones",
//     content:
//       "Understanding normal child development is crucial for early identification of developmental delays and appropriate intervention strategies. This guide provides comprehensive milestones for physical, cognitive, and social development across different age groups. Regular monitoring helps ensure children reach their developmental potential.",
//     keyPoints: [
//       "Early identification of delays improves outcomes",
//       "Developmental milestones vary among children",
//       "Regular monitoring and assessment recommended",
//       "Family involvement essential for optimal development",
//     ],
//     category: "Pediatrics",
//     readTime: "10 min read",
//   },
//   "diabetes-management": {
//     title: "Diabetes Management Guidelines",
//     content:
//       "Comprehensive diabetes management requires a multidisciplinary approach focusing on glycemic control, cardiovascular risk reduction, and prevention of complications. This evidence-based guide covers current treatment protocols, lifestyle modifications, and monitoring strategies for optimal patient outcomes.",
//     keyPoints: [
//       "Multidisciplinary approach improves outcomes",
//       "Glycemic control prevents long-term complications",
//       "Lifestyle modifications are fundamental",
//       "Regular monitoring and adjustment necessary",
//     ],
//     category: "Internal Medicine",
//     readTime: "15 min read",
//   },
// };

// const ArticlesPage: React.FC = () => {
//   const [activeItemId, setActiveItemId] = useState<string | undefined>();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleItemClick = (item: SidebarItem) => {
//     setActiveItemId(item.id);
//     setIsSidebarOpen(false);
//   };

//   const handleSearch = (query: string) => {
//     console.log("Searching for:", query);
//     // Implement search logic here
//   };

//   const selectedContent = activeItemId ? articleContent[activeItemId] : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Page Header - Using your existing component */}
//       <PageHeader
//         title="Articles"
//         description="Browse Articles of family medicine guide"
//         iconSrc="/api/placeholder/120/120" // Replace with your actual icon path
//         iconAlt="Articles Icon"
//         showSearch={true}
//         searchPlaceholder="Search in Articles"
//         onSearch={handleSearch}
//       />

//       <div className="flex relative">
//         {/* Mobile Menu Button */}
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white rounded-2xl shadow-xl border border-gray-200 backdrop-blur-sm bg-white/90"
//         >
//           {isSidebarOpen ? (
//             <X className="h-6 w-6 text-gray-600" />
//           ) : (
//             <Menu className="h-6 w-6 text-gray-600" />
//           )}
//         </motion.button>

//         {/* Mobile Overlay */}
//         <AnimatePresence>
//           {isSidebarOpen && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsSidebarOpen(false)}
//               className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
//             />
//           )}
//         </AnimatePresence>

//         {/* Creative Sidebar */}
//         <div
//           className={`
//             fixed lg:static
//             top-0 left-0 z-40
//             w-80 lg:w-96
//             h-screen lg:h-auto
//             transform transition-transform duration-300 ease-in-out lg:transform-none
//             ${
//               isSidebarOpen
//                 ? "translate-x-0"
//                 : "-translate-x-full lg:translate-x-0"
//             }
//           `}
//         >
//           <CreativeSidebar
//             title="Medical Articles"
//             items={articlesData}
//             onItemClick={handleItemClick}
//             activeItemId={activeItemId}
//             isOpen={isSidebarOpen}
//             onClose={() => setIsSidebarOpen(false)}
//             className="h-full"
//           />
//         </div>

//         {/* Main Content - Auto height with enhanced styling */}
//         <div className="flex-1 lg:ml-0">
//           {selectedContent ? (
//             <motion.div
//               key={activeItemId}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//               className="p-4 lg:p-8 min-h-screen"
//             >
//               <div className="max-w-5xl mx-auto">
//                 <div className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-8 lg:p-12 backdrop-blur-sm bg-white/95">
//                   {/* Article Header */}
//                   <header className="mb-10">
//                     <div className="flex items-center gap-4 mb-6">
//                       <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//                         {selectedContent.category}
//                       </span>
//                       <span className="text-gray-500 text-sm">
//                         {selectedContent.readTime}
//                       </span>
//                     </div>

//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: "6rem" }}
//                       transition={{ duration: 0.8, delay: 0.2 }}
//                       className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 rounded-full mb-6"
//                     />

//                     <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
//                       {selectedContent.title}
//                     </h1>
//                   </header>

//                   {/* Article Content */}
//                   <div className="prose prose-xl max-w-none">
//                     <div className="text-gray-700 leading-relaxed text-lg mb-10 space-y-4">
//                       {selectedContent.content
//                         .split(". ")
//                         .map((sentence, index) => (
//                           <motion.span
//                             key={index}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3, delay: index * 0.1 }}
//                             className="block"
//                           >
//                             {sentence}
//                             {index <
//                             selectedContent.content.split(". ").length - 1
//                               ? ". "
//                               : ""}
//                           </motion.span>
//                         ))}
//                     </div>

//                     {/* Key Points Section */}
//                     {selectedContent.keyPoints && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.3 }}
//                         className="p-8 bg-gradient-to-r from-blue-50 via-blue-50 to-cyan-50 rounded-3xl border border-blue-100 shadow-lg shadow-blue-500/5"
//                       >
//                         <div className="flex items-center mb-6">
//                           <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 mr-4">
//                             <Sparkles className="w-6 h-6 text-white" />
//                           </div>
//                           <h3 className="text-2xl font-bold text-blue-900">
//                             Key Points
//                           </h3>
//                         </div>

//                         <ul className="space-y-4">
//                           {selectedContent.keyPoints.map((point, index) => (
//                             <motion.li
//                               key={index}
//                               initial={{ opacity: 0, x: -20 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               transition={{
//                                 duration: 0.3,
//                                 delay: 0.4 + index * 0.1,
//                               }}
//                               className="flex items-start group"
//                             >
//                               <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mt-2 mr-4 flex-shrink-0 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-shadow" />
//                               <span className="text-blue-900 text-lg leading-relaxed font-medium">
//                                 {point}
//                               </span>
//                             </motion.li>
//                           ))}
//                         </ul>
//                       </motion.div>
//                     )}

//                     {/* Additional Content Section */}
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.5, delay: 0.6 }}
//                       className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-200"
//                     >
//                       <h4 className="text-xl font-semibold text-gray-800 mb-3">
//                         Clinical Considerations
//                       </h4>
//                       <p className="text-gray-700 leading-relaxed">
//                         Healthcare providers should consider individual patient
//                         factors, comorbidities, and current evidence-based
//                         guidelines when implementing these recommendations.
//                         Regular follow-up and monitoring are essential for
//                         optimal patient outcomes.
//                       </p>
//                     </motion.div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ) : (
//             <EmptyState
//               title="Select an article to begin reading"
//               description="Explore our comprehensive collection of medical articles and guides"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArticlesPage;
