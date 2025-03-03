import { FaFolder } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

const Logo = () => {
  return (
    <div className="flex items-center justify-center relative text-[#FF0033] cursor-pointer animate-[bounce-twice_3s_infinite]">
      <FaFolder fontSize={40} />
      <FaPlay fontSize={12} className="absolute text-white" />
      <style>{`
        @keyframes bounce-twice {
          0%   { transform: scale(1,1)    translateY(0); }
        10%  { transform: scale(1.1,.9) translateY(0); }
        30%  { transform: scale(.9,1.1) translateY(-10px); }
        50%  { transform: scale(1,1)    translateY(0); }
        100% { transform: scale(1,1)    translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Logo;
