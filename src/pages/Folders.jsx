import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import YourFolders from "../components/YourFolders";
import NoFolders from "../components/NoFolders";
import { useOutletContext } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";

const Folders = () => {
  const { likedVideos } = useOutletContext();
  const location = useLocation();
  const [currentWindow, setCurrentWindow] = useState(0);
  const isSpecificFolder = location.pathname !== "/LikedVideos/folders";

  const [folders, setFolders] = useState({
    folders: {
      root: {
        id: "root",
        name: "Root",
        videos: [],
        subFolders: [],
        createdAt: Date.now(),
      },
    },
  });

  useEffect(() => {
    const request = window.indexedDB.open("LikedVideosDB");

    request.onsuccess = (event) => {
      const db = event.target.result;

      const folderTransaction = db.transaction("folders", "readonly");
      const folderStore = folderTransaction.objectStore("folders");
      const getFoldersRequest = folderStore.get("foldersData");

      getFoldersRequest.onsuccess = () => {
        if (getFoldersRequest.result) {
          setFolders(getFoldersRequest.result);
        }
      };
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  }, []);

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
