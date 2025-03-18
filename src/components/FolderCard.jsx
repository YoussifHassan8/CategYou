import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { MdDelete, MdFolder } from "react-icons/md";
import { useState } from "react";

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
    navigate(`/LikedVideos/folders/${folderId}`);
  };

  const deleteFolder = async (folderId) => {
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
    e.dataTransfer.setData("text/plain", folderId);
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
    const draggedFolderId = e.dataTransfer.getData("text/plain");
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/30 to-transparent dark:via-gray-900/20 pointer-events-none" />

      {isDragOver && (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/15">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 border-2 border-dashed border-blue-400/80 rounded-full dark:border-blue-300/60 animate-spin-slow" />
            <span className="mt-3 text-blue-500/90 font-medium dark:text-blue-300/90 text-sm tracking-wide">
              RELEASE TO MOVE
            </span>
          </div>
        </div>
      )}

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
        {videoId ? (
          <>
            <img
              src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
              alt="Video Thumbnail"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400/80 dark:text-gray-500">
            <div className="relative">
              <MdFolder size={180} className="opacity-80" />
            </div>
          </div>
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 rounded-xl">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/40 dark:border-gray-700/30 origin-center">
            <p className="mb-6 text-gray-600 dark:text-gray-300 text-center text-lg font-medium leading-relaxed">
              Delete{" "}
              <span className="text-red-500/95 font-semibold">
                {folderName}
              </span>
              ?<br />
              <span className="text-sm opacity-80">
                This action cannot be undone
              </span>
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                className="px-5 py-3 rounded-xl bg-gray-200/90 hover:bg-gray-300/80 dark:bg-gray-800 dark:hover:bg-gray-700 
                  transition-all duration-300 text-gray-700 dark:text-gray-200 flex-1 flex items-center justify-center gap-2
                  hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={() => deleteFolder(folderId)}
                className="px-5 py-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 
                  transition-all duration-300 text-white flex-1 flex items-center justify-center gap-2
                  hover:-translate-y-0.5 shadow-red-500/30 hover:shadow-lg"
              >
                <MdDelete className="text-lg" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
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
