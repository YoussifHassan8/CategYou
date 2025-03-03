import React from "react";

const VideoCardTop = ({ videoId }) => {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="w-full h-auto"
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.title}
      />
    </a>
  );
};

export default VideoCardTop;
