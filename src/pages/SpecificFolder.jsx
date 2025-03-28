import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import FolderNotFound from "../components/FolderNotFound";
import FolderCard from "../components/FolderCard";
import VideoCard from "../components/VideoCard";
import { IoMdAddCircleOutline } from "react-icons/io";
import CreateNewFolder from "../components/CreateNewFolder";
import { useState } from "react";

const SpecificFolder = () => {
  const { folders, setFolders, likedVideos, currentWindow, setCurrentWindow } =
    useOutletContext();
  const navigate = useNavigate();
  const { folderID } = useParams();
  const [sendVideo, setSendVideo] = useState(false);
  const isTheFolderFound = Object.hasOwn(folders, folderID);

  if (!isTheFolderFound) {
    return <FolderNotFound />;
  }

  let path = [];
  let current = folders[folderID];

  while (current && current.id !== "root") {
    path.unshift(current.name);
    current = folders[current.parentFolder];
  }

  const pathString = path.join("/");
  const currentFolder = folders[folderID];

  const matchingVideos = currentFolder.videos
    .map((videoId) => likedVideos.find((video) => video.id === videoId))
    .filter((video) => video !== undefined);

  const subFolders = currentFolder.subFolders
    .map((subFolderId) => folders[subFolderId])
    .filter((folder) => folder !== undefined);

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => {
            if (currentFolder.parentFolder === "root") {
              navigate("/liked-videos/folders");
            } else {
              navigate(`/liked-videos/folders/${currentFolder.parentFolder}`);
            }
          }}
          className="cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{pathString}</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 transition-all duration-300 shadow-sm text-white font-medium text-lg bg-[#FF0033] cursor-pointer hover:bg-[#E60030]"
            onClick={() => setCurrentWindow(1)}
          >
            <IoMdAddCircleOutline className="text-2xl" />
            Create new folder
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 transition-all duration-300 shadow-sm text-white font-medium text-lg bg-[#FF0033] cursor-pointer hover:bg-[#E60030]"
            onClick={() => {
              setCurrentWindow(2);
              setSendVideo(true);
            }}
          >
            <IoMdAddCircleOutline className="text-2xl" />
            Add new video
          </button>
        </div>
      </div>

      {(currentWindow === 1 || currentWindow === 2) && (
        <CreateNewFolder
          folders={folders}
          setFolders={setFolders}
          likedVideos={likedVideos}
          currentWindow={currentWindow}
          setCurrentWindow={setCurrentWindow}
          sendVideo={sendVideo}
          setSendVideo={setSendVideo}
        />
      )}

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-8">
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
            setFolders={setFolders}
          />
        ))}

        {matchingVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            icon={true}
            setFolders={setFolders}
            videoParent={currentFolder.id}
          />
        ))}
      </ul>
    </div>
  );
};

export default SpecificFolder;
