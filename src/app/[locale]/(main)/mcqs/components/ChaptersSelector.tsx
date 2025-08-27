// components/exam/ChaptersSelector.tsx

import React from "react";
import { Control, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateExamFormValues } from "./validation-exam";
import { QuestionType } from "./exam";
import { useChapters } from "./useExamData";

interface ChaptersSelectorProps {
  control: Control<CreateExamFormValues>;
  onMaxQuestionsChange: (max: number) => void;
}

export const ChaptersSelector: React.FC<ChaptersSelectorProps> = ({
  control,
  onMaxQuestionsChange,
}) => {
  const watchedValues = useWatch({
    control,
    name: ["section_id", "question_type", "chapters_type", "chapters"],
  });

  const [sectionId, questionType, chaptersType, selectedChapters] =
    watchedValues;

  const {
    data: chapters = [],
    isLoading,
    error,
  } = useChapters(sectionId, questionType as QuestionType);

  // Calculate max questions when chapters or selection changes
  React.useEffect(() => {
    if (chaptersType === "all" && chapters.length > 0) {
      const totalQuestions = chapters.reduce(
        (sum, chapter) => sum + chapter.questions_count,
        0
      );
      onMaxQuestionsChange(totalQuestions);
    } else if (
      chaptersType === "specific" &&
      selectedChapters &&
      selectedChapters.length > 0
    ) {
      const selectedChapterObjects = chapters.filter((chapter) =>
        selectedChapters.includes(chapter.id)
      );
      const totalQuestions = selectedChapterObjects.reduce(
        (sum, chapter) => sum + chapter.questions_count,
        0
      );
      onMaxQuestionsChange(totalQuestions);
    } else {
      onMaxQuestionsChange(0);
    }
  }, [chapters, chaptersType, selectedChapters, onMaxQuestionsChange]);

  if (chaptersType !== "specific") {
    return null;
  }

  if (!sectionId) {
    return (
      <FormItem>
        <FormLabel>Chapters</FormLabel>
        <div className="text-sm text-muted-foreground">
          Please select a section first
        </div>
      </FormItem>
    );
  }

  if (isLoading) {
    return (
      <FormItem>
        <FormLabel className="flex items-center gap-2">
          Chapters
          <Loader2 className="h-4 w-4 animate-spin" />
        </FormLabel>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </FormItem>
    );
  }

  if (error) {
    return (
      <FormItem>
        <FormLabel className="flex items-center gap-2 text-destructive">
          Chapters
          <AlertCircle className="h-4 w-4" />
        </FormLabel>
        <div className="text-sm text-destructive">
          Failed to load chapters. Please try again.
        </div>
      </FormItem>
    );
  }

  if (chapters.length === 0) {
    return (
      <FormItem>
        <FormLabel>Chapters</FormLabel>
        <div className="text-sm text-muted-foreground">
          No chapters available for this section
        </div>
      </FormItem>
    );
  }

  return (
    <FormField
      control={control}
      name="chapters"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Chapters</FormLabel>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {field.value?.length || 0} selected
              </Badge>
              {field.value && field.value.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => field.onChange([])}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          <FormControl>
            <ScrollArea className="h-64 w-full border rounded-md p-4">
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="flex items-start space-x-3">
                    <Checkbox
                      checked={field.value?.includes(chapter.id) || false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), chapter.id]);
                        } else {
                          field.onChange(
                            field.value?.filter((id) => id !== chapter.id) || []
                          );
                        }
                      }}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium leading-none">
                        {chapter.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chapter.questions_count} questions
                      </div>
                    </div>
                    {field.value?.includes(chapter.id) && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </FormControl>

          <FormMessage />

          {field.value && field.value.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Total questions available:{" "}
              {chapters
                .filter((chapter) => field.value.includes(chapter.id))
                .reduce((sum, chapter) => sum + chapter.questions_count, 0)}
            </div>
          )}
        </FormItem>
      )}
    />
  );
};
