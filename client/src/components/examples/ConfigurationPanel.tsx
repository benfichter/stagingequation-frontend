import ConfigurationPanel from "../ConfigurationPanel";
import { useState } from "react";
import { type DemoConfig } from "@/types/demo";

export default function ConfigurationPanelExample() {
  const [config, setConfig] = useState<DemoConfig>({});

  const handleSubmit = () => {
    console.log('Submitting config:', config);
  };

  return (
    <div className="p-8 max-w-md">
      <ConfigurationPanel
        config={config}
        onConfigChange={setConfig}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
