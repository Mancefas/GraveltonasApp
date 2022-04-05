import React, { useContext } from "react";

import MainApp from "./Pages/MainApp";
import LogIn from "./Pages/LogIn";
import AuthContext from "./store/auth-context";

function App() {
  const context = useContext(AuthContext);
  return (
    <>
      {!context.loggedIn && <LogIn />}
      {context.loggedIn && <MainApp />}
    </>
  );
}

export default App;
