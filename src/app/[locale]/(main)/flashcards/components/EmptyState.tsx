"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";

/**
 * A friendly, flexible empty-state component.
 *
 * Usage:
 * <EmptyState title="No items" description="Please add something." action={<Button>New</Button>} />
 */
export default function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={
        "w-full rounded-2xl border-dashed p-8 text-center flex flex-col items-center gap-3 " +
        (className ?? "")
      }
    >
      <div className="grid place-items-center">
        <div className="rounded-full border p-3">
          {icon ?? <CircleAlert className="h-6 w-6 text-muted-foreground" />}
        </div>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? (
        <p className="max-w-prose text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="pt-1">{action}</div> : null}
    </Card>
  );
}
