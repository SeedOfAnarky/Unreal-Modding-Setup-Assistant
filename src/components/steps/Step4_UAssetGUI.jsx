// src/components/steps/Step4_UAssetGUI.jsx
import React from 'react';

const Step4_UAssetGUI = ({ gameInfo, stepStatus, setStepStatus }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">4. Setup UAssetGUI</h2>
      <button 
        onClick={() => window.open('https://github.com/trumank/UAssetGUI', '_blank')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Download UAssetGUI
      </button>
      <div className="bg-gray-100 p-4 rounded space-y-2">
        <p>After downloading:</p>
        <ol className="list-decimal ml-6 space-y-1">
          <li>Extract UAssetGUI to a location of your choice</li>
          <li>Open UAssetGUI and select your game version: {gameInfo.version}</li>
          <li>Attach the USMAP file you generated in step 3</li>
          <li>You can now explore and modify .pak game files</li>
        </ol>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={stepStatus.uassetGuiSetup}
          onChange={(e) => setStepStatus(prev => ({ 
            ...prev, 
            uassetGuiSetup: e.target.checked 
          }))}
          className="w-4 h-4"
        />
        <span>I have set up UAssetGUI with the USMAP file</span>
      </div>
    </div>
  );
};

export default Step4_UAssetGUI;