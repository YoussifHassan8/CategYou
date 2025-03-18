import { MdCancel } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import VideoCardTwo from "./VideoCardTwo";
import PropTypes from "prop-types";
import { useState } from "react";
import { useParams } from "react-router-dom";

const SelectVideos = ({
  folderName,
  setFolders,
  likedVideos,
  setCurrentWindow,
  currentFolderID,
}) => {
  const { folderID } = useParams();
  const [selectedVideos, setSelectedVideos] = useState(() => {
    return likedVideos.reduce((acc, video) => {
      acc[video.id] = false;
      return acc;
    }, {});
  });

  const handleToggleSelect = (videoId) => {
    setSelectedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  const handleSubmit = () => {
    const selectedVideoIds = Object.entries(selectedVideos)
      .filter(([, isSelected]) => isSelected)
      .map(([videoId]) => videoId);

    if (!selectedVideoIds.length) {
      setCurrentWindow(0);
      return;
    }

    if (currentFolderID) {
      setFolders((prev) => {
        const existingFolder = prev[currentFolderID];
        const existingVideos = new Set(existingFolder.videos);
        const newVideos = selectedVideoIds.filter(
          (id) => !existingVideos.has(id)
        );

        if (!newVideos.length) {
          setCurrentWindow(0);
          return prev;
        }

        const updatedFolder = {
          ...existingFolder,
          videos: [...existingFolder.videos, ...newVideos],
        };

        const request = window.indexedDB.open("LikedVideosDB");
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("folders", "readwrite");
          const store = transaction.objectStore("folders");
          store.put(updatedFolder);
          transaction.oncomplete = () =>
            console.log("Videos added to folder in DB");
          transaction.onerror = (e) => console.error("DB error:", e);
        };

        return {
          ...prev,
          [currentFolderID]: updatedFolder,
        };
      });
    } else {
      if (!folderName?.trim()) {
        alert("Please enter a folder name");
        return;
      }

      const parent = folderID || "root";
      const newFolderId = `folder_${Date.now()}`;

      setFolders((prev) => {
        const newFolder = {
          id: newFolderId,
          name: folderName.trim(),
          videos: selectedVideoIds,
          subFolders: [],
          createdAt: Date.now(),
          parentFolder: parent,
        };

        const updatedParent = {
          ...prev[parent],
          subFolders: [...prev[parent].subFolders, newFolderId],
        };

        const request = window.indexedDB.open("LikedVideosDB");
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("folders", "readwrite");
          const store = transaction.objectStore("folders");
          store.put(newFolder);
          store.put(updatedParent);
          transaction.oncomplete = () => console.log("New folder saved to DB");
          transaction.onerror = (e) => console.error("DB error:", e);
        };

        return {
          ...prev,
          [newFolderId]: newFolder,
          [parent]: updatedParent,
        };
      });
    }

    setCurrentWindow(0);
  };

  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-lg bg-white dark:bg-[#3E3E3E] shadow-lg border border-gray-200 dark:border-gray-700 space-y-2 w-[350px]">
      <div className="flex items-center justify-center">
        {!currentFolderID && (
          <IoMdArrowRoundBack
            className="cursor-pointer"
            onClick={() => setCurrentWindow(1)}
          />
        )}
        <h2 className="ml-auto font-medium text-gray-800 dark:text-white">
          {currentFolderID ? "Add Videos to Folder" : "Select Videos"}
        </h2>
        <MdCancel
          className="ml-auto cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-xl"
          onClick={() => setCurrentWindow(0)}
        />
      </div>

      <div className="h-[300px] overflow-auto">
        {likedVideos.map((video) => (
          <VideoCardTwo
            key={video.id}
            video={video}
            isSelected={selectedVideos[video.id]}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>

      <button
        className="flex items-center justify-center gap-2 rounded-xl w-full py-2 
          transition-all duration-300 shadow-sm text-white font-medium text-lg 
          bg-[#FF0033] cursor-pointer hover:bg-[#E60030]"
        onClick={handleSubmit}
      >
        {currentFolderID ? "Add Videos" : "Create Folder"}
      </button>
    </div>
  );
};

SelectVideos.propTypes = {
  folderName: PropTypes.string,
  setFolders: PropTypes.func.isRequired,
  likedVideos: PropTypes.array.isRequired,
  setCurrentWindow: PropTypes.func.isRequired,
  currentFolderID: PropTypes.string,
};

export default SelectVideos;
