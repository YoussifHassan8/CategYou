import SelectVideos from "./SelectVideos";
import PropTypes from "prop-types";
import NamingFolder from "./NamingFolder";
import { useState } from "react";
const CreateNewFolder = ({
  folders,
  setFolders,
  likedVideos,
  currentWindow,
  setCurrentWindow,
  sendVideo,
  setSendVideo,
}) => {
  const [folderName, setFolderName] = useState("");
  return (
    <>
      {currentWindow == 1 ? (
        <NamingFolder
          folderName={folderName}
          setFolderName={setFolderName}
          setCurrentWindow={setCurrentWindow}
        />
      ) : currentWindow == 2 ? (
        <SelectVideos
          folderName={folderName}
          folders={folders}
          setFolders={setFolders}
          likedVideos={likedVideos}
          setCurrentWindow={setCurrentWindow}
          sendVideo={sendVideo}
          setSendVideo={setSendVideo}
        />
      ) : (
        <div></div>
      )}
    </>
  );
};

CreateNewFolder.propTypes = {
  folders: PropTypes.object.isRequired,
  setFolders: PropTypes.number.isRequired,
  likedVideos: PropTypes.array.isRequired,
  currentWindow: PropTypes.number.isRequired,
  setCurrentWindow: PropTypes.func.isRequired,
  sendVideo: PropTypes.bool.isRequired,
  setSendVideo: PropTypes.func.isRequired,
};

export default CreateNewFolder;
