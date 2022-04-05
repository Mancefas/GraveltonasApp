import * as React from "react";
import { OutlinedInput, MenuItem, Select } from "@mui/material/";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SelectButton = (props) => {
  const [racerNumber, setRacerNumber] = React.useState([]);

  const handleChange = (event) => {
    props.racerNrHandler(+event.target.value.toString());
    setRacerNumber(
      // On autofill we get a stringified value.
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    );
  };

  return (
    <div>
      {props.raceData && (
        <Select
          multiple
          displayEmpty
          value={racerNumber}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Dalyvio nr</em>;
            }

            return selected.join(", ");
          }}
          MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled value="">
            <em>Dalyvio nr</em>
          </MenuItem>
          {props.raceData.map((racerData) => (
            <MenuItem key={racerData} value={racerData.dalyvis}>
              {racerData.dalyvis}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
};

export default SelectButton;
