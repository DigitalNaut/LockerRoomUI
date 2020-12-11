import { useState } from "react";

export const useStringInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        setValue(event.target.value);
      },
    },
  };
};

export const useBoolInput = (initialValue) => {
  const [checked, setChecked] = useState(initialValue);

  return {
    checked,
    setChecked,
    reset: () => setChecked(false),
    bind: {
      checked,
      onChange: (event) => {
        setChecked(event.target.checked);
      },
    },
  };
};

export const useNullableInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(null),
    bind: {
      value,
      onChange: (event) => {
        setValue(event.target.value);
      },
    },
  };
};

// https://rangle.io/blog/simplifying-controlled-inputs-with-hooks/
