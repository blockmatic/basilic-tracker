"use client";

import type { ConnectionRequired } from "@repo/capabilities";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";

export function ConnectionRequiredCard({
  required,
}: {
  required: ConnectionRequired;
}) {
  return (
    <div
      className="bg-card rounded-lg border p-4 text-sm"
      data-testid="connection-required-card"
    >
      <p className="font-medium">Connection required</p>
      <p className="text-muted-foreground mt-1">
        Authorize {required.connectionId} to continue this workflow.
      </p>
      <Button
        className="mt-3"
        nativeButton={false}
        render={<Link href="/settings">Open settings</Link>}
        size="sm"
        variant="secondary"
      />
    </div>
  );
}
