import React, { useContext } from "react";
import { Route, Navigate } from "react-router";
import { AuthContext } from "./AuthProvider";

const Private = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? children : <Navigate to="/signIn" />;
};

export default Private;
