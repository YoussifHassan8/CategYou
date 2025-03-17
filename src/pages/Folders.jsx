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
    root: {
      id: "root",
      name: "Root",
      videos: [],
      subFolders: [],
      createdAt: Date.now(),
    },
  });

  useEffect(() => {
    const request = window.indexedDB.open("LikedVideosDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("folders", { keyPath: "id" });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("folders", "readonly");
      const store = transaction.objectStore("folders");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const fetchedFolders = getAllRequest.result.reduce((acc, folder) => {
          acc[folder.id] = folder;
          return acc;
        }, {});
        console.log(fetchedFolders);
        setFolders((prev) => ({
          ...prev,
          ...fetchedFolders,
        }));
      };

      getAllRequest.onerror = () => {
        console.error("Error fetching folders from IndexedDB.");
      };
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.errorCode);
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
      ) : folders.root.subFolders.length === 0 ? (
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
