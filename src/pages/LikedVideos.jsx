import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import Sort from "../components/Sort";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import { Link, Outlet, useLocation } from "react-router-dom";

const LikedVideos = ({ accessToken, setAccessToken }) => {
  const [likedVideos, setLikedVideos] = useState([]);
  const location = useLocation();
  const isFolderView = location.pathname.includes("folders");

  useEffect(() => {
    const request = window.indexedDB.open("LikedVideosDB");

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("videos", { keyPath: "id" });
      db.createObjectStore("folders", { keyPath: "id" });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("videos", "readonly");
      const store = transaction.objectStore("videos");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        if (getAllRequest.result.length > 0) {
          const sortedVideos = getAllRequest.result.sort(
            (a, b) => a.order - b.order
          );
          setLikedVideos(sortedVideos);
        } else {
          fetchLikedVideos(db);
        }
      };
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  }, [accessToken]);

  const fetchLikedVideos = async (db) => {
    try {
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

      if (!videosResponse.ok) {
        throw new Error("Failed to fetch video details");
      }

      const videosData = await videosResponse.json();

      videosData.items.forEach((video, index) => {
        video.order = index;
      });

      setLikedVideos(videosData.items);

      const transaction = db.transaction("videos", "readwrite");
      const store = transaction.objectStore("videos");

      videosData.items.forEach((video) => {
        store.put(video);
      });

      transaction.oncomplete = () => {
        console.log("All videos have been stored in the database.");
      };

      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.errorCode);
      };
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
