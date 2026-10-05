"use client";

import type { BaseComponentProps } from "@json-render/react";
import { Card } from "@repo/ui/components/card";

import type { CommandSurfaceComponentProps } from "@/lib/genui/command-catalog/definitions";

export const cardComponents = {
  StatusCard: ({
    props,
  }: BaseComponentProps<CommandSurfaceComponentProps<"StatusCard">>) => (
    <Card className="space-y-1 p-4" data-testid="status-card">
      <p className="font-medium">{props.name}</p>
      <p className="text-sm">
        {props.ok ? "Application is up" : "Application is down"}
      </p>
      <p className="text-muted-foreground text-sm">
        {props.database ? "Database is ready" : "Database is unavailable"}
      </p>
    </Card>
  ),

  UserInfo: ({
    props,
  }: BaseComponentProps<CommandSurfaceComponentProps<"UserInfo">>) => (
    <Card className="space-y-1 p-4" data-testid="user-info-card">
      <p className="font-medium">{props.name ?? "Account"}</p>
      {props.email ? (
        <p className="text-muted-foreground text-sm">{props.email}</p>
      ) : null}
    </Card>
  ),
};
