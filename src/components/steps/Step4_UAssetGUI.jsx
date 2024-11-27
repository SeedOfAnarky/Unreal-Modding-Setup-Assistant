import React, { useState, useEffect } from 'react';
import ProgressBar from '../common/ProgressBar';

const Step4_UAssetGUI = ({ gameInfo, stepStatus, setStepStatus, downloadProgress, setDownloadProgress }) => {
  const [uassetGuiInstalled, setUassetGuiInstalled] = useState(false);

  useEffect(() => {
    const checkUAssetGUIInstalled = async () => {
      if (gameInfo.directory) {
        const guiPath = `${gameInfo.directory}\\UAssetGUI.exe`;
        const installed = await window.electron.checkFileExists(guiPath);
        setUassetGuiInstalled(installed);
      }
    };
    checkUAssetGUIInstalled();
  }, [gameInfo.directory]);

  const downloadUAssetGUI = async () => {
    try {
      await window.electron.downloadUAssetGUI(gameInfo.directory);
      setDownloadProgress(0);
      setUassetGuiInstalled(true);
    } catch (error) {
      console.error('UAssetGUI download error:', error);
    }
  };

  const openDirectory = () => {
    window.electron.openDirectory(gameInfo.directory);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">4. Setup UAssetGUI</h2>
      <div className="space-x-4">
        {!uassetGuiInstalled ? (
          <>
            <button 
              onClick={downloadUAssetGUI}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {downloadProgress > 0 ? 'Downloading...' : 'Download UAssetGUI'}
            </button>
            {downloadProgress > 0 && <ProgressBar progress={downloadProgress} />}
          </>
        ) : (
          <p className="text-green-600">✓ UAssetGUI installed</p>
        )}
        <button 
          onClick={openDirectory}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Open Directory
        </button>
      </div>
      <div className="bg-gray-100 p-4 rounded space-y-2">
        <p>After downloading:</p>
        <ol className="list-decimal ml-6 space-y-1">
          <li>
            Open UAssetGUI and select your game version:
            <ul className="ml-4 list-disc">
              <li>Version: {gameInfo.version.version}</li>
              <li>Description: {gameInfo.version.description}</li>
              <li>Product Name: {gameInfo.version.productName}</li>
            </ul>
          </li>
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