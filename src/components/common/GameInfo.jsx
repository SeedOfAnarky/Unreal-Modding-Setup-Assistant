// src/components/common/GameInfo.jsx
import React from 'react';
import SuccessAnimation from './SuccessAnimation';

const GameInfo = ({ executable, directory, version }) => {
  return (
    <div className="bg-gray-100 p-4 rounded space-y-2">
      <div className="space-y-1">
        <div className="flex items-center">
          <SuccessAnimation className="w-6 h-6 mr-2" />
          <p className="text-green-600 font-semibold">Game Detected</p>
        </div>
        <div className="ml-4 space-y-1">
          <p><span className="font-medium">Executable:</span> {executable}</p>
          <p><span className="font-medium">Location:</span> {directory}</p>
          <p><span className="font-medium">Version:</span> 
            {typeof version === 'object' ? version.version : version}
          </p>
          {typeof version === 'object' && version.productName && (
            <p><span className="font-medium">Product:</span> {version.productName}</p>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Note: You'll need this version number when configuring UAssetGUI later
        </div>
      </div>
    </div>
  );
};

export default GameInfo;