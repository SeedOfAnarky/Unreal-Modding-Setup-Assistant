// src/components/ModdingHelper.jsx
import React, { useState, useEffect } from 'react';
import Step1_GameDirectory from './steps/Step1_GameDirectory';
import Step2_UE4SS from './steps/Step2_UE4SS';
import Step3_USMAP from './steps/Step3_USMAP';
import Step4_UAssetGUI from './steps/Step4_UAssetGUI';
import StepProgress from './common/StepProgress';

const ModdingHelper = () => {
  // Centralized state management
  const [gameInfo, setGameInfo] = useState({
    directory: '',
    executable: '',
    version: '',
  });

  const [stepStatus, setStepStatus] = useState({
    gameSelected: false,
    ue4ssInstalled: false,
    usmapGenerated: false,
    uassetGuiSetup: false,
  });

  const [currentError, setCurrentError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Effect for download progress listener
  useEffect(() => {
    if (window.electron) {
      window.electron.onDownloadProgress((progress) => {
        setDownloadProgress(progress);
      });
    }
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Unreal Modding Setup Assistant</h1>

      {/* Step Components */}
      <Step1_GameDirectory 
        gameInfo={gameInfo}
        setGameInfo={setGameInfo}
        stepStatus={stepStatus}
        setStepStatus={setStepStatus}
        setCurrentError={setCurrentError}
      />

      <Step2_UE4SS 
        gameInfo={gameInfo}
        stepStatus={stepStatus}
        setStepStatus={setStepStatus}
        downloadProgress={downloadProgress}
        setCurrentError={setCurrentError}
      />

      <Step3_USMAP 
        stepStatus={stepStatus}
        setStepStatus={setStepStatus}
      />

      <Step4_UAssetGUI 
        gameInfo={gameInfo}
        stepStatus={stepStatus}
        setStepStatus={setStepStatus}
      />

      {/* Error Display */}
      {currentError && (
        <div className="text-red-500 p-4 rounded bg-red-50">
          {currentError}
        </div>
      )}

      {/* Progress Overview */}
      <StepProgress stepStatus={stepStatus} />
    </div>
  );
};

export default ModdingHelper;