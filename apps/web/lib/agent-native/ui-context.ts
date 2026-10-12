import type { UiContextSnapshot } from "@repo/capabilities";

import type { RailState, SidebarState } from "@/lib/coins/chrome";
import type { ViewConfig } from "@/lib/genui";

export function buildUiContextSnapshot({
  chrome,
  clientSessionId,
  contextRevision,
  draftText,
  route,
  selectionAssetId,
  viewConfig,
}: {
  chrome: { rail: RailState; sidebar: SidebarState };
  clientSessionId: string;
  contextRevision: number;
  draftText: string | null;
  route: string;
  selectionAssetId: string | null;
  viewConfig: ViewConfig;
}): UiContextSnapshot {
  return {
    chrome: {
      rail: chrome.rail ?? "commands",
      sidebar: chrome.sidebar ?? "open",
    },
    clientSessionId,
    contextRevision,
    draftText,
    route,
    selection: { assetId: selectionAssetId },
    viewConfig,
  };
}
