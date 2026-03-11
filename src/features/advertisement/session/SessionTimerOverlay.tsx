import { useMemo } from "react";
import { usePlaySession } from "./PlaySessionContext";

function formatSeconds(remainingSeconds: number) {
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function SessionTimerOverlay() {
  const { isSessionActive, remainingSeconds, selectedDurationMinutes } =
    usePlaySession();

  const formatted = useMemo(
    () => formatSeconds(remainingSeconds),
    [remainingSeconds],
  );

  if (!isSessionActive) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] rounded-md border border-zinc-700/80 bg-black/70 px-3 py-2 text-xs text-zinc-100 shadow-lg backdrop-blur-sm">
      <div className="font-semibold">Tempo restante</div>
      <div className="font-mono text-sm">{formatted}</div>
      <div className="text-[10px] text-zinc-400">Sessão: {selectedDurationMinutes} min</div>
    </div>
  );
}
