// src/components/common/StepProgress.jsx
import React from 'react';

const StepProgress = ({ stepStatus }) => {
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded">
      <h3 className="text-lg font-semibold mb-3">Setup Progress</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className={stepStatus.gameSelected ? 'text-green-600' : 'text-gray-400'}>
            {stepStatus.gameSelected ? '✓' : '○'} Game Directory Selected
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={stepStatus.ue4ssInstalled ? 'text-green-600' : 'text-gray-400'}>
            {stepStatus.ue4ssInstalled ? '✓' : '○'} UE4SS Installed
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={stepStatus.usmapGenerated ? 'text-green-600' : 'text-gray-400'}>
            {stepStatus.usmapGenerated ? '✓' : '○'} USMAP Generated
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={stepStatus.uassetGuiSetup ? 'text-green-600' : 'text-gray-400'}>
            {stepStatus.uassetGuiSetup ? '✓' : '○'} UAssetGUI Setup Complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;