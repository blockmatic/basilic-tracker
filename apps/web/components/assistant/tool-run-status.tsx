import { cn } from "@repo/ui/lib/utils";

export function ToolRunStatus({
  label,
  state,
}: {
  label: string;
  state:
    | "thinking"
    | "running"
    | "loading_view"
    | "success"
    | "error"
    | "interrupted"
    | "action_required";
}) {
  const text =
    state === "thinking"
      ? "Thinking…"
      : state === "running"
        ? "Running tool…"
        : state === "loading_view"
          ? "Loading view…"
          : state === "success"
            ? "Done"
            : state === "error"
              ? "Failed"
              : state === "interrupted"
                ? "Stopped"
                : "Action required";
  return (
    <p
      className={cn(
        "text-muted-foreground text-xs tabular-nums",
        state === "error" && "text-destructive"
      )}
      data-testid="tool-run-status"
    >
      {label}: {text}
    </p>
  );
}
