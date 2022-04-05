import React, { useContext, useRef, useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material/";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AuthContext from "../store/auth-context";
import config from "../config.json";

const LogIn = () => {
  const context = useContext(AuthContext);

  const [error, setError] = useState(null);

  const emailRef = useRef();
  const passwordref = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordref.current.value;

    async function fetching(email, pass) {
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.API_KEY}`,
          {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: pass,
              returnSecureToken: true,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000
          );
          context.login(data.idToken, expirationTime, data.refreshToken);
        }
        if (!response.ok) {
          throw new Error(data.error.message);
        }
      } catch (error) {
        if (error.message === "EMAIL_NOT_FOUND") {
          setError("Nėra tokio el. pašto ");
        } else if (error.message === "INVALID_PASSWORD") {
          setError("Neteisingas slaptažodis");
        } else {
          setError(error.message);
        }
      }
    }
    fetching(enteredEmail, enteredPassword);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "80vh",
        padding: "1rem",
      }}
    >
      <Grid
        Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Grid item alignItems="center">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <VpnKeyIcon fontSize="large" />
          </Box>
          <Typography variant="h3">Prisijungti</Typography>
        </Grid>
        {error && (
          <Box>
            <Typography sx={{ fontColor: "red" }}>{error}</Typography>
          </Box>
        )}

        <Grid item xs={8}>
          <form onSubmit={submitHandler}>
            <div>
              <TextField
                label="prisijungimo el.paštas"
                variant="outlined"
                inputRef={emailRef}
              ></TextField>
            </div>
            <div>
              <TextField
                type="password"
                label="slaptažodis"
                variant="outlined"
                inputRef={passwordref}
              ></TextField>
            </div>
            <div>
              <Button variant="contained" type="submit">
                Prisijungti
              </Button>
            </div>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LogIn;
