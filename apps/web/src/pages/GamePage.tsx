import { Navigate, useParams } from "react-router-dom";

/** Legacy route — redirects to the Discover store for this game. */
export function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/mods" replace />;
  return <Navigate to={`/mods/games/${slug}`} replace />;
}
