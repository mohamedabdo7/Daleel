"use client";

import * as React from "react";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type Action =
  | {
      label: string;
      href: string;
      variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
    }
  | {
      label: string;
      onClick: () => void;
      variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
    };

export default function EmptyState({
  title = "Nothing here yet",
  description,
  icon,
  action,
  secondaryAction,
  compact = false,
  className = "",
  children,
}: {
  title?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: Action;
  secondaryAction?: Action;
  /** compact = tighter paddings for embedding inside cards/grids */
  compact?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={[
        "w-full border border-dashed rounded-2xl text-center bg-background",
        compact ? "p-6" : "p-10",
        className,
      ].join(" ")}
    >
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted/50 text-muted-foreground mb-4">
        {icon ?? <ImageOff className="h-6 w-6" aria-hidden="true" />}
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>

      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}

      {(action || secondaryAction) && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {action ? <ActionButton action={action} /> : null}
          {secondaryAction ? (
            <ActionButton action={secondaryAction} variantFallback="outline" />
          ) : null}
        </div>
      )}

      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}

function ActionButton({
  action,
  variantFallback,
}: {
  action: Action;
  variantFallback?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive";
}) {
  const variant = (action as any).variant ?? variantFallback ?? "default";

  if ("href" in action) {
    return (
      <Button asChild variant={variant}>
        <Link href={action.href}>{action.label}</Link>
      </Button>
    );
  }
  return (
    <Button onClick={action.onClick} variant={variant}>
      {action.label}
    </Button>
  );
}
