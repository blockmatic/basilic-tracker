import { useSessionStorageState } from "ahooks";

const clientSessionKey = "agent-native.clientSessionId";

export function useClientSessionId(): string {
  const [id] = useSessionStorageState<string>(clientSessionKey, {
    defaultValue: () => crypto.randomUUID(),
  });
  return id ?? crypto.randomUUID();
}
