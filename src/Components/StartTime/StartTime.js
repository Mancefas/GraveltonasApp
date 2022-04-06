import React, { useState, useEffect, useContext } from "react";

import { Container, Box, Button, Alert, LinearProgress } from "@mui/material";

import config from "../../config.json";
import AuthContext from "../../store/auth-context";

import SelectButton from "../ChangesToRacer/SelectButton";

const StartTime = () => {
  const context = useContext(AuthContext);
  const [racerNR, setRacerNr] = useState();
  const [newTime, setNewTime] = useState();
  const [dataOfAllResults, setDataOfAllResults] = useState();
  const [dataWithNoStartTime, setDataWithNoStartTime] = useState();

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
      const response = await fetch(config.API_URL_RACERS);
      const data = await response.json();
      const dataToArrayOfObjects = [];
      for (const key in data) {
        dataToArrayOfObjects.push({
          id: key,
          dalyvis: data[key].startoNr,
          start: data[key].startoLaikas,
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
    // eslint-disable-next-line
  }, []);

  // sort data to get only id that don't have race start time
  const getDataWithNoStartTime = () => {
    const sort = dataOfAllResults.filter(
      (number) => number.start === undefined
    );
    setDataWithNoStartTime(sort);
  };
  useEffect(() => {
    if (!dataOfAllResults) {
      return;
    }
    getDataWithNoStartTime();
    // eslint-disable-next-line
  }, [dataOfAllResults]);

  // add starting time on firebase database
  const addStartTimeToRacer = async () => {
    const startTime = newTime.startoLaikas;
    const racerToAddStartTimeTo = dataOfAllResults.filter(
      (number) => number.dalyvis === racerNR
    );
    const firebaseIdOfRacer = racerToAddStartTimeTo[0].id;
    loadingMessageHandler();

    try {
      const response = await fetch(
        `${config.API_URL_FOR_STARTTIME}${firebaseIdOfRacer}.json?auth=${context.token}`,
        {
          method: "PATCH",
          body: JSON.stringify({ startoLaikas: `${startTime}` }),
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
    addStartTimeToRacer();
    // eslint-disable-next-line
  }, [newTime]);

  // Get new finishing time from textfield
  const submitedHandler = (e) => {
    e.preventDefault();
    const raceStart = new Date().getTime();

    const newRaceTime = {
      dalyvis: racerNR,
      startoLaikas: `${raceStart}`,
    };
    setNewTime(newRaceTime);
  };

  return (
    <>
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
            Laikas paleistas!
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
              raceData={dataWithNoStartTime}
              racerNrHandler={racerNrHandler}
              racerNR={racerNR}
              name="racerNumber"
            />
          </Box>
          <Button
            disabled={racerNR === undefined ? true : false}
            p={1}
            type="submit"
            variant="contained"
          >
            Startas
          </Button>
        </form>
      </Container>
    </>
  );
};

export default StartTime;
