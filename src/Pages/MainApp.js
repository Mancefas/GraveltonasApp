import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";

import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";

import ContactsIcon from "@mui/icons-material/Contacts";
import ConstructionIcon from "@mui/icons-material/Construction";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import SportsScoreIcon from "@mui/icons-material/SportsScore";

import FinishTime from "../Components/FinishTime/FinishTime";
import StartTime from "../Components/StartTime/StartTime";
import AddRacer from "../Components/AddRacer/AddRacer";
import ChangesToRacer from "../Components/ChangesToRacer/ChangesToRacer";
import LogOutBtn from "../Components/LogOutBtn";
import LogoutReminder from "../Components/LogoutReminder/LogoutReminder";

function MainApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    window.addEventListener("unload", leavingPageLogout);
    return () => {
      window.addEventListener("beforeunload", alertUser);
      window.removeEventListener("unload", leavingPageLogout);
    };
  }, []);

  const leavingPageLogout = () => {
    localStorage.clear();
  };

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const showStartTime = useSelector((state) => state.ui.showStartTimeComponent);
  const showStartTimeHandler = () => {
    dispatch(uiActions.showStart());
  };

  const showFinishTime = useSelector(
    (state) => state.ui.showFinishTimeComponent
  );
  const showFinRacerHandler = () => {
    dispatch(uiActions.showFinish());
  };

  const showAddRacer = useSelector((state) => state.ui.showAddRacerComponent);
  const showAddRacerHandler = () => {
    dispatch(uiActions.showAddRacer());
  };

  const showChangesToRacer = useSelector(
    (state) => state.ui.showChangesToRacerComponent
  );
  const showChangesToRacerHandler = () => {
    dispatch(uiActions.showChangesToRacer());
  };

  const [value, setValue] = React.useState(0);

  return (
    <>
      <LogOutBtn />
      <LogoutReminder />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          minHeight: "75vh",
          padding: "1rem",
        }}
      >
        {showStartTime && <StartTime />}
        {showFinishTime && <FinishTime />}
        {showAddRacer && <AddRacer />}
        {showChangesToRacer && <ChangesToRacer />}
      </Box>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Starto Laikas"
          icon={<DirectionsBikeIcon />}
          onClick={showStartTimeHandler}
        />
        <BottomNavigationAction
          label="Finišo laiką"
          icon={<SportsScoreIcon />}
          onClick={showFinRacerHandler}
        />
        <BottomNavigationAction
          label="Suvesti
             dalyvį"
          icon={<ContactsIcon />}
          onClick={showAddRacerHandler}
        />
        <BottomNavigationAction
          label="Taisyti dalyvio laiką"
          icon={<ConstructionIcon />}
          onClick={showChangesToRacerHandler}
        />
      </BottomNavigation>
    </>
  );
}

export default MainApp;
