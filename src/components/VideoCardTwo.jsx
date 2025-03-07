import PropTypes from "prop-types";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";

const VideoCardTwo = ({ video, isSelected, onToggleSelect }) => {
  return (
    <li
      className="relative rounded-lg overflow-hidden space-y-2"
      onClick={() => onToggleSelect(video.id)}
    >
      {!isSelected ? (
        <IoIosCheckmarkCircleOutline
          className="absolute top-[30px] left-[8px]"
          fontSize={30}
        />
      ) : (
        <IoIosCheckmarkCircle
          className="absolute top-[30px] left-[8px]"
          fontSize={30}
        />
      )}
      <img
        className="w-full h-auto cursor-pointer"
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.title}
      />
      <h3 className="text-lg font-semibold cursor-pointer">
        {video.snippet.title}
      </h3>
    </li>
  );
};

VideoCardTwo.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  video: PropTypes.shape({
    id: PropTypes.string.isRequired,
    snippet: PropTypes.shape({
      thumbnails: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      channelId: PropTypes.string.isRequired,
      channelTitle: PropTypes.string.isRequired,
      publishedAt: PropTypes.string.isRequired,
    }).isRequired,
    statistics: PropTypes.shape({
      viewCount: PropTypes.string,
    }),
  }).isRequired,
};

export default VideoCardTwo;
