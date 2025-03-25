import PropTypes from "prop-types";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import DeleteWindow from "./DeleteWindow";
import { memo } from "react";
const VideoCard = memo(({ video, icon, setFolders, videoParent }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("type", "video");
    e.dataTransfer.setData("videoId", video.id);
    e.dataTransfer.setData("currentFolderId", videoParent);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("opacity-50");
  };

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
        };
      }
      return newFolders;
    });
  };
  return (
    <li
      className="relative group rounded-xl overflow-hidden mb-4 max-w-[340px] hover:shadow-lg transition-all duration-200 ease-out border-gray-200 dark:border-gray-700 cursor-grab"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {icon && (
        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="p-2.5 bg-red-500/95 hover:bg-red-600 rounded-xl backdrop-blur-lg text-white shadow-xl hover:shadow-red-500/30 transition-all hover:-translate-y-0.5"
            aria-label="Delete video"
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
      <div className="p-4 space-y-2">
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="text-lg font-semibold line-clamp-2">
            {video.snippet.title}
          </h3>
        </a>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>
            {video.statistics
              ? Number(video.statistics.viewCount).toLocaleString()
              : "N/A"}{" "}
            views • {new Date(video.snippet.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {showConfirm && (
        <DeleteWindow
          itemName={video.snippet.title}
          setShowConfirm={setShowConfirm}
          onDelete={() => deleteVideo(video.id)}
          itemType="video"
        />
      )}
    </li>
  );
});

VideoCard.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    snippet: PropTypes.shape({
      title: PropTypes.string.isRequired,
      thumbnails: PropTypes.shape({
        medium: PropTypes.shape({
          url: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
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

VideoCard.displayName = "VideoCard";
export default VideoCard;
