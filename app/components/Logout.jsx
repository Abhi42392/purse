import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div className="">
      <button
        onClick={logout}
        className="bg-white text-black cursor-pointer rounded-md sm:px-4 sm:py-2 py-1 px-2"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
