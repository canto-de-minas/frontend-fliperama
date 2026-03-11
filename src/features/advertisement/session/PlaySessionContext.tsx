/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DEFAULT_MINUTES_OPTIONS = [5, 10, 15] as const;

type SessionStatus = "idle" | "active" | "expired";

type PlaySessionContextValue = {
  status: SessionStatus;
  durationOptionsMinutes: readonly number[];
  selectedDurationMinutes: number | null;
  remainingSeconds: number;
  startSession: (minutes: number) => void;
  resetSession: () => void;
  isSessionActive: boolean;
};

const PlaySessionContext = createContext<PlaySessionContextValue | null>(null);

export function PlaySessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const startSession = useCallback((minutes: number) => {
    if (!Number.isFinite(minutes) || minutes <= 0) return;

    setSelectedDurationMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setStatus("active");
  }, []);

  const resetSession = useCallback(() => {
    setStatus("idle");
    setRemainingSeconds(0);
    setSelectedDurationMinutes(null);
  }, []);

  useEffect(() => {
    if (status !== "active") return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setStatus("expired");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  const value = useMemo<PlaySessionContextValue>(
    () => ({
      status,
      durationOptionsMinutes: DEFAULT_MINUTES_OPTIONS,
      selectedDurationMinutes,
      remainingSeconds,
      startSession,
      resetSession,
      isSessionActive: status === "active" && remainingSeconds > 0,
    }),
    [remainingSeconds, resetSession, selectedDurationMinutes, startSession, status],
  );

  return (
    <PlaySessionContext.Provider value={value}>{children}</PlaySessionContext.Provider>
  );
}

export function usePlaySession() {
  const context = useContext(PlaySessionContext);

  if (!context) {
    throw new Error("usePlaySession must be used within PlaySessionProvider");
  }

  return context;
}
