// src/components/common/StepProgress.jsx
import React from 'react';
import SuccessAnimation from './SuccessAnimation';

const StepProgress = ({ stepStatus }) => {
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded">
      <h3 className="text-lg font-semibold mb-3">Setup Progress</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {stepStatus.gameSelected ? (
            <SuccessAnimation className="w-5 h-5" />
          ) : (
            <span className="text-gray-400">○</span>
          )}
          <span className={stepStatus.gameSelected ? 'text-green-600' : 'text-gray-400'}>
            Game Directory Selected
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {stepStatus.ue4ssInstalled ? (
            <SuccessAnimation className="w-5 h-5" />
          ) : (
            <span className="text-gray-400">○</span>
          )}
          <span className={stepStatus.ue4ssInstalled ? 'text-green-600' : 'text-gray-400'}>
            UE4SS Installed
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {stepStatus.usmapGenerated ? (
            <SuccessAnimation className="w-5 h-5" />
          ) : (
            <span className="text-gray-400">○</span>
          )}
          <span className={stepStatus.usmapGenerated ? 'text-green-600' : 'text-gray-400'}>
            USMAP Generated
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {stepStatus.uassetGuiSetup ? (
            <SuccessAnimation className="w-5 h-5" />
          ) : (
            <span className="text-gray-400">○</span>
          )}
          <span className={stepStatus.uassetGuiSetup ? 'text-green-600' : 'text-gray-400'}>
            UAssetGUI Setup Complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;