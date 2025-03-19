import { CgSortAz } from "react-icons/cg";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Sort = ({ likedVideos, setLikedVideos }) => {
  const [isOpen, setIsOpen] = useState(false);

  const originalOrder = useRef([]);

  useEffect(() => {
    if (likedVideos.length > 0 && originalOrder.current.length === 0) {
      originalOrder.current = [...likedVideos];
    }
  }, [likedVideos]);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const sortVideosByDateAdded = (order) => {
    const sortedVideos =
      order === "newest"
        ? [...originalOrder.current]
        : [...originalOrder.current].reverse();

    setLikedVideos(sortedVideos);
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
      className="relative flex gap-1 items-center cursor-pointer z-10"
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
