import { MdDelete } from "react-icons/md";
import PropTypes from "prop-types";
const DeleteWindow = ({
  folderName,
  setShowConfirm,
  deleteFolder,
  folderId,
}) => {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 rounded-xl">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/40 dark:border-gray-700/30 origin-center">
        <p className="mb-6 text-gray-600 dark:text-gray-300 text-center text-lg font-medium leading-relaxed">
          Delete{" "}
          <span className="text-red-500/95 font-semibold">{folderName}</span>
          ?<br />
          <span className="text-sm opacity-80">
            This action cannot be undone
          </span>
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(false);
            }}
            className="px-5 py-3 rounded-xl bg-gray-200/90 hover:bg-gray-300/80 dark:bg-gray-800 dark:hover:bg-gray-700 
                    transition-all duration-300 text-gray-700 dark:text-gray-200 flex-1 flex items-center justify-center gap-2
                    hover:-translate-y-0.5 shadow-sm hover:shadow-md"
          >
            <span>Cancel</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteFolder(folderId);
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 
                    transition-all duration-300 text-white flex-1 flex items-center justify-center gap-2
                    hover:-translate-y-0.5 shadow-red-500/30 hover:shadow-lg"
          >
            <MdDelete className="text-lg" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteWindow.propTypes = {
  folderName: PropTypes.string.isRequired,
  setShowConfirm: PropTypes.func.isRequired,
  deleteFolder: PropTypes.func.isRequired,
  folderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};
export default DeleteWindow;
