import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import FolderNotFound from "../components/FolderNotFound";
import FolderCard from "../components/FolderCard";
import VideoCard from "../components/VideoCard";
import { IoMdAddCircleOutline } from "react-icons/io";
import CreateNewFolder from "../components/CreateNewFolder";

const FolderContent = () => {
  const { folders, setFolders, likedVideos, currentWindow, setCurrentWindow } =
    useOutletContext();
  const navigate = useNavigate();
  const { folderID } = useParams();

  const isTheFolderFound = Object.hasOwn(folders.folders, folderID);

  if (!isTheFolderFound) {
    return <FolderNotFound />;
  }

  const currentFolder = folders.folders[folderID];

  // Get the matching video objects from likedVideos
  const matchingVideos = currentFolder.videos
    .map((videoId) => likedVideos.find((video) => video.id === videoId))
    .filter((video) => video !== undefined);

  // Get the subfolder objects
  const subFolders = currentFolder.subFolders
    .map((subFolderId) => folders.folders[subFolderId])
    .filter((folder) => folder !== undefined);

  return (
    <div className="p-4">
      {/* Optional: Add breadcrumb navigation */}
      <div className="mb-4">
        <button
          onClick={() => {
            if (currentFolder.parentFolder === "root") {
              navigate("/LikedVideos/folders");
            } else {
              navigate(`/LikedVideos/folders/${currentFolder.parentFolder}`);
            }
          }}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{currentFolder.name}</h2>
        <button
          className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 transition-all duration-300 shadow-sm text-white font-medium text-lg bg-[#FF0033] cursor-pointer hover:bg-[#E60030]"
          onClick={() => setCurrentWindow(1)}
        >
          <IoMdAddCircleOutline className="text-2xl" />
          Create new folder
        </button>
      </div>

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
        {/* Render subfolders */}
        {subFolders.map((folder) => (
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
          />
        ))}

        {/* Render matching videos */}
        {matchingVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </ul>
    </div>
  );
};

export default FolderContent;
