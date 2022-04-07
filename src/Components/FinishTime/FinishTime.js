import React, { useState, useEffect, useContext } from "react";

import { Container, Box, Button, Alert, LinearProgress } from "@mui/material";

import config from "../../config.json";
import AuthContext from "../../store/auth-context";

import SelectButton from "../ChangesToRacer/SelectButton";
import msToHoursMinutesSeconds from "../../Helpers/Helpers";

const FinishTime = () => {
  const context = useContext(AuthContext);
  const [racerNR, setRacerNr] = useState();
  const [newTime, setNewTime] = useState();
  const [dataOfAllResults, setDataOfAllResults] = useState();
  const [dataWithNoFinishTime, setDataWithNoFinishTime] = useState();

  const [loadingMessage, setLoadingMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const racerNrHandler = (number) => {
    setRacerNr(number);
  };

  console.log(dataOfAllResults);

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
          startoLaikas: data[key].startoLaikas,
          dalyvis: data[key].startoNr,
          finish: data[key].finisoLaikas,
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

  // change finishing time on firebase database
  const addFinishTime = async () => {
    const finishTime = newTime.finisoLaikas;
    const raceTime = newTime.vaziavimoLaikas;
    const raceTimeInMS = newTime.vaziavimoLaikasMS;

    const racerToAddFinishTimeTo = dataOfAllResults.filter(
      (number) => number.dalyvis === racerNR
    );
    const firebaseIdOfRacer = racerToAddFinishTimeTo[0].id;
    loadingMessageHandler();

    try {
      const response = await fetch(
        `${config.API_URL_FOR_FINISHTIME}${firebaseIdOfRacer}.json?auth=${context.token}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            finisoLaikas: `${finishTime}`,
            vaziavimoLaikas: `${raceTime}`,
            vaziavimoLaikasMS: `${raceTimeInMS}`,
          }),
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
    addFinishTime();
    // eslint-disable-next-line
  }, [newTime]);

  // sort data to get only id that don't have race start time
  const getDataWithNoFinishTime = () => {
    const sort = dataOfAllResults.filter(
      (number) => number.finish === undefined && number.startoLaikas
    );
    setDataWithNoFinishTime(sort);
  };
  useEffect(() => {
    if (!dataOfAllResults) {
      return;
    }
    getDataWithNoFinishTime();
    // eslint-disable-next-line
  }, [dataOfAllResults]);

  // Get new finishing time from textfield
  const submitedHandler = (e) => {
    e.preventDefault();

    const raceFinish = new Date().getTime();
    const raceStartFromAPI = dataOfAllResults.filter(
      (number) => number.dalyvis === racerNR
    )[0].startoLaikas;
    const racingTimeInMilliseconds = raceFinish - raceStartFromAPI;
    const racingTimeInHMinSec = msToHoursMinutesSeconds(
      racingTimeInMilliseconds
    );

    const finishTime = {
      dalyvis: racerNR,
      finisoLaikas: `${raceFinish}`,
      vaziavimoLaikas: `${racingTimeInHMinSec}`,
      vaziavimoLaikasMS: `${racingTimeInMilliseconds}`,
    };
    setNewTime(finishTime);
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
            Dalyvis finišavo!
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
              raceData={dataWithNoFinishTime}
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
            Finišavo
          </Button>
        </form>
      </Container>
    </>
  );
};

export default FinishTime;
