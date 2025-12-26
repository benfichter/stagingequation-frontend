import ProgressStepper from '../ProgressStepper';

export default function ProgressStepperExample() {
  const steps = [
    { id: 1, label: 'Upload' },
    { id: 2, label: 'Configure' },
    { id: 3, label: 'Calibrate' },
    { id: 4, label: 'Results' }
  ];

  return <ProgressStepper currentStep={2} steps={steps} />;
}
