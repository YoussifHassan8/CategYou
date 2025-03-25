import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import LikedVideos from "./pages/LikedVideos";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import Folders from "./pages/Folders";
import SpecificFolder from "./pages/SpecificFolder";

const App = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            accessToken ? (
              <Navigate to="/liked-videos" replace />
            ) : (
              <Landing setAccessToken={setAccessToken} />
            )
          }
        />
        <Route
          path="/liked-videos"
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
            <Route path=":folderID" element={<SpecificFolder />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
