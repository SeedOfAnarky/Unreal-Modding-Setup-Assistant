import React, { useState, useEffect } from 'react';
import Step1_GameDirectory from './steps/Step1_GameDirectory';
import Step2_UE4SS from './steps/Step2_UE4SS';
import Step3_USMAP from './steps/Step3_USMAP';
import Step4_UAssetGUI from './steps/Step4_UAssetGUI';
import StepProgress from './common/StepProgress';
import StepCard from './common/StepCard';
import { Card, CardContent } from "./ui/card";

const ModdingHelper = () => {
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

  useEffect(() => {
    if (window.electron) {
      window.electron.onDownloadProgress((progress) => {
        setDownloadProgress(progress);
      });
    }
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Unreal Modding Setup Assistant</h1>

      <div className="space-y-6">
        <StepCard number="1" title="Select Game Directory">
          <Step1_GameDirectory 
            gameInfo={gameInfo}
            setGameInfo={setGameInfo}
            stepStatus={stepStatus}
            setStepStatus={setStepStatus}
            setCurrentError={setCurrentError}
          />
        </StepCard>

        <StepCard number="2" title="Download and Setup UE4SS">
          <Step2_UE4SS 
            gameInfo={gameInfo}
            stepStatus={stepStatus}
            setStepStatus={setStepStatus}
            downloadProgress={downloadProgress}
            setCurrentError={setCurrentError}
          />
        </StepCard>

        <StepCard number="3" title="Generate USMAP">
          <Step3_USMAP 
            stepStatus={stepStatus}
            setStepStatus={setStepStatus}
          />
        </StepCard>

        <StepCard number="4" title="Setup UAssetGUI">
          <Step4_UAssetGUI 
            gameInfo={gameInfo}
            stepStatus={stepStatus}
            setStepStatus={setStepStatus}
            downloadProgress={downloadProgress}
            setDownloadProgress={setDownloadProgress}
          />
        </StepCard>

        {currentError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{currentError}</p>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 bg-gray-50">
          <CardContent className="pt-6">
            <StepProgress stepStatus={stepStatus} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModdingHelper;