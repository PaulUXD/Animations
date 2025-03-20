'use client';

import { useState } from 'react';
import { Card } from "../../components/ui/card";
import { SplineScene } from "./splite";
import { CanvasAnimation } from "@/components/ui/canvas-animation";
import { Spotlight } from "@/components/ui/spotlight";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { ControlPanel, Slider, ColorPicker, CustomColorInput } from "@/components/ui/control-panel";

export function AuditAgentHero() {
  const [backgroundType, setBackgroundType] = useState<'canvas' | 'spotlight'>('canvas');
  
  // Spotlight controls
  const [spotlightSize, setSpotlightSize] = useState(600);
  const [spotlightColor, setSpotlightColor] = useState('white');
  
  // Ray lines controls
  const [rayLinesCount, setRayLinesCount] = useState(80);
  const [rayLinesWidth, setRayLinesWidth] = useState(10);
  const [rayLinesColor, setRayLinesColor] = useState('rainbow');
  const [rayLinesFollowDistance, setRayLinesFollowDistance] = useState(0.45);
  const [rayLinesTailLength, setRayLinesTailLength] = useState(50);
  const [rayLinesFadeSpeed, setRayLinesFadeSpeed] = useState(0.025);

  // Color options
  const colorOptions = ['white', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', 'rainbow'];

  // Add a new state for custom color
  const [useCustomSpotlightColor, setUseCustomSpotlightColor] = useState(false);
  const [customSpotlightColor, setCustomSpotlightColor] = useState('#ffffff');
  
  // Determine which color to use
  const effectiveSpotlightColor = useCustomSpotlightColor ? customSpotlightColor : spotlightColor;

  // Add this for debugging
  console.log("Effective spotlight color:", effectiveSpotlightColor);

  return (
    <Card className="w-full h-[600px] bg-black/[0.96] relative overflow-hidden">
      {/* Background animation toggle */}
      <div className="absolute top-4 right-4 z-20">
        <Toggle 
          options={[
            { label: 'Ray Lines', value: 'canvas' },
            { label: 'Spotlight', value: 'spotlight' }
          ]}
          defaultValue="canvas"
          onChange={(value) => setBackgroundType(value as 'canvas' | 'spotlight')}
        />
      </div>
      
      {/* Canvas animation background */}
      <div className="absolute inset-0 opacity-70" style={{ display: backgroundType === 'canvas' ? 'block' : 'none' }}>
        <CanvasAnimation 
          trailCount={rayLinesCount}
          lineWidth={rayLinesWidth}
          colorMode={rayLinesColor}
          followDistance={rayLinesFollowDistance}
          tailLength={rayLinesTailLength}
          fadeSpeed={rayLinesFadeSpeed}
        />
      </div>
      
      {/* Spotlight background */}
      {backgroundType === 'spotlight' && (
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          size={spotlightSize}
          forceVisible={true}
          color={effectiveSpotlightColor}
        />
      )}
      
      {/* Control panels */}
      {backgroundType === 'spotlight' && (
        <ControlPanel title="Spotlight Controls">
          <Slider 
            label="Size" 
            min={200} 
            max={1000} 
            value={spotlightSize} 
            onChange={setSpotlightSize} 
          />
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-white/70">Color Mode</label>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-2 py-1 text-xs rounded ${!useCustomSpotlightColor ? 'bg-white/20 text-white' : 'bg-transparent text-white/50'}`}
                onClick={() => setUseCustomSpotlightColor(false)}
              >
                Presets
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${useCustomSpotlightColor ? 'bg-white/20 text-white' : 'bg-transparent text-white/50'}`}
                onClick={() => setUseCustomSpotlightColor(true)}
              >
                Custom
              </button>
            </div>
          </div>
          
          {!useCustomSpotlightColor ? (
            <ColorPicker 
              label="Preset Colors" 
              value={spotlightColor} 
              onChange={setSpotlightColor} 
              options={colorOptions.filter(c => c !== 'rainbow')}
            />
          ) : (
            <CustomColorInput
              label="Custom Color"
              value={customSpotlightColor}
              onChange={setCustomSpotlightColor}
            />
          )}
        </ControlPanel>
      )}
      
      {backgroundType === 'canvas' && (
        <ControlPanel title="Ray Lines Controls">
          <Slider 
            label="Number of Lines" 
            min={20} 
            max={150} 
            value={rayLinesCount} 
            onChange={setRayLinesCount} 
          />
          <Slider 
            label="Line Width" 
            min={1} 
            max={20} 
            value={rayLinesWidth} 
            onChange={setRayLinesWidth} 
          />
          <ColorPicker 
            label="Color" 
            value={rayLinesColor} 
            onChange={setRayLinesColor} 
            options={colorOptions}
          />
          <Slider 
            label="Follow Distance" 
            min={0.1} 
            max={0.9} 
            step={0.05} 
            value={rayLinesFollowDistance} 
            onChange={setRayLinesFollowDistance} 
          />
          <Slider 
            label="Tail Length" 
            min={10} 
            max={100} 
            value={rayLinesTailLength} 
            onChange={setRayLinesTailLength} 
          />
          <Slider 
            label="Fade Speed" 
            min={0.005} 
            max={0.05} 
            step={0.005} 
            value={rayLinesFadeSpeed} 
            onChange={setRayLinesFadeSpeed} 
          />
        </ControlPanel>
      )}
      
      <div className="flex h-full relative z-10">
        {/* Left content */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h4 className="text-base font-bold py-4 flex">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
              AUDIT
            </span>
            <span className="text-white">
              AGENT
            </span>
          </h4>
          <h1 className="text-5xl md:text-6xl font-bold py-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Effortlessly Secure Code. Develop faster
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg text-lg">
            We help you detect vulnerabilities and mitigate risks in smart contracts, ensuring trust and security throughout your development process.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" variant="outline" className="text-white hover:text-white border-white/20 hover:bg-white/10">
              Launch App
            </Button>
          </div>
        </div>

        {/* Right content - could add an illustration or keep it minimal */}
        <div className="flex-1 hidden md:flex items-center justify-center relative">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
} 