// src/components/common/SuccessAnimation.jsx
import React, { useRef } from 'react';
import Lottie from "lottie-react";
import successAnimation from '../../lotties/success.json';

const SuccessAnimation = ({ className = "w-6 h-6" }) => {
  const lottieRef = useRef();

  const handleAnimationComplete = () => {
    if (lottieRef.current) {
      const lastFrame = lottieRef.current.getDuration(true);
      lottieRef.current.goToAndStop(lastFrame, true);
    }
  };

  return (
    <div className={className}>
      <Lottie 
        lottieRef={lottieRef}
        animationData={successAnimation}
        loop={false}
        autoplay={true}
        onComplete={handleAnimationComplete}
      />
    </div>
  );
};

export default SuccessAnimation;