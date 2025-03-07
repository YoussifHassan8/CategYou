import { useState } from "react";
import PropTypes from "prop-types";
import YourFolders from "../components/YourFolders";
import NoFolders from "../components/NoFolders";
import { useOutletContext } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
const Folders = () => {
  const { likedVideos } = useOutletContext();
  const location = useLocation();
  const [currentWindow, setCurrentWindow] = useState(0);
  const isSpecificFolder =
    location.pathname == "/LikedVideos/folders" ? false : true;

  const [folders, setFolders] = useState(() => {
    const storedFolders = localStorage.getItem("folders");
    return storedFolders
      ? JSON.parse(storedFolders)
      : {
          folders: {
            root: {
              id: "root",
              name: "Root",
              videos: [],
              subFolders: [],
              createdAt: Date.now(),
            },
          },
        };
  });

  return (
    <div>
      {isSpecificFolder ? (
        <Outlet
          context={{
            folders,
            setFolders,
            likedVideos,
            currentWindow,
            setCurrentWindow,
          }}
        />
      ) : folders.folders.root.subFolders.length === 0 ? (
        <NoFolders
          currentWindow={currentWindow}
          setCurrentWindow={setCurrentWindow}
          folders={folders}
          setFolders={setFolders}
          likedVideos={likedVideos}
        />
      ) : (
        <YourFolders
          currentWindow={currentWindow}
          setCurrentWindow={setCurrentWindow}
          folders={folders}
          setFolders={setFolders}
          likedVideos={likedVideos}
        />
      )}
    </div>
  );
};
Folders.propTypes = { likedVideos: PropTypes.array.isRequired };

export default Folders;
