import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { exit } from "@tauri-apps/plugin-process";
import {
  listHyperspinPlatforms,
  type HyperspinPlatformTheme,
} from "../../services/hyperspinPlatformThemesService";
import { useHyperspinTheme } from "../../app/provider/HyperspinThemeProvider";
import { HyperspinThemePreview } from "./HyperspinThemePreview";

type PlatformSelectionScreenProps = {
  themesBasePath: string;
  visible?: boolean;
  onSelectPlatform: (platform: HyperspinPlatformTheme) => void | Promise<void>;
};

export function PlatformSelectionScreen({
  themesBasePath,
  visible = true,
  onSelectPlatform,
}: PlatformSelectionScreenProps) {
  const { loadThemeFromZip, clearTheme } = useHyperspinTheme();

  const [platforms, setPlatforms] = useState<HyperspinPlatformTheme[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const [platformsError, setPlatformsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredPlatforms = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return platforms;
    }

    return platforms.filter((platform) =>
      platform.name.toLowerCase().includes(normalizedSearch),
    );
  }, [platforms, searchTerm]);

  const selectedPlatform = useMemo(() => {
    if (filteredPlatforms.length === 0) return null;
    return (
      filteredPlatforms[
        Math.min(selectedIndex, filteredPlatforms.length - 1)
      ] ?? null
    );
  }, [filteredPlatforms, selectedIndex]);

  const loadPlatforms = useCallback(async () => {
    setLoadingPlatforms(true);
    setPlatformsError(null);

    try {
      const items = await listHyperspinPlatforms(themesBasePath);
      setPlatforms(items);
      setSelectedIndex(0);
    } catch (error) {
      console.error("Erro real ao ler plataformas do HyperSpin:", error);
      setPlatforms([]);
      setPlatformsError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoadingPlatforms(false);
    }
  }, [themesBasePath]);

  useEffect(() => {
    if (!visible) return;
    void loadPlatforms();
  }, [visible, loadPlatforms]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    if (!selectedPlatform) return;

    const element = itemRefs.current[selectedPlatform.themeZipPath];
    element?.scrollIntoView({
      block: "nearest",
    });
  }, [selectedPlatform]);

  useEffect(() => {
    if (!visible) return;

    if (!selectedPlatform) {
      clearTheme();
      return;
    }

    void loadThemeFromZip(selectedPlatform.themeZipPath);
  }, [visible, selectedPlatform, loadThemeFromZip, clearTheme]);

  useEffect(() => {
    if (!visible) return;
    searchInputRef.current?.focus();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase() ?? "";
      const isTypingField =
        tagName === "input" ||
        tagName === "textarea" ||
        target?.isContentEditable === true;

      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "f") {
        event.preventDefault();
        event.stopPropagation();

        exit(0).catch((error) => {
          console.error("Erro ao encerrar aplicação:", error);
        });

        return;
      }

      if (filteredPlatforms.length === 0) return;

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((currentIndex) =>
          currentIndex <= 0 ? filteredPlatforms.length - 1 : currentIndex - 1,
        );
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((currentIndex) =>
          currentIndex >= filteredPlatforms.length - 1 ? 0 : currentIndex + 1,
        );
        return;
      }

      if (event.key === "Enter" && selectedPlatform && !isTypingField) {
        event.preventDefault();
        void onSelectPlatform(selectedPlatform);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, filteredPlatforms.length, selectedPlatform, onSelectPlatform]);

  if (!visible) return null;

  return (
    <div className="grid h-screen w-screen grid-cols-[360px_1fr] overflow-hidden bg-zinc-950 text-white">
      <aside className="flex h-full min-h-0 flex-col border-r border-zinc-800 bg-zinc-900">
        <div className="shrink-0 border-b border-zinc-800 bg-zinc-900 px-5 py-4">
          <h1 className="text-lg font-semibold">Escolha a plataforma</h1>
          <p className="mt-1 text-sm text-zinc-400">{themesBasePath}</p>

          <div className="mt-4">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Filtrar por nome..."
              className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loadingPlatforms ? (
            <div className="px-5 py-4 text-sm text-zinc-400">
              Lendo plataformas...
            </div>
          ) : platformsError ? (
            <div className="px-5 py-4 text-sm text-red-500">
              {platformsError}
            </div>
          ) : filteredPlatforms.length === 0 ? (
            <div className="px-5 py-4 text-sm text-zinc-500">
              {searchTerm.trim()
                ? "Nenhuma plataforma encontrada para esse filtro."
                : "Nenhuma plataforma encontrada."}
            </div>
          ) : (
            <ul className="py-2">
              {filteredPlatforms.map((platform, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <li key={platform.themeZipPath}>
                    <button
                      ref={(element) => {
                        itemRefs.current[platform.themeZipPath] = element;
                      }}
                      type="button"
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => void onSelectPlatform(platform)}
                      className={[
                        "flex w-full items-center justify-between px-5 py-3 text-left transition-colors",
                        isSelected
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-300 hover:bg-zinc-800/60",
                      ].join(" ")}
                    >
                      <span className="truncate">{platform.name}</span>
                      {isSelected ? (
                        <span className="ml-3 text-xs text-zinc-400">
                          Enter
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <main className="h-full w-full bg-black">
        <HyperspinThemePreview />
      </main>
    </div>
  );
}
