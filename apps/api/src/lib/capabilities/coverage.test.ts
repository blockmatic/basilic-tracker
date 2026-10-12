import { findUncoveredHttpMutations } from "@repo/capabilities";
import { describe, expect, it } from "vitest";

import { domainRegistry } from "./registry.js";

describe("domain capability coverage", () => {
  it("maps coin watch HTTP mutations", () => {
    expect(
      findUncoveredHttpMutations({
        registry: domainRegistry,
        requiredOperationIds: ["putCoinWatch", "deleteCoinWatchById"],
      })
    ).toEqual([]);
  });
});
