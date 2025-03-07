import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const FolderCard = ({ folderName, videoId, numberOfVideos, folderId }) => {
  const navigate = useNavigate();
  const handleFolderClick = () => {
    navigate(`/LikedVideos/folders/${folderId}`);
  };

  return (
    <li
      className="rounded-lg overflow-hidden mb-2 max-w-[340px] cursor-pointer hover:scale-105 transition-transform"
      onClick={handleFolderClick}
    >
      <div>
        <img
          src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
          alt="Video Thumbnail"
          className="w-full h-auto"
        />
        <div className="flex items center justify-between">
          <p>{folderName}</p> <p>{numberOfVideos} videos</p>
        </div>
      </div>
    </li>
  );
};

FolderCard.propTypes = {
  folderName: PropTypes.string.isRequired,
  videoId: PropTypes.string,
  numberOfVideos: PropTypes.number.isRequired,
  folderId: PropTypes.string.isRequired,
};

export default FolderCard;
