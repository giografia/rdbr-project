import { Routes, Route } from "react-router";
import PageLayout from "./components/layout/PageLayout";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SessionsPage from "./pages/SessionsPage";

function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
