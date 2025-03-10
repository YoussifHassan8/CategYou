import { CgSortAz } from "react-icons/cg";
import { useState } from "react";
import PropTypes from "prop-types";

const Sort = ({ likedVideos, setLikedVideos }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const sortVideosByDateAdded = (order) => {
    const request = window.indexedDB.open("LikedVideosDB");

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("videos", "readonly");
      const store = transaction.objectStore("videos");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        let sortedVideos = getAllRequest.result;

        if (order === "newest")
          sortedVideos = sortedVideos.sort((a, b) => a.order - b.order);
        else sortedVideos = sortedVideos.sort((a, b) => b.order - a.order);

        setLikedVideos(sortedVideos);
      };

      getAllRequest.onerror = (event) => {
        console.error(
          "Error fetching videos from IndexedDB:",
          event.target.errorCode
        );
      };
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  };

  const sortVideosByDatePublished = (order) => {
    const sortedVideos = [...likedVideos].sort((a, b) => {
      const dateA = new Date(a.snippet.publishedAt);
      const dateB = new Date(b.snippet.publishedAt);
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });

    setLikedVideos(sortedVideos);
  };

  const sortVideosByViewCount = () => {
    const sortedVideos = [...likedVideos].sort(
      (a, b) => b.statistics.viewCount - a.statistics.viewCount
    );

    setLikedVideos(sortedVideos);
  };

  return (
    <button
      className="relative flex gap-1 items-center cursor-pointer"
      onClick={toggleDropdown}
    >
      <CgSortAz fontSize={32} />
      <p>Sort</p>
      {isOpen && (
        <ul className="space-y-2 rounded-lg dark:bg-[#212121] bg-white shadow-sm absolute w-[200px] top-8">
          <li
            onClick={() => sortVideosByDateAdded("newest")}
            className="cursor-pointer px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Date added (newest)
          </li>
          <li
            onClick={() => sortVideosByDateAdded("oldest")}
            className="cursor-pointer px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Date added (oldest)
          </li>
          <li
            onClick={sortVideosByViewCount}
            className="cursor-pointer px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Most popular
          </li>
          <li
            onClick={() => sortVideosByDatePublished("newest")}
            className="cursor-pointer px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Date published (newest)
          </li>
          <li
            onClick={() => sortVideosByDatePublished("oldest")}
            className="cursor-pointer px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Date published (oldest)
          </li>
        </ul>
      )}
    </button>
  );
};

Sort.propTypes = {
  likedVideos: PropTypes.array.isRequired,
  setLikedVideos: PropTypes.func.isRequired,
};

export default Sort;
