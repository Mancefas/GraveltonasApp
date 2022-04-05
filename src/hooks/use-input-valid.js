import { useState } from "react";

const useInputValidation = (validateValue) => {
  const [userInput, setUserInput] = useState("");
  const [inputTouched, setInputTouched] = useState(false);

  const validInput = validateValue(userInput);
  const inputIsNotValid = !validInput && inputTouched;

  const userInputHandler = (event) => {
    setUserInput(event.target.value);
  };
  const userInputTouchedHandler = () => {
    setInputTouched(true);
  };

  const reset = () => {
    setUserInput("");
    setInputTouched(false);
  };
  return {
    value: userInput,
    valid: validInput,
    notValid: inputIsNotValid,
    userInputHandler,
    userInputTouchedHandler,
    reset,
  };
};

export default useInputValidation;
