import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import Sort from "../components/Sort";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { Link, Outlet, useLocation } from "react-router-dom";

const LikedVideos = ({ accessToken, setAccessToken }) => {
  const [likedVideos, setLikedVideos] = useState(() => {
    const storedVideos = localStorage.getItem("likedVideos");
    return storedVideos ? JSON.parse(storedVideos) : [];
  });

  const location = useLocation();
  const isFolderView = location.pathname.includes("folders");

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
        <div className="flex flex-wrap gap-2">
          <Link
            to="/LikedVideos"
            className={`px-4 py-2 rounded-lg font-medium ${
              !isFolderView ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
          >
            Your liked videos
          </Link>
          <Link
            to="/LikedVideos/folders"
            className={`px-4 py-2 rounded-lg font-medium ${
              isFolderView ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
          >
            Your folders
          </Link>
        </div>
      </div>

      {isFolderView ? (
        <Outlet context={{ likedVideos }} />
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
