// app/exam/[id]/results/page.tsx - REFACTORED FOR ACTUAL API

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Flag,
  Clock,
  Award,
  RefreshCw,
  ArrowLeft,
  Download,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";

// Types based on your API response
interface ExamQuestion {
  id: string;
  desc: string;
  section: {
    id: number;
    title: string;
    slug: string;
  };
  chapter: {
    id: number;
    title: string;
    slug: string;
  };
  explain: string;
  answer_id: string;
  is_flagged: boolean;
}

interface ExamResultData {
  id: string;
  name: string;
  mode: "test" | "tutor";
  question_type: string;
  time_mode: "timed" | "extended" | "untimed";
  attempted: string;
  remaining: string;
  current_question: null;
  questions: ExamQuestion[];
  flagged: string[];
  not_attempted: string[];
}

interface ExamResultResponse {
  data: ExamResultData;
  status: number;
  message: string;
}

export default function ExamResultsPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // Fetch exam results
  const examResultsQuery = useQuery({
    queryKey: ["examResults", examId],
    queryFn: () => apiFetch<ExamResultResponse>(`/user/exams/${examId}`),
    enabled: !!examId,
  });

  const data = examResultsQuery.data?.data;

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!data) return null;

    const totalQuestions = data.questions.length;
    const attemptedCount = parseInt(data.attempted) || 0;
    const notAttemptedCount = data.not_attempted.length;
    const flaggedCount = data.flagged.length;

    // Since this is results page, we assume exam is completed
    // You might need to fetch additional data for correct/incorrect counts
    const answeredCount = totalQuestions - notAttemptedCount;

    return {
      total: totalQuestions,
      attempted: attemptedCount,
      answered: answeredCount,
      notAttempted: notAttemptedCount,
      flagged: flaggedCount,
      // Note: You'll need actual score data from a different endpoint
      // or include it in the exam results response
      percentage: Math.round((attemptedCount / totalQuestions) * 100),
    };
  }, [data]);

  // Group questions by section
  const questionsBySection = React.useMemo(() => {
    if (!data?.questions) return {};

    return data.questions.reduce((acc, question, index) => {
      const sectionTitle = question.section.title;
      if (!acc[sectionTitle]) {
        acc[sectionTitle] = [];
      }
      acc[sectionTitle].push({ ...question, questionNumber: index + 1 });
      return acc;
    }, {} as Record<string, (ExamQuestion & { questionNumber: number })[]>);
  }, [data?.questions]);

  // Loading state
  if (examResultsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-lg font-medium">Loading results...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (examResultsQuery.error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Results
            </h2>
            <p className="text-gray-600 mb-4">
              {examResultsQuery.error?.message ||
                "Failed to load exam results."}
            </p>
            <Button onClick={() => router.push("/exams")} className="w-full">
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/exams")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Exams
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Exam Results
                </h1>
                <p className="text-gray-600">{data.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => router.push(`/exam/${examId}/retake`)}
              >
                <RefreshCw className="h-4 w-4" />
                Retake Exam
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sections">By Section</TabsTrigger>
            <TabsTrigger value="review">Question Review</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Completion Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-700 mb-2">
                      {stats?.percentage}%
                    </div>
                    <Badge variant="secondary" className="mb-3">
                      COMPLETED
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {stats?.answered} out of {stats?.total} answered
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Attempted Questions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Attempted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700 mb-2">
                      {stats?.attempted}
                    </div>
                    <Progress
                      value={
                        ((stats?.attempted || 0) / (stats?.total || 1)) * 100
                      }
                      className="mb-2"
                    />
                    <p className="text-sm text-gray-600">
                      {Math.round(
                        ((stats?.attempted || 0) / (stats?.total || 1)) * 100
                      )}
                      % of total
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Not Attempted */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
                    <XCircle className="h-5 w-5" />
                    Not Attempted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-700 mb-2">
                      {stats?.notAttempted}
                    </div>
                    <Progress
                      value={
                        ((stats?.notAttempted || 0) / (stats?.total || 1)) * 100
                      }
                      className="mb-2 [&>div]:bg-orange-500"
                    />
                    <p className="text-sm text-gray-600">
                      {Math.round(
                        ((stats?.notAttempted || 0) / (stats?.total || 1)) * 100
                      )}
                      % of total
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Flagged Questions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
                    <Flag className="h-5 w-5" />
                    Flagged
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-700 mb-2">
                      {stats?.flagged}
                    </div>
                    <p className="text-sm text-gray-600">
                      Questions marked for review
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exam Details */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Exam Mode:</span>
                    <p className="capitalize text-gray-600">{data.mode}</p>
                  </div>
                  <div>
                    <span className="font-medium">Question Type:</span>
                    <p className="capitalize text-gray-600">
                      {data.question_type}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Time Mode:</span>
                    <p className="capitalize text-gray-600">{data.time_mode}</p>
                  </div>
                  <div>
                    <span className="font-medium">Total Questions:</span>
                    <p className="text-gray-600">{stats?.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(questionsBySection).map(
                ([sectionTitle, questions]) => (
                  <Card key={sectionTitle}>
                    <CardHeader>
                      <CardTitle className="text-lg">{sectionTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Questions:</span>
                          <span className="text-gray-600">
                            {questions.length}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Chapters:</h4>
                          {Array.from(
                            new Set(questions.map((q) => q.chapter.title))
                          ).map((chapter) => (
                            <Badge
                              key={chapter}
                              variant="outline"
                              className="text-xs"
                            >
                              {chapter}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </TabsContent>

          {/* Question Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Questions List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Questions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {data.questions.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() => setSelectedQuestion(index)}
                        className={cn(
                          "w-full p-3 text-left border-b last:border-b-0 hover:bg-gray-50 transition-colors",
                          selectedQuestion === index &&
                            "bg-blue-50 border-blue-200"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Q{index + 1}</span>
                          {question.answer_id ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-orange-600" />
                          )}
                          {question.is_flagged && (
                            <Flag className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {question.section.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Question Detail */}
              <div className="lg:col-span-3">
                {selectedQuestion !== null ? (
                  <QuestionReview
                    question={data.questions[selectedQuestion]}
                    questionNumber={selectedQuestion + 1}
                  />
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <p className="text-gray-500">
                        Select a question to review
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Question Review Component
interface QuestionReviewProps {
  question: ExamQuestion;
  questionNumber: number;
}

const QuestionReview: React.FC<QuestionReviewProps> = ({
  question,
  questionNumber,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Question {questionNumber}
            {question.answer_id ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-orange-600" />
            )}
            {question.is_flagged && (
              <Flag className="h-5 w-5 text-yellow-600" />
            )}
          </CardTitle>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="secondary">{question.section.title}</Badge>
            <Badge variant="outline">{question.chapter.title}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question Text */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div
            className="text-gray-900 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: question.desc }}
          />
        </div>

        {/* Answer Status */}
        <div className="p-3 rounded-lg border-2 bg-blue-50 border-blue-300">
          <div className="flex items-center gap-2">
            <span className="font-medium text-blue-900">
              {question.answer_id ? "Answer Provided" : "Not Answered"}
            </span>
            {question.answer_id && (
              <Badge variant="outline">ID: {question.answer_id}</Badge>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Explanation</h4>
          <div
            className="text-green-800 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: question.explain }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
