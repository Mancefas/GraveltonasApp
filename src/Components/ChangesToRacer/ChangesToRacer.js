import React, { useState, useEffect, useContext } from "react";

import {
  Container,
  TextField,
  Box,
  Button,
  Alert,
  LinearProgress,
} from "@mui/material";

import config from "../../config.json";
import AuthContext from "../../store/auth-context";

import SelectButton from "./SelectButton";

const ChangesToRacer = () => {
  const context = useContext(AuthContext);
  const [racerNR, setRacerNr] = useState();
  const [newTime, setNewTime] = useState();
  const [dataOfAllResults, setDataOfAllResults] = useState();

  const [loadingMessage, setLoadingMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const racerNrHandler = (number) => {
    setRacerNr(number);
  };

  // functions to show only one message at the time
  const loadingMessageHandler = () => {
    setLoadingMessage(true);
    setSuccessMessage(false);
    setErrorMessage(false);
  };
  const sucessMessageHandler = () => {
    setLoadingMessage(false);
    setSuccessMessage(true);
    setErrorMessage(false);
  };
  const errorMessageHandler = (message) => {
    setLoadingMessage(false);
    setSuccessMessage(false);
    setErrorMessage(message);
  };

  //show success or error message only for few seconds
  useEffect(() => {
    setTimeout(() => {
      if (successMessage) {
        setSuccessMessage(false);
      }
      if (errorMessage) {
        setErrorMessage(false);
      }
    }, 2500);
    return () => {
      clearTimeout();
    };
  }, [successMessage, errorMessage]);

  // Get data of all racers
  const fetchindData = async () => {
    try {
      const response = await fetch(config.API_URL_RESULT);
      const data = await response.json();
      const dataToArrayOfObjects = [];
      for (const key in data) {
        dataToArrayOfObjects.push({
          id: key,
          startoLaikas: data[key].startoLaikas,
          finisoLaikas: data[key].finisoLaikas,
          vaziavimoLaikas: data[key].vaziavimoLaikas,
          dalyvis: data[key].dalyvis,
        });
      }
      setDataOfAllResults(dataToArrayOfObjects);
      if (response.ok) {
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      errorMessageHandler(error.message);
    }
  };

  useEffect(() => {
    fetchindData();
  }, []);

  // change finishing time on firebase database
  const replaceRaceTime = async () => {
    const changedTime = newTime.finisoLaikas;
    const racerForChanges = dataOfAllResults.filter(
      (number) => number.dalyvis === racerNR
    );
    const firebaseIdOfRacer = racerForChanges[0].id;
    loadingMessageHandler();

    try {
      const response = await fetch(
        `${config.API_URL_FOR_CHANGES}${firebaseIdOfRacer}.json?auth=${context.token}`,
        {
          method: "PATCH",
          body: JSON.stringify({ finisoLaikas: `${changedTime}` }),
        }
      );
      if (response.ok) {
        sucessMessageHandler();
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      errorMessageHandler(error.message);
    }
  };

  useEffect(() => {
    if (!newTime) {
      return;
    }
    replaceRaceTime();
    // eslint-disable-next-line
  }, [newTime]);

  // Get new finishing time from textfield
  const submitedHandler = (e) => {
    e.preventDefault();

    const newRaceTime = {
      dalyvis: racerNR,
      finisoLaikas: e.target.newTimeInput.value,
    };
    setNewTime(newRaceTime);

    e.target.newTimeInput.value = "";
  };

  const inputProps = {
    step: 1,
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        textAlign: "center",
        height: "fit-content",
      }}
    >
      {loadingMessage && (
        <LinearProgress sx={{ width: "50%", margin: "auto" }} />
      )}
      {successMessage && (
        <Alert
          severity="success"
          variant="outlined"
          sx={{ width: "fit-content", margin: "auto" }}
        >
          Laikas pakeistas!
        </Alert>
      )}
      {errorMessage && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{ width: "fit-content", margin: "auto" }}
        >
          Klaida! ({errorMessage})
        </Alert>
      )}
      <form onSubmit={submitedHandler}>
        <Box p={1}>
          <SelectButton
            raceData={dataOfAllResults}
            racerNrHandler={racerNrHandler}
            racerNR={racerNR}
            name="racerNumber"
          />
        </Box>
        <Box p={1}>
          <TextField
            label="Naujas finišo laikas"
            type="time"
            inputProps={inputProps}
            name="newTimeInput"
            sx={{ width: "70%" }}
          ></TextField>
        </Box>
        <Button
          disabled={racerNR === undefined ? true : false}
          p={1}
          type="submit"
          variant="contained"
        >
          Keisti
        </Button>
      </form>
    </Container>
  );
};

export default ChangesToRacer;
