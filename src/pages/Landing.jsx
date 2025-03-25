import PropTypes from "prop-types";
import Branding from "../components/Branding";
import Info from "../components/Info";
import Login from "../components/Login";

const Landing = ({ setAccessToken }) => {
  return (
    <>
      <section className="container flex justify-between items-center px-4 py-12 gap-8 max-sm:flex-col">
        <Branding />
        <div className="flex flex-col gap-2">
          <Info />
          <div className="flex flex-col items-center">
            <Login setAccessToken={setAccessToken} />
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              We only request access to your YouTube account
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

Landing.propTypes = {
  setAccessToken: PropTypes.func.isRequired,
};

export default Landing;
