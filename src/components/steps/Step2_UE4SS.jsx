// src/components/steps/Step2_UE4SS.jsx
import React from 'react';
import ProgressBar from '../common/ProgressBar';

const Step2_UE4SS = ({ gameInfo, stepStatus, setStepStatus, downloadProgress, setCurrentError }) => {
  const downloadUE4SS = async () => {
    try {
      const url = 'https://github.com/UE4SS-RE/RE-UE4SS/releases/download/v3.0.1/zDEV-UE4SS_v3.0.1.zip';
      const downloadPath = await window.electron.downloadFile(url, 'UE4SS.zip');
      
      if (gameInfo.directory) {
        await window.electron.extractZip(downloadPath, gameInfo.directory);
        setStepStatus(prev => ({ ...prev, ue4ssInstalled: true }));
        setCurrentError('');
      }
    } catch (error) {
      console.error('Download/extraction error:', error);
      setCurrentError('Failed to download or extract UE4SS');
    }
  };

  const launchGame = async () => {
    try {
      await window.electron.launchExe(gameInfo.directory, gameInfo.executable);
    } catch (error) {
      console.error('Game launch error:', error);
      setCurrentError('Failed to launch game');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">2. Download and Setup UE4SS</h2>
      <div className="space-y-2">
        <button
          onClick={downloadUE4SS}
          disabled={!gameInfo.directory || stepStatus.ue4ssInstalled}
          className={`flex items-center space-x-2 px-4 py-2 rounded ${
            !gameInfo.directory || stepStatus.ue4ssInstalled 
              ? 'bg-gray-400' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {downloadProgress > 0 ? 'Downloading...' : 'Download UE4SS'}
        </button>

        {downloadProgress > 0 && !stepStatus.ue4ssInstalled && (
          <ProgressBar progress={downloadProgress} />
        )}

        {stepStatus.ue4ssInstalled && (
          <div className="space-y-2">
            <p className="text-green-600">✓ UE4SS installed successfully</p>
            <button
              onClick={launchGame}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Launch Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2_UE4SS;