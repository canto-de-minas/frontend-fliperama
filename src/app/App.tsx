import { AppProvider } from "./provider/AppProvider";
import { HyperspinThemeProvider } from "./provider/HyperspinThemeProvider";
import { ThemeProvider } from "./provider/ThemeProviderContext";
import { AppRoutes } from "./routers/AppRoutes";
import { PlaySessionProvider } from "../features/advertisement/session/PlaySessionContext";
import { SessionTimerOverlay } from "../features/advertisement/session/SessionTimerOverlay";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <HyperspinThemeProvider>
        <AppProvider>
          <PlaySessionProvider>
            <SessionTimerOverlay />
            <AppRoutes />
          </PlaySessionProvider>
        </AppProvider>
      </HyperspinThemeProvider>
    </ThemeProvider>
  );
}
