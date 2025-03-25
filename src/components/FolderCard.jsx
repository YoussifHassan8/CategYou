import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import FolderIcon from "./FolderIcon";
import DropAreaAlert from "./DropAreaAlert";
import DeleteWindow from "./DeleteWindow";

const FolderCard = ({
  folderName,
  videoId,
  numberOfVideos,
  folderId,
  setFolders,
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFolderClick = () => {
    navigate(`/liked-videos/folders/${folderId}`);
  };

  const deleteFolder = (folderId) => {
    setFolders((prev) => {
      const folderToDelete = prev[folderId];
      const parentId = folderToDelete.parentFolder;

      const foldersToDelete = new Set();
      const queue = [folderId];
      while (queue.length) {
        const currentId = queue.pop();
        if (foldersToDelete.has(currentId)) continue;
        foldersToDelete.add(currentId);
        const currentFolder = prev[currentId];
        if (currentFolder?.subFolders) {
          queue.push(...currentFolder.subFolders);
        }
      }
      const foldersToDeleteArray = Array.from(foldersToDelete);

      const newFolders = { ...prev };
      foldersToDeleteArray.forEach((id) => delete newFolders[id]);

      if (newFolders[parentId]) {
        newFolders[parentId] = {
          ...newFolders[parentId],
          subFolders: newFolders[parentId].subFolders.filter(
            (id) => !foldersToDeleteArray.includes(id)
          ),
        };
      }

      const request = window.indexedDB.open("LikedVideosDB");
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("folders", "readwrite");
        const store = transaction.objectStore("folders");
        foldersToDeleteArray.forEach((id) => store.delete(id));
        if (newFolders[parentId]) {
          store.put(newFolders[parentId]);
        }
      };

      return newFolders;
    });
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("type", "folder");
    e.dataTransfer.setData("folderId", folderId);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const type = e.dataTransfer.getData("type");

    if (type === "folder") {
      const draggedFolderId = e.dataTransfer.getData("folderId");
      if (draggedFolderId === folderId) return;

      setFolders((prev) => {
        const draggedFolder = prev[draggedFolderId];
        const targetFolder = prev[folderId];
        const currentParentId = draggedFolder.parentFolder;

        if (!draggedFolder || !targetFolder || currentParentId === folderId)
          return prev;

        const updatedParent = {
          ...prev[currentParentId],
          subFolders: prev[currentParentId].subFolders.filter(
            (id) => id !== draggedFolderId
          ),
        };

        const updatedTarget = {
          ...targetFolder,
          subFolders: [...targetFolder.subFolders, draggedFolderId],
        };

        const updatedDragged = {
          ...draggedFolder,
          parentFolder: folderId,
        };

        const request = window.indexedDB.open("LikedVideosDB");
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("folders", "readwrite");
          const store = transaction.objectStore("folders");
          [updatedParent, updatedTarget, updatedDragged].forEach((item) =>
            store.put(item)
          );
        };

        return {
          ...prev,
          [currentParentId]: updatedParent,
          [folderId]: updatedTarget,
          [draggedFolderId]: updatedDragged,
        };
      });
    } else {
      const draggedVideoId = e.dataTransfer.getData("videoId");
      const currentFolderId = e.dataTransfer.getData("currentFolderId");

      setFolders((prev) => {
        const newFolders = { ...prev };
        const sourceFolder = newFolders[currentFolderId];
        const targetFolder = newFolders[folderId];

        if (!sourceFolder || !targetFolder || currentFolderId === folderId)
          return prev;

        sourceFolder.videos = sourceFolder.videos.filter(
          (id) => id !== draggedVideoId
        );

        if (!targetFolder.videos.includes(draggedVideoId)) {
          targetFolder.videos.push(draggedVideoId);
        }

        const request = window.indexedDB.open("LikedVideosDB");
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("folders", "readwrite");
          const store = transaction.objectStore("folders");
          store.put(sourceFolder);
          store.put(targetFolder);
        };

        return newFolders;
      });
    }
  };

  return (
    <li
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={() => setIsDragging(false)}
      className={`relative group rounded-[20px] overflow-hidden mb-5 max-w-[360px] transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] 
        ${
          isDragOver
            ? "border-blue-400/30 bg-gradient-to-br from-blue-100/20 to-purple-100/10 dark:from-blue-900/30 dark:to-purple-900/10 scale-105 shadow-2xl"
            : "border-gray-200/20 dark:border-gray-700/30 hover:border-gray-300/40 dark:hover:border-gray-600/50"
        }
        ${
          isDragging
            ? "opacity-80 scale-95 -rotate-[2deg] shadow-xl backdrop-blur-lg"
            : "hover:shadow-lg backdrop-blur-sm"
        }
        ${!showConfirm ? "cursor-grab active:cursor-grabbing" : ""}
        bg-white/60 dark:bg-gray-900/60 backdrop-saturate-150 border-2`}
      onClick={handleFolderClick}
    >
      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirm(true);
          }}
          className="p-2.5 bg-red-500/95 hover:bg-red-600 rounded-xl backdrop-blur-lg text-white shadow-xl hover:shadow-red-500/30 transition-all hover:-translate-y-0.5"
          aria-label="Delete folder"
        >
          <MdDelete
            fontSize={22}
            className="transition-transform hover:scale-125"
          />
        </button>
      </div>
      <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden">
        {isDragOver ? (
          <DropAreaAlert />
        ) : videoId ? (
          <img
            src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
            alt="Video Thumbnail"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
            draggable="false"
          />
        ) : (
          <FolderIcon />
        )}
      </div>

      <div className="relative p-5 bg-gradient-to-t from-white/90 via-white/70 to-white/50 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-gray-900/60">
        <div className="flex items-center justify-between relative">
          <h3
            className="font-semibold text-xl truncate dark:text-white/95 tracking-tight 
            bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent"
          >
            {folderName}
          </h3>
          <p className="text-sm text-gray-500/95 dark:text-gray-400/90 mt-1 font-medium">
            {numberOfVideos} {numberOfVideos === 1 ? "VIDEO" : "VIDEOS"}
          </p>
        </div>
      </div>

      {showConfirm && (
        <DeleteWindow
          itemName={folderName}
          setShowConfirm={setShowConfirm}
          onDelete={() => deleteFolder(folderId)}
          itemType="folder"
        />
      )}
    </li>
  );
};

FolderCard.propTypes = {
  folderName: PropTypes.string.isRequired,
  videoId: PropTypes.string,
  numberOfVideos: PropTypes.number.isRequired,
  folderId: PropTypes.string.isRequired,
  setFolders: PropTypes.func.isRequired,
};

export default FolderCard;
