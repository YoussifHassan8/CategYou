import FolderCard from "./FolderCard";
import PropTypes from "prop-types";
import CreateNewFolder from "./CreateNewFolder";
import { IoMdAddCircleOutline } from "react-icons/io";

const YourFolders = ({
  folders,
  setFolders,
  likedVideos,
  currentWindow,
  setCurrentWindow,
}) => {
  console.log(folders);
  const rootFolderIds = folders.root.subFolders;
  const rootFolders = rootFolderIds.map((id) => folders[id]);
  return (
    <>
      <button
        className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 transition-all duration-300 shadow-sm text-white font-medium text-lg bg-[#FF0033] cursor-pointer hover:bg-[#E60030] ml-auto"
        onClick={() => setCurrentWindow(1)}
      >
        <IoMdAddCircleOutline className="text-2xl" />
        Create new folder
      </button>
      {(currentWindow === 1 || currentWindow === 2) && (
        <CreateNewFolder
          folders={folders}
          setFolders={setFolders}
          likedVideos={likedVideos}
          currentWindow={currentWindow}
          setCurrentWindow={setCurrentWindow}
        />
      )}
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-8">
        {rootFolders.map((folder) => (
          <FolderCard
            key={folder.id}
            folderName={folder.name}
            videoId={
              folder.videos.length > 0
                ? folder.videos[folder.videos.length - 1]
                : null
            }
            numberOfVideos={folder.videos.length}
            folderId={folder.id}
            setFolders={setFolders}
          />
        ))}
      </ul>
    </>
  );
};

YourFolders.propTypes = {
  folders: PropTypes.shape({
    root: PropTypes.shape({
      subFolders: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
  setFolders: PropTypes.func.isRequired,
  likedVideos: PropTypes.array.isRequired,
  currentWindow: PropTypes.number.isRequired,
  setCurrentWindow: PropTypes.func.isRequired,
};

export default YourFolders;
