import { useEffect, useMemo, useState } from "react";
import MiniOverlayController from "../../../components/overlay/MiniOverlayController";

const SESSION_STORAGE_KEY = "arcade-play-session";

function formatSeconds(remainingSeconds: number) {
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function readSessionRemainingSeconds() {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return 0;

  try {
    const parsed = JSON.parse(raw) as { remainingSeconds?: number };
    return Math.max(0, Number(parsed.remainingSeconds) || 0);
  } catch {
    return 0;
  }
}

export function SessionMiniOverlayPage() {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    readSessionRemainingSeconds(),
  );

  useEffect(() => {
    const sync = () => setRemainingSeconds(readSessionRemainingSeconds());

    sync();
    const timer = window.setInterval(sync, 1000);
    window.addEventListener("storage", sync);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const formatted = useMemo(
    () => formatSeconds(remainingSeconds),
    [remainingSeconds],
  );

  return (
    <MiniOverlayController
      showSeconds={24 * 60 * 60}
      intervalMinutes={24 * 60}
      placement="topRight"
      width={260}
      height={90}
      margin={20}
      transparentBody
    >
      {(visible) =>
        visible ? (
          <div className="mini-root flex items-center justify-end p-2">
            <div className="rounded-md border border-zinc-700/80 bg-black/70 px-3 py-2 text-right text-zinc-100 shadow-lg backdrop-blur-sm">
              <div className="text-[11px] font-semibold">Tempo restante</div>
              <div className="font-mono text-base">{formatted}</div>
            </div>
          </div>
        ) : null
      }
    </MiniOverlayController>
  );
}
