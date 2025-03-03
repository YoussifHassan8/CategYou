import { useEffect } from "react";
import Logo from "../ui/Logo";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import PropTypes from "prop-types";
const NavBar = ({ mode, setMode }) => {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("mode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <nav className="flex items-center justify-between px-4 shadow-sm text-2xl h-16">
      <div className="flex items-center gap-1">
        <span className="font-bold font-poppins">CategYou</span>
        <Logo />
      </div>
      <div className="flex items-center gap-2 font-montserrat">
        <a
          href="https://github.com/YoussifHassan8/CategYou"
          target="_blank"
          rel="noopener noreferrer"
          className="relative dark:hover:text-yellow-400 transition-all duration-300 group"
        >
          about
        </a>
        {mode === "light" ? (
          <MdDarkMode
            className="cursor-pointer text-gray-800 transform transition-transform duration-200 hover:scale-[120%]"
            onClick={toggleTheme}
          />
        ) : (
          <MdOutlineLightMode
            className="cursor-pointer text-yellow-400 transform transition-transform duration-200 hover:scale-[120%]"
            onClick={toggleTheme}
          />
        )}
      </div>
    </nav>
  );
};
NavBar.propTypes = {
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
};
export default NavBar;
