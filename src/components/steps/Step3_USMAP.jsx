// src/components/steps/Step3_USMAP.jsx
import React from 'react';

const Step3_USMAP = ({ stepStatus, setStepStatus }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">3. Generate USMAP</h2>
      <div className="bg-gray-100 p-4 rounded space-y-2">
        <p>Once the game is launched:</p>
        <ol className="list-decimal ml-6 space-y-1">
          <li>Press Ctrl + Numpad 6 to dump the USMAP file</li>
          <li>Check your game directory for the generated file</li>
          <li>The file will be used in the next step</li>
        </ol>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={stepStatus.usmapGenerated}
          onChange={(e) => setStepStatus(prev => ({ 
            ...prev, 
            usmapGenerated: e.target.checked 
          }))}
          className="w-4 h-4"
        />
        <span>I have generated the USMAP file</span>
      </div>
    </div>
  );
};

export default Step3_USMAP;