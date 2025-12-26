import ResultsView from '../ResultsView';

export default function ResultsViewExample() {
  const placeholderStaged = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f3f4f6" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Inter" font-size="24" fill="%236b7280"%3EStaged Room Image%3C/text%3E%3C/svg%3E';

  const handleStartOver = () => {
    console.log('Start over clicked');
  };

  const handleGenerateAnother = () => {
    console.log('Generate another clicked');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <ResultsView
        stagedImageUrl={placeholderStaged}
        onStartOver={handleStartOver}
        onGenerateAnother={handleGenerateAnother}
      />
    </div>
  );
}
