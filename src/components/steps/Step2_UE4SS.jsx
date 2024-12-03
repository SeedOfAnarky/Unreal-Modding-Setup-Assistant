import React, { useEffect, useState } from 'react';
import ProgressBar from '../common/ProgressBar';
import SuccessAnimation from '../common/SuccessAnimation';

const Step2_UE4SS = ({ gameInfo, stepStatus, setStepStatus, downloadProgress, setCurrentError }) => {
  const [ue4ssInstalled, setUe4ssInstalled] = useState(false);

  useEffect(() => {
    const checkUe4ssInstalled = async () => {
      if (gameInfo.directory) {
        const settingsPath = `${gameInfo.directory}\\UE4SS-settings.ini`;
        const installed = await window.electron.checkFileExists(settingsPath);
        setUe4ssInstalled(installed);
        setStepStatus(prev => ({ ...prev, ue4ssInstalled: installed }));
      }
    };
    checkUe4ssInstalled();
  }, [gameInfo.directory]);

  const downloadUE4SS = async () => {
    try {
      const url = 'https://github.com/UE4SS-RE/RE-UE4SS/releases/download/v3.0.1/zDEV-UE4SS_v3.0.1.zip';
      const downloadPath = await window.electron.downloadFile(url, 'UE4SS.zip', (progress) => {
        setDownloadProgress(progress);
      });
      
      if (gameInfo.directory) {
        await window.electron.extractZip(downloadPath, gameInfo.directory);
        setUe4ssInstalled(true);
        setStepStatus(prev => ({ ...prev, ue4ssInstalled: true }));
        setDownloadProgress(0);
        setCurrentError('');
      }
    } catch (error) {
      console.error('Download/extraction error:', error);
      setDownloadProgress(0);
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
        {!ue4ssInstalled ? (
          <>
            <button
              onClick={downloadUE4SS}
              disabled={!gameInfo.directory}
              className={`flex items-center space-x-2 px-4 py-2 rounded ${
                !gameInfo.directory ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {downloadProgress > 0 ? `Downloading... (${downloadProgress.toFixed(2)}%)` : 'Download UE4SS'}
            </button>
            {downloadProgress > 0 && <ProgressBar progress={downloadProgress} />}
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <SuccessAnimation className="w-6 h-6" />
              <span className="text-green-600">UE4SS installed</span>
            </div>
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