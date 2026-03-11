import { Route, Routes } from "react-router-dom";
// import { ProtectedRoute } from "./ProtectedRoute";
import { GamesPage } from "../../features/advertisement/GamesPage";
import { PlatformSelectionPage } from "../../features/advertisement/PlatformSelectionPage";
import { NotFound } from "../../features/shared/NotFound";
import { SessionMiniOverlayPage } from "../../features/advertisement/session/SessionMiniOverlayPage";
import { ROUTES } from "./routes";

export const AppRoutes = () => (
  <Routes>
    <Route>
      <Route path={ROUTES.homepage} element={<PlatformSelectionPage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path={ROUTES.player_mini} element={<SessionMiniOverlayPage />} />
    </Route>
    <Route path={ROUTES.notFound} element={<NotFound />} />
  </Routes>
);
