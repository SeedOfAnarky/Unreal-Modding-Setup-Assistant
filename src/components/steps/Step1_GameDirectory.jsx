// src/components/steps/Step1_GameDirectory.jsx
import React from 'react';
import GameInfo from '../common/GameInfo';

const Step1_GameDirectory = ({ gameInfo, setGameInfo, stepStatus, setStepStatus, setCurrentError }) => {
  const handleSelectDirectory = async () => {
    try {
      if (!window.electron) throw new Error('Electron API not available');
      const result = await window.electron.selectDirectory();
      if (result) await validateGameDirectory(result);
    } catch (error) {
      console.error('Directory selection error:', error);
      setCurrentError(`Failed to select directory: ${error.message}`);
    }
  };

  const validateGameDirectory = async (directoryPath) => {
    try {
      const files = await window.electron.readDirectory(directoryPath);
      const shippingExe = files.find(file => 
        file.toLowerCase().endsWith('.exe') && 
        file.includes('Shipping')
      );

      if (shippingExe) {
        const version = await getGameVersion(directoryPath, shippingExe);
        const gameData = {
          directory: directoryPath,
          executable: shippingExe,
          version: version
        };
        
        setGameInfo(gameData);
        await window.electron.storeGameInfo(gameData);
        setStepStatus(prev => ({ ...prev, gameSelected: true }));
        setCurrentError('');
      } else {
        setCurrentError('Please select the game directory containing the Shipping executable');
      }
    } catch (error) {
      console.error('Directory validation error:', error);
      setCurrentError('Error accessing directory');
    }
  };

  const getGameVersion = async (directoryPath, exeName) => {
    try {
      const fullPath = `${directoryPath}\\${exeName}`;
      const version = await window.electron.getExeVersion(fullPath);
      return version || 'Version not available';
    } catch (error) {
      console.error('Error getting game version:', error);
      return 'Version check failed';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">1. Select Game Directory</h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSelectDirectory}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Select Directory
        </button>
        <span className="text-gray-600">
          {gameInfo.directory || 'No directory selected'}
        </span>
      </div>

      {gameInfo.executable && (
        <GameInfo
          executable={gameInfo.executable}
          directory={gameInfo.directory}
          version={gameInfo.version}
        />
      )}
    </div>
  );
};

export default Step1_GameDirectory;