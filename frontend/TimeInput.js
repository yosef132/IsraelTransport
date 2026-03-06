// TimeInput.js
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';

const TimeInput = ({ label, value, onChangeText }) => {
  const [time, setTime] = useState(value);

  const handleChange = (text) => {
    if (/^\d{0,2}$/.test(text) || (/^\d{1,2}:\d{0,2}$/.test(text) && text.length <= 5)) {
      setTime(text);
      if (text.length === 5) {
        onChangeText(text);
      }
    }
  };

  return (
    <TextInput
      label={label}
      value={time}
      onChangeText={handleChange}
      keyboardType="numeric"
      style={{ marginBottom: 16 }}
    />
  );
};

export default TimeInput;
