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

        transaction.oncomplete = () => {
          console.log("Folders deleted from IndexedDB");
        };

        transaction.onerror = (event) => {
          console.error("Transaction error:", event.target.error);
        };
      };

      request.onerror = (event) => {
        console.error("Database error:", event.target.error);
      };

      return newFolders;
    });
  };

  return (
    <li
      className={`relative group rounded-xl overflow-hidden mb-4 max-w-[340px] hover:shadow-lg transition-all duration-200 ease-out bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
        !showConfirm ? "cursor-pointer" : ""
      }`}
      onClick={handleFolderClick}
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirm(true);
          }}
          className="p-2 bg-red-500/90 hover:bg-red-600 rounded-full backdrop-blur-sm text-white shadow-md transition-colors cursor-pointer"
          aria-label="Delete folder"
        >
          <MdDelete fontSize={20} />
        </button>
      </div>

      <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
        {videoId ? (
          <img
            src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
            alt="Video Thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <MdFolder size={48} />
          </div>
        )}
      </div>

      {/* Folder Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate dark:text-white">
            {folderName}
          </h3>{" "}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {numberOfVideos} video{numberOfVideos !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {showConfirm && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 rounded-xl"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 dark:text-white">
              Are you sure that you want to delete <strong>{folderName}</strong>
              and all its content?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(false);
                  deleteFolder(folderId);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              >
                Delete
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
