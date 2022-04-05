import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const LogoutReminder = () => {
  const [showNotification10min, setShowNotification10min] = useState(false);
  const [showNotification5min, setShowNotification5min] = useState(false);
  const [showNotification1min, setShowNotification1min] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification10min(true);
    }, 3000000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification5min(true);
    }, 3300000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification1min(true);
    }, 3480000);
    return () => clearTimeout(timer);
  });

  return (
    <Box>
      {showNotification10min && (
        <Typography align="center" variant="h6" color={"green"}>
          You have to log in again in 10min
        </Typography>
      )}
      {showNotification5min && (
        <Typography align="center" variant="h6" color={"yellow"}>
          You have to log in again in 5min
        </Typography>
      )}
      {showNotification1min && (
        <Typography align="center" variant="h6" color={"red"}>
          You have to log in again in 1min
        </Typography>
      )}
    </Box>
  );
};

export default LogoutReminder;
