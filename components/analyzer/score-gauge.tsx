'use client';

import React, { useEffect, useState } from 'react';
import { RiskLevel } from '@/lib/types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Skull } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  confidence: 'high' | 'medium' | 'low';
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreGauge({ score, riskLevel, confidence, size = 'md' }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    const duration = 1200; // ms
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  // Dimension settings
  const dimensions = {
    sm: { radius: 45, stroke: 8, svgSize: 110, textSize: 'text-2xl', labelSize: 'text-xs' },
    md: { radius: 70, stroke: 12, svgSize: 170, textSize: 'text-4xl', labelSize: 'text-sm' },
    lg: { radius: 95, stroke: 16, svgSize: 230, textSize: 'text-5xl', labelSize: 'text-base' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Color config based on risk level
  const getColorConfig = () => {
    switch (riskLevel) {
      case 'critical':
        return {
          stroke: '#f43f5e', // rose-500
          track: '#4c0519', // rose-950
          glow: 'rgba(244, 63, 94, 0.4)',
          text: 'text-rose-400',
          label: 'Critical Risk',
          icon: Skull,
        };
      case 'high':
        return {
          stroke: '#f97316', // orange-500
          track: '#431407', // orange-950
          glow: 'rgba(249, 115, 22, 0.4)',
          text: 'text-orange-400',
          label: 'High Risk',
          icon: ShieldAlert,
        };
      case 'moderate':
        return {
          stroke: '#f59e0b', // amber-500
          track: '#451a03', // amber-950
          glow: 'rgba(245, 158, 11, 0.4)',
          text: 'text-amber-400',
          label: 'Moderate Risk',
          icon: AlertTriangle,
        };
      case 'low':
      default:
        return {
          stroke: '#10b981', // emerald-500
          track: '#022c22', // emerald-950
          glow: 'rgba(16, 185, 129, 0.4)',
          text: 'text-emerald-400',
          label: 'Low Risk',
          icon: ShieldCheck,
        };
    }
  };

  const config = getColorConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        <svg
          width={dimensions.svgSize}
          height={dimensions.svgSize}
          className="transform -rotate-90 filter"
          style={{ filter: `drop-shadow(0 0 12px ${config.glow})` }}
        >
          {/* Background Track Circle */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={dimensions.radius}
            stroke={config.track}
            strokeWidth={dimensions.stroke}
            fill="transparent"
            className="opacity-40"
          />
          {/* Animated Progress Circle */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={dimensions.radius}
            stroke={config.stroke}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Icon className={`w-6 h-6 mb-1 ${config.text}`} />
          <span className={`font-mono font-extrabold tracking-tight text-white ${dimensions.textSize}`}>
            {animatedScore}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            / 100 Score
          </span>
        </div>
      </div>

      {/* Label and Confidence rating */}
      <div className="mt-3 text-center">
        <span className={`inline-block font-semibold ${dimensions.labelSize} ${config.text}`}>
          {config.label}
        </span>
        <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-slate-400 font-mono">
          <span>Confidence:</span>
          <span className="uppercase text-cyan-300 font-medium">{confidence}</span>
        </div>
      </div>
    </div>
  );
}
