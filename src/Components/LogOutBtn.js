import React, { useContext } from "react";
import AuthContext from "../store/auth-context";
import { Button, Container } from "@mui/material/";

const LogOutBtn = () => {
  const context = useContext(AuthContext);
  const logoutHandler = () => {
    context.logout();
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center" }}>
      <Button onClick={logoutHandler}>Atsijungti</Button>
    </Container>
  );
};

export default LogOutBtn;
