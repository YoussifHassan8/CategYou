import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import HeaderSkeleton from "./HeaderSkeleton";

const Header = ({ accessToken, setAccessToken }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("likedVideos");
    localStorage.removeItem("user");
    setAccessToken(null);
    navigate("/");
  };

  useEffect(() => {
    if (user) return;

    (async () => {
      try {
        const userResponse = await fetch(
          "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );
        console.log("Request to fetch user's info");
        if (!userResponse.ok) throw new Error("Failed to fetch user info");

        const userData = await userResponse.json();
        if (userData.items.length === 0) return;

        const userInfo = {
          name: userData.items[0].snippet.title,
          bio: userData.items[0].snippet.description || "No bio available",
          profilePic: userData.items[0].snippet.thumbnails.high.url,
          subscribers: userData.items[0].statistics.subscriberCount,
        };

        const subscriptionsResponse = await fetch(
          "https://www.googleapis.com/youtube/v3/subscriptions?part=id&mine=true&maxResults=1",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );
        console.log("Request to fetch subscriptions count");
        if (!subscriptionsResponse.ok)
          throw new Error("Failed to fetch subscriptions");

        const subscriptionsData = await subscriptionsResponse.json();
        userInfo.subscriptions = subscriptionsData.pageInfo.totalResults;

        const likedVideosResponse = await fetch(
          "https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=LL",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );
        console.log(
          "Request to fetch number of videos in Liked Videos playlist"
        );
        if (!likedVideosResponse.ok)
          throw new Error("Failed to fetch liked videos count");

        const likedVideosData = await likedVideosResponse.json();
        userInfo.likedVideosCount =
          likedVideosData.items.length > 0
            ? likedVideosData.items[0].contentDetails.itemCount
            : 0;

        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    })();
  }, [accessToken, user]);

  return (
    <>
      {!user ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex my-6 items-center gap-3 max-sm:flex-col max-sm:justify-center max-sm:text-center">
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-[212px] h-[212px] rounded-full"
          />
          <div className="space-y-2 font-poppins">
            <h2 className="font-bold text-lg">{user.name}</h2>
            <button
              onClick={handleLogout}
              className="flex max-sm:mx-auto items-center justify-center gap-3 rounded-xl px-4 py-2 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-95 bg-[#FF0033] text-white font-medium text-lg"
            >
              <span>Logout</span>
            </button>
            <div className="flex flex-wrap gap-2 text-sm">
              <p>
                <strong>{user.subscribers}</strong> subscribers
              </p>
              <p>
                <strong>{user.subscriptions}</strong> subscriptions
              </p>
              <p>
                <strong>{user.likedVideosCount}</strong> liked videos
              </p>
            </div>
            <p className="text-sm text-gray-600">{user.bio}</p>
          </div>
        </div>
      )}
    </>
  );
};

Header.propTypes = {
  accessToken: PropTypes.string.isRequired,
  setAccessToken: PropTypes.func.isRequired,
};
export default Header;
