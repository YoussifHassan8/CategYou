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
}) => {
  const [folderName, setFolderName] = useState("");
  console.log(currentWindow);
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
};

export default CreateNewFolder;
