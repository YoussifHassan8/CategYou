import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import Sort from "../components/Sort";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const LikedVideos = ({ accessToken, setAccessToken }) => {
  const [likedVideos, setLikedVideos] = useState([]);
  const location = useLocation();
  const isFolderView = location.pathname.includes("folders");
  const navigate = useNavigate();
  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      let allPlaylistItems = [];
      let nextPageToken = "";

      do {
        const playlistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=LL&maxResults=50${
            nextPageToken ? `&pageToken=${nextPageToken}` : ""
          }`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );

        if (!playlistResponse.ok) {
          if (playlistResponse.status === 401) {
            localStorage.removeItem("accessToken");
            setAccessToken(null);
            navigate("/");
            return;
          }
          throw new Error("Failed to fetch playlists");
        }

        const playlistData = await playlistResponse.json();
        allPlaylistItems = allPlaylistItems.concat(playlistData.items);
        nextPageToken = playlistData.nextPageToken || "";
      } while (nextPageToken);

      if (allPlaylistItems.length === 0) return;

      const videoIds = allPlaylistItems.map(
        (item) => item.snippet.resourceId.videoId
      );

      const chunkSize = 50;
      let allVideos = [];

      for (let i = 0; i < videoIds.length; i += chunkSize) {
        const chunkIds = videoIds.slice(i, i + chunkSize);

        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${chunkIds.join(
            ","
          )}&maxResults=${chunkSize}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );

        if (!videosResponse.ok) {
          throw new Error("Failed to fetch video details");
        }

        const videosData = await videosResponse.json();
        allVideos = allVideos.concat(videosData.items);
      }

      setLikedVideos(allVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };
  return (
    <section className="container">
      <Header accessToken={accessToken} setAccessToken={setAccessToken} />
      <div className="flex items-center justify-between mb-2">
        {!isFolderView && (
          <Sort likedVideos={likedVideos} setLikedVideos={setLikedVideos} />
        )}
        <div className="flex flex-wrap gap-2 ml-auto">
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
                <VideoCard key={video.id} video={video} icon={false} />
              ))
            : Array(6)
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
