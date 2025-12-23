import React from 'react';

const ProgressIndicator = ({ currentStep }) => {
  const steps = ['Movie', 'Showtime', 'Seats', 'Details', 'Confirm'];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-2">
        {steps.map((label, idx) => (
          <React.Fragment key={label}>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                currentStep > idx + 1
                  ? 'bg-green-600'
                  : currentStep === idx + 1
                  ? 'bg-indigo-600'
                  : 'bg-gray-700'
              }`}
            >
              <span className="font-semibold">{idx + 1}</span>
              <span className="text-sm hidden sm:inline">{label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-8 h-0.5 bg-gray-600"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;