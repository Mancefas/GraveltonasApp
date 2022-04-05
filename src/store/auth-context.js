import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  loggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  // const [refreshToken, setRefreshToken] = useState();

  const userIsLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    localStorage.clear();
  };

  const loginHandler = (token, expirationTime, refreshToken) => {
    setToken(token);
    localStorage.setItem("token", token);
    const remainingTime = calculateRemainingTime(expirationTime);
    setTimeout(logoutHandler, remainingTime);
    // localStorage.setItem("refreshToken", refreshToken);
    // setRefreshToken(refreshToken);
  };

  // Refresh function needed to leave a user logged in all the time
  // const refreshLogInHandler = () => {
  //   setToken(refreshToken);
  //   // localStorage.removeItem("token");
  //   // localStorage.setItem("refreshtoken", refreshToken);
  // };
  const ContextValue = {
    token: token,
    loggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={ContextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
