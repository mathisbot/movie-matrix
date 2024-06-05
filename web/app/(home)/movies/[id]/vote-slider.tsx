import React from 'react';
import { useState } from 'react';

const VoteSlider = () => {
  const [value, setValue] = useState(5);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  }

  return (
    <div className="flex flex-row items-center space-x-4 h-full content-center justify-between w-[250px] mx-4">
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-black"
      />
      <div className="m-0 text-lg font-medium text-black text-center items-center content-center">
        {value}
      </div>
    </div>
  );
};

export default VoteSlider;
