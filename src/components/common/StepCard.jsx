import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const StepCard = ({ number, title, children, className }) => {
  return (
    <Card className={`mb-6 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-8 h-8 text-sm bg-blue-500 text-white rounded-full">
            {number}
          </span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default StepCard;