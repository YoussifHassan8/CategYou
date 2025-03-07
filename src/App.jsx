import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import LikedVideos from "./pages/LikedVideos";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import Folders from "./pages/Folders";
import FolderContent from "./pages/FolderContent";

const App = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const storedMode = localStorage.getItem("mode") || "light";
  const [mode, setMode] = useState(storedMode);
  return (
    <>
      <NavBar mode={mode} setMode={setMode} />
      <Routes>
        <Route
          path="/"
          element={
            accessToken ? (
              <Navigate to="/LikedVideos" replace />
            ) : (
              <Landing
                setAccessToken={setAccessToken}
                mode={mode}
                setMode={setMode}
              />
            )
          }
        />
        <Route
          path="/LikedVideos"
          element={
            accessToken ? (
              <LikedVideos
                accessToken={accessToken}
                setAccessToken={setAccessToken}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route path="folders" element={<Folders />}>
            <Route path=":folderID" element={<FolderContent />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
