import { useEffect, useMemo, useState } from "react";
import MiniOverlayController from "../../../components/overlay/MiniOverlayController";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  getStoredMiniHeight,
  getStoredMiniPlacement,
} from "../../../components/overlay/MiniOverlaySettings";

const SESSION_STORAGE_KEY = "arcade-play-session";
const MIN_W = 160;
const MAX_W = 460;

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

  const miniHeight = useMemo(() => getStoredMiniHeight(), []);
  const placement = useMemo(() => getStoredMiniPlacement(), []);
  const miniWidth = useMemo(
    () => Math.max(MIN_W, Math.min(MAX_W, Math.round(miniHeight * 2.7))),
    [miniHeight],
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


  useEffect(() => {
    const w = getCurrentWindow();

    const repin = () => {
      w.setAlwaysOnTop(true).catch(() => {});
      w.show().catch(() => {});
      w.unminimize().catch(() => {});
    };

    repin();
    const timer = window.setInterval(repin, 1200);
    window.addEventListener("focus", repin);
    document.addEventListener("visibilitychange", repin);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", repin);
      document.removeEventListener("visibilitychange", repin);
    };
  }, []);

  const formatted = useMemo(
    () => formatSeconds(remainingSeconds),
    [remainingSeconds],
  );

  return (
    <div className="mini-root bg-transparent">
      <MiniOverlayController
        showSeconds={24 * 60 * 60}
        intervalMinutes={24 * 60}
        placement={placement}
        width={miniWidth}
        height={miniHeight}
        margin={16}
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
    </div>
  );
}
