import { useState } from "react";
import NoFolders from "./NoFolders";

const Folders = () => {
  const [folders, SetFolders] = useState([]);

  return (
    <div>
      {!folders.length ? <NoFolders /> : <>YourFolders</>}
      <div></div>
    </div>
  );
};

export default Folders;
