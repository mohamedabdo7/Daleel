"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
} from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Play,
  RotateCcw,
  Flag,
  TrendingUp,
} from "lucide-react";

// UI Components
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Custom Components
import PageHeader from "@/app/components/common/PageHeader";
import Pagination from "@/app/components/common/Pagination";
import { ExamListItem, useExamsList } from "../exam/add/components/useExamApi";

const PER_PAGE = 10;

const ExamsPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  // Get language from route params
  const lang = (params?.lang as string) ?? "en";

  // URL state
  const currentPage = Math.max(
    parseInt(searchParams.get("page") || "1", 10) || 1,
    1
  );
  const keyword = (searchParams.get("search") || "").trim();

  // Local search input mirror
  const [searchInput, setSearchInput] = useState(keyword);
  useEffect(() => setSearchInput(keyword), [keyword]);

  // Build query params for API
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      search: keyword || undefined,
      per_page: PER_PAGE,
    }),
    [currentPage, keyword]
  );

  // React Query
  const { data, isLoading, isError, error } = useExamsList(queryParams);

  // Safe access
  const items = data?.data ?? [];
  const meta = data?.meta;
  const states = data?.states;
  const total = meta?.total ?? items.length;
  const perPage = meta?.per_page ?? PER_PAGE;
  const lastPage = meta?.last_page ?? Math.max(1, Math.ceil(total / perPage));
  const pageNow = meta?.current_page ?? currentPage;

  // URL update helper
  const updateQuery = useCallback(
    (params: Record<string, string | undefined>) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (!v) sp.delete(k);
        else sp.set(k, v);
      });
      router.replace(`${pathname}?${sp.toString()}`);
      if (params.page) window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pathname, router, searchParams]
  );

  // Event handlers
  const handleSearch = useCallback(
    (value: string) =>
      updateQuery({ search: value || undefined, page: undefined }),
    [updateQuery]
  );

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    updateQuery({ search: undefined, page: undefined });
  }, [updateQuery]);

  const handlePageChange = useCallback(
    (page: number) => updateQuery({ page: String(page) }),
    [updateQuery]
  );

  const handleAddExam = () => {
    router.push(`/${lang}/exam/add`);
  };

  const handleExamAction = (examId: string, action: "resume" | "view") => {
    if (action === "resume") {
      router.push(`/${lang}/exam/${examId}`);
    } else {
      router.push(`/${lang}/exam/${examId}/results`);
    }
  };

  const getStatusBadge = (exam: ExamListItem) => {
    const isFinished = exam.status === "Finished";
    const isOpened = exam.is_opened === "1";

    if (isFinished) {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    } else if (isOpened) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Play className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-gray-50 text-gray-700 border-gray-200"
      >
        <Clock className="w-3 h-3 mr-1" />
        Not Started
      </Badge>
    );
  };

  const getModeBadge = (mode: string) => {
    return mode === "tutor" ? (
      <Badge
        variant="secondary"
        className="bg-purple-50 text-purple-700 border-purple-200"
      >
        Tutor
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="bg-orange-50 text-orange-700 border-orange-200"
      >
        Test
      </Badge>
    );
  };

  const formatScore = (score: number) => {
    return score > 0 ? `${Math.round(score)}%` : "0%";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30">
      {/* Header */}
      <PageHeader
        title="My Exams"
        description="Track your exam progress and performance"
        iconAlt="Exams Icon"
        showSearch={true}
        searchPlaceholder="Search exams..."
        searchValue={searchInput}
        onSearch={handleSearch}
        onSearchInputChange={handleSearchInputChange}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        {states && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Questions Used
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {states.questions.used}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {states.questions.available} available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Exams
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{total}</div>
                <p className="text-xs text-muted-foreground">
                  Across all subjects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Questions Available
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {states.questions.available - states.questions.used}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready for practice
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search Results Info & Add Button */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {keyword && (
              <Badge variant="secondary" className="text-sm">
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    {total} result{total !== 1 ? "s" : ""} for "{keyword}"
                  </>
                )}
              </Badge>
            )}
            {keyword && (
              <button
                onClick={handleClearSearch}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Clear search
              </button>
            )}
          </div>

          <Button onClick={handleAddExam} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Exam
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-8"
            >
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {isError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <Alert className="max-w-md border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  <div className="font-medium">Failed to load exams</div>
                  <div className="text-sm opacity-90">
                    {(error as any)?.message || "Please try again later"}
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && items.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16 bg-white rounded-xl border border-gray-200"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {keyword ? "No exams found" : "No exams yet"}
              </h3>
              {keyword ? (
                <p className="text-gray-600 mb-4">
                  No results found for "{keyword}"
                </p>
              ) : (
                <p className="text-gray-600 mb-4">
                  Create your first exam to get started
                </p>
              )}
              <Button
                onClick={handleAddExam}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Exam
              </Button>
            </motion.div>
          )}

          {/* Content Table */}
          {!isLoading && !isError && items.length > 0 && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Exam Name</TableHead>
                    <TableHead className="font-semibold">Mode</TableHead>
                    <TableHead className="font-semibold">Questions</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Score</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((exam, index) => (
                    <motion.tr
                      key={exam.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium text-gray-900">
                            {exam.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {exam.question_type === "all" && "All Questions"}
                            {exam.question_type === "unused" &&
                              "Unused Questions"}
                            {exam.question_type === "incorrect" &&
                              "Incorrect Questions"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getModeBadge(exam.mode)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {exam.questions_number}
                          </span>
                          {exam.flag_count !== "0" && (
                            <Badge variant="outline" className="text-xs">
                              <Flag className="w-3 h-3 mr-1" />
                              {exam.flag_count} flagged
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(exam)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatScore(exam.score)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {exam.correct}/{exam.attempted} correct
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(exam.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {exam.status === "Resume" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleExamAction(exam.id, "resume")
                              }
                              className="flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" />
                              Resume
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleExamAction(exam.id, "view")
                                }
                                className="flex items-center gap-1"
                              >
                                View Results
                              </Button>
                              {exam.is_retake === "0" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleExamAction(exam.id, "resume")
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Retake
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="p-6 border-t border-gray-100">
                  <Pagination
                    currentPage={pageNow}
                    totalPages={lastPage}
                    totalItems={total}
                    itemsPerPage={perPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ExamsPage;
