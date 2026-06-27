import RegisterPage from "./components/pages/RegisterPage"
import { Toaster } from "sonner"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./components/pages/LoginPage"
import MusicSelectionPage from "./components/pages/MusicSelectionPage"
import AlbumPlayerPage from "./components/pages/AlbumPlayerPage"
import LibraryPage from "./components/pages/LibraryPage"
import Layout from "./components/tools/layout"
import SongLibrary from "./components/pages/SongSection"
import MoodLibrary from "./components/pages/MoodSection"
import SongPage from "./components/pages/SongPlayer"
import AlbumPlayer from "./components/AlbumPlayer"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/register" replace />} />
          <Route path="/selection" element={<MusicSelectionPage />} />
          <Route path="/player" element={<AlbumPlayerPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/song" element={<SongLibrary />} />
          <Route path="/library/mood" element={<MoodLibrary />} />
        </Route>
        <Route path="/song/:id" element={<SongPage />} />
        <Route path="/player/:id" element={<AlbumPlayer />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App