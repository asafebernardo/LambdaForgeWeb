import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HomePage } from "@/pages/HomePage";
import { CapyLauncherPage } from "@/pages/CapyLauncherPage";
import { DownloadPage } from "@/pages/DownloadPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ModsPage } from "@/pages/ModsPage";
import { GameModsPage } from "@/pages/GameModsPage";
import { ModDetailPage } from "@/pages/ModDetailPage";
import { ModEditPage } from "@/pages/ModEditPage";
import { ModUploadPage } from "@/pages/ModUploadPage";
import { GamePage } from "@/pages/GamePage";
import { UserPage } from "@/pages/UserPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <div className="app-ambient" aria-hidden />
      <div className="content-grid" aria-hidden />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/launcher" element={<CapyLauncherPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/mods" element={<ModsPage />} />
          <Route path="/mods/games/:gameSlug" element={<GameModsPage />} />
          <Route path="/games/:slug" element={<GamePage />} />
          <Route path="/users/:username" element={<UserPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/mods/upload" element={<ModUploadPage />} />
            <Route path="/mods/:slug/edit" element={<ModEditPage />} />
          </Route>

          <Route path="/mods/:slug" element={<ModDetailPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}
