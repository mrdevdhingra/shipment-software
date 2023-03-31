import React, { useRef, useEffect } from 'react';

const TrackingNumberInput = ({ value, onChange }) => {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      className="tracking-number"
      placeholder="Tracking number"
      value={value}
      onChange={onChange}
      required
    />
  );
};

export default TrackingNumberInput;
