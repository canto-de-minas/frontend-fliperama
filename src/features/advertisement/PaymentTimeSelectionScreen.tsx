import { useState } from "react";

type PaymentTimeSelectionScreenProps = {
  durationOptionsMinutes: readonly number[];
  onSelectDuration: (minutes: number) => void;
};

export function PaymentTimeSelectionScreen({
  durationOptionsMinutes,
  onSelectDuration,
}: PaymentTimeSelectionScreenProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center gap-8 overflow-hidden bg-zinc-950 px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="z-10 w-full max-w-xl rounded-2xl border border-zinc-700/80 bg-zinc-900/70 p-8 text-center shadow-2xl backdrop-blur-sm">
        <h1 className="text-2xl font-bold">Pagamento</h1>
        <p className="mt-2 text-sm text-zinc-300">
          Escaneie o QR Code e escolha o tempo de uso para liberar a sessão.
        </p>

        <div className="mx-auto mt-8 flex h-52 w-52 items-center justify-center rounded-xl border border-dashed border-zinc-500 bg-zinc-800 text-xs text-zinc-300">
          QR Code (visual)
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {durationOptionsMinutes.map((minutes) => {
            const isSelected = selectedDuration === minutes;

            return (
              <button
                key={minutes}
                type="button"
                onClick={() => {
                  setSelectedDuration(minutes);
                  onSelectDuration(minutes);
                }}
                className={[
                  "rounded-lg border px-4 py-3 text-sm font-semibold transition",
                  isSelected
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                    : "border-zinc-600 bg-zinc-800 hover:border-zinc-400 hover:bg-zinc-700",
                ].join(" ")}
              >
                {minutes} minutos
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
