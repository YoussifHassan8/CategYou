import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import Sort from "../components/Sort";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import Folders from "../components/Folders";
const LikedVideos = ({ accessToken, setAccessToken }) => {
  const [likedVideos, setLikedVideos] = useState(() => {
    const storedVideos = localStorage.getItem("likedVideos");
    return storedVideos ? JSON.parse(storedVideos) : [];
  });

  const [isFolder, setIsFolder] = useState(false);

  useEffect(() => {
    if (likedVideos.length > 0) return;

    (async () => {
      try {
        console.log("Request to fetch the liked videos");

        const playlistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=LL&maxResults=50`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );

        if (!playlistResponse.ok) {
          throw new Error("Failed to fetch playlists");
        }

        const playlistData = await playlistResponse.json();

        if (!playlistData.items || playlistData.items.length === 0) return;

        // Extract video IDs from the playlist items
        const videoIds = playlistData.items
          .map((item) => item.snippet.resourceId.videoId)
          .join(",");

        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&maxResults=50`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );

        console.log("Request to fetch video details");
        if (!videosResponse.ok) {
          throw new Error("Failed to fetch video details");
        }

        const videosData = await videosResponse.json();
        localStorage.setItem("likedVideos", JSON.stringify(videosData.items));
        setLikedVideos(videosData.items);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    })();
  }, [accessToken, likedVideos]);

  return (
    <section className="container">
      <Header accessToken={accessToken} setAccessToken={setAccessToken} />
      <div className="flex items-center justify-between mb-2">
        <Sort likedVideos={likedVideos} setLikedVideos={setLikedVideos} />
        <div>
          <button
            onClick={() => setIsFolder(false)}
            className={`px-4 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md active:scale-95 ${
              !isFolder ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
          >
            Your liked videos
          </button>
          <button
            onClick={() => setIsFolder(true)}
            className={`px-4 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md active:scale-95 ${
              isFolder ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
          >
            Your folders
          </button>
        </div>
      </div>
      {isFolder ? (
        <Folders />
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-8">
          {likedVideos.length > 0
            ? likedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            : Array(8)
                .fill()
                .map((_, index) => <VideoCardSkeleton key={index} />)}
        </ul>
      )}
    </section>
  );
};

LikedVideos.propTypes = {
  accessToken: PropTypes.string.isRequired,
  setAccessToken: PropTypes.func.isRequired,
};

export default LikedVideos;
