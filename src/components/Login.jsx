import PropTypes from "prop-types";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = ({ setAccessToken }) => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      localStorage.setItem("accessToken", tokenResponse.access_token);
      setAccessToken(tokenResponse.access_token);
      navigate("/LikedVideos");
      console.log(tokenResponse);
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
    scope: "https://www.googleapis.com/auth/youtube",
  });

  return (
    <button
      onClick={() => login()}
      className="flex items-center gap-3 border border-gray-300 rounded-xl px-8 py-4 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-95"
    >
      <FcGoogle className="w-7 h-7" />
      <span className="font-medium text-lg">Continue with Google</span>
    </button>
  );
};

Login.propTypes = {
  setAccessToken: PropTypes.func.isRequired,
};

export default Login;
