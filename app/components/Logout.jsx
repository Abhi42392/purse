import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div className="absolute bottom-2 right-2">
      <button
        onClick={logout}
        className="bg-white py-1 px-4 cursor-pointer rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
