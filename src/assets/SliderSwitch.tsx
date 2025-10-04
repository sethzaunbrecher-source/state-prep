import { useState } from 'react';

interface MyProps{
    isNational:boolean,
    handleToggle:React.ChangeEventHandler<HTMLInputElement>
}

const SliderSwitch = ({isNational, handleToggle}:MyProps) => {


  return (
    <label className="flex items-center cursor-pointer">
      {/* Hidden checkbox input */}
      <input
        type="checkbox"
        className="sr-only" // Visually hide the checkbox
        checked={isNational}
        onChange={handleToggle}
      />

      {/* Switch track */}
      <div
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
          isNational ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        {/* Switch thumb */}
        <div
          className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
            isNational ? 'translate-x-full' : 'translate-x-0'
          }`}
        ></div>
      </div>
      <span className="ml-3 text-gray-700">{isNational?'National':'State'}</span>
    </label>
  );
};

export default SliderSwitch;