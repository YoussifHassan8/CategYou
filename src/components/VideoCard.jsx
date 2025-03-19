import PropTypes from "prop-types";
import { MdDelete } from "react-icons/md";
import { useState } from "react";

const VideoCard = ({ video, icon, setFolders, videoParent }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteVideo = (videoId) => {
    setFolders((prev) => {
      const newFolders = { ...prev };
      const parentFolder = newFolders[videoParent];

      if (parentFolder) {
        parentFolder.videos = parentFolder.videos.filter(
          (id) => id !== videoId
        );

        const request = window.indexedDB.open("LikedVideosDB");
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction("folders", "readwrite");
          const store = transaction.objectStore("folders");

          store.put(parentFolder);

          transaction.oncomplete = () => {
            console.log("Video removed from folder in IndexedDB");
          };

          transaction.onerror = (event) => {
            console.error("Transaction error:", event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error("Database error:", event.target.error);
        };
      }

      return newFolders;
    });
  };

  return (
    <li className="relative group rounded-xl overflow-hidden mb-4 max-w-[340px] hover:shadow-lg transition-all duration-200 ease-out border-gray-200 dark:border-gray-700">
      {icon && (
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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
      )}
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="w-full h-auto"
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
        />
      </a>
      <div className="space-y-2">
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="text-lg font-semibold">{video.snippet.title}</h3>
        </a>
        <div className="flex items-center gap-2">
          <a
            href={`https://www.youtube.com/channel/${video.snippet.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4"
          ></a>
          <a
            href={`https://www.youtube.com/channel/${video.snippet.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-sm text-[#6B6B6B]">
              {video.snippet.channelTitle}
            </span>
          </a>
        </div>
        <div className="text-sm text-gray-500">
          <p>
            {video.statistics
              ? Number(video.statistics.viewCount).toLocaleString()
              : "N/A"}{" "}
            views • {new Date(video.snippet.publishedAt).toLocaleDateString()}
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
              Are you sure you want to delete this video?
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
                  deleteVideo(video.id);
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

VideoCard.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    snippet: PropTypes.shape({
      thumbnails: PropTypes.shape({
        medium: PropTypes.shape({
          url: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      title: PropTypes.string.isRequired,
      channelId: PropTypes.string.isRequired,
      channelTitle: PropTypes.string.isRequired,
      publishedAt: PropTypes.string.isRequired,
    }).isRequired,
    statistics: PropTypes.shape({
      viewCount: PropTypes.string,
    }),
  }).isRequired,
  icon: PropTypes.bool.isRequired,
  setFolders: PropTypes.func.isRequired,
  videoParent: PropTypes.string.isRequired,
};

export default VideoCard;
