import { AppProvider } from "./provider/AppProvider";
import { HyperspinThemeProvider } from "./provider/HyperspinThemeProvider";
import { ThemeProvider } from "./provider/ThemeProviderContext";
import { AppRoutes } from "./routers/AppRoutes";
import { PlaySessionProvider } from "../features/advertisement/session/PlaySessionContext";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <HyperspinThemeProvider>
        <AppProvider>
          <PlaySessionProvider>
            <AppRoutes />
          </PlaySessionProvider>
        </AppProvider>
      </HyperspinThemeProvider>
    </ThemeProvider>
  );
}
