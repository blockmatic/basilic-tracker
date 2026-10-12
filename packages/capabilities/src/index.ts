export {
  defineDomainAction,
  type DomainActionContext,
  type DomainActionDefinition,
} from "./domain-action.js";
export {
  createDomainRegistry,
  findUncoveredHttpMutations,
  listCapabilityMeta,
  type CapabilityMeta,
  type DomainRegistry,
} from "./registry.js";
export { runDomainAction } from "./run-domain-action.js";
export {
  capabilityKindValues,
  capabilityScopeValues,
  chromeStateSchema,
  connectionRequiredSchema,
  entityRefSchema,
  mutationEventSchema,
  mutationResultSchema,
  mutationStatusValues,
  renderDescriptorSchema,
  renderSurfaceValues,
  uiCommandAckSchema,
  uiCommandAckStatusValues,
  uiCommandCapabilityIds,
  uiCommandSchema,
  uiContextSnapshotSchema,
  type ConnectionRequired,
  type MutationEvent,
  type MutationResult,
  type RenderDescriptor,
  type UiCommand,
  type UiCommandAck,
  type UiContextSnapshot,
} from "./schemas.js";
export { documentOpSchema, type DocumentOp } from "./document.js";
export { dispatchUiCommand, uiCommandTimeoutMs } from "./ui-command.js";
export {
  trackerDomainRegistry,
  unwatchAssetCapability,
  watchAssetCapability,
} from "./tracker/registry.js";
