import React, { createContext, useState, useEffect } from "react";
import firebase from "firebase";
import { app } from "../../base";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  });
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
