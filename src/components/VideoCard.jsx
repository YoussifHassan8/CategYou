import PropTypes from "prop-types";

const VideoCard = ({ video }) => {
  return (
    <li className="rounded-lg overflow-hidden space-y-2">
      <a
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="w-full h-auto"
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
        />
      </a>
      <div className="space-y-2">
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="text-lg font-semibold">{video.snippet.title}</h3>
        </a>
        <div className="flex items-center gap-2">
          <a
            href={`https://www.youtube.com/channel/${video.snippet.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4"
          ></a>
          <a
            href={`https://www.youtube.com/channel/${video.snippet.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-sm text-[#6B6B6B]">
              {video.snippet.channelTitle}
            </span>
          </a>
        </div>
        <div className="text-sm text-gray-500">
          <p>
            {video.statistics
              ? Number(video.statistics.viewCount).toLocaleString()
              : "N/A"}{" "}
            views • {new Date(video.snippet.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </li>
  );
};

VideoCard.propTypes = {
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

export default VideoCard;
