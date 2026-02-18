"use client"

import { useState, useEffect } from 'react';

const styles = `
  :root {
    --primary-dark: #0f172a;
    --primary-mid: #1e293b;
    --primary-light: #334155;
    --accent-cyan: #06b6d4;
    --accent-blue: #3b82f6;
    --accent-purple: #8b5cf6;
    --accent-pink: #ec4899;
    --accent-orange: #f97316;
    --accent-green: #10b981;
    --accent-yellow: #eab308;
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
    --shadow-color: rgba(0, 0, 0, 0.3);
  }

  * {
    box-sizing: border-box;
  }

  .bunker-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    overflow-x: hidden;
  }

  /* Animated background */
  .bunker-container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }

  .header {
    position: relative;
    z-index: 10;
    text-align: center;
    padding: 32px 16px;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, transparent 100%);
    border-bottom: 1px solid rgba(6, 182, 212, 0.2);
  }
  
  .header h1 {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  
  .header p {
    color: rgba(148, 163, 184, 0.9);
    margin: 8px 0;
    font-size: 14px;
    letter-spacing: 3px;
  }
  
  .header .subtitle {
    font-size: 11px;
    color: rgba(236, 72, 153, 0.8);
    letter-spacing: 4px;
  }

  .main-container {
    position: relative;
    z-index: 1;
    margin: 0 auto;
    width: 100%;
    max-width: 1200px;
    height: 1400px;
    padding: 40px 20px;
  }

  /* Level containers with depth */
  .level-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .level-visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  
  .level-hidden {
    opacity: 0;
    transform: translateX(-50%) translateY(40px);
  }

  /* Level labels */
  .level-label {
    position: absolute;
    left: -160px;
    top: 50%;
    transform: translateY(-50%);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    color: rgba(148, 163, 184, 0.6);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 12px 8px;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(6, 182, 212, 0.2);
    border-radius: 4px;
  }

  /* Section base styles */
  .section-container {
    position: absolute;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4));
  }

  .section-container:hover {
    transform: translateY(-8px) scale(1.02);
    z-index: 100;
    filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5));
  }

  .section-container.selected {
    transform: translateY(-12px) scale(1.05);
    z-index: 150;
  }

  /* Section inner wrapper */
  .section-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  /* Glass effect overlay */
  .section-glass {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
    pointer-events: none;
    border-radius: 12px 12px 0 0;
  }

  /* Section header */
  .section-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
    z-index: 10;
  }

  .section-id {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    opacity: 0.9;
  }

  .section-name {
    font-size: 11px;
    color: rgba(148, 163, 184, 0.8);
    margin-top: 2px;
  }

  /* Section dimensions */
  .section-dimensions {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    color: rgba(148, 163, 184, 0.6);
    letter-spacing: 1px;
    background: rgba(0, 0, 0, 0.4);
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
  }

  /* Interior details */
  .section-interior {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 60%;
    border: 1px dashed rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Shape-specific styles */
  
  /* Circular shape */
  .shape-circular .section-inner {
    border-radius: 50%;
  }
  
  .shape-circular .section-glass {
    border-radius: 50% 50% 0 0;
    height: 30%;
  }

  .shape-circular .section-interior {
    border-radius: 50%;
    width: 60%;
    height: 60%;
  }

  .shape-circular .interior-icon {
    font-size: 28px;
  }

  /* Hexagonal shape */
  .shape-hexagonal .section-inner {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    border-radius: 0;
  }

  .shape-hexagonal .section-glass {
    height: 50%;
    clip-path: polygon(50% 0%, 100% 25%, 100% 50%, 0% 50%, 0% 25%);
  }

  .shape-hexagonal .section-interior {
    width: 50%;
    height: 50%;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }

  /* Octagonal shape */
  .shape-octagonal .section-inner {
    clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
    border-radius: 0;
  }

  /* L-shaped */
  .shape-l-shaped .section-inner {
    clip-path: polygon(0% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 100%, 0% 100%);
    border-radius: 0;
  }

  /* T-shaped */
  .shape-t-shaped .section-inner {
    clip-path: polygon(0% 0%, 100% 0%, 100% 40%, 65% 40%, 65% 100%, 35% 100%, 35% 40%, 0% 40%);
    border-radius: 0;
  }

  /* Diamond shape */
  .shape-diamond .section-inner {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    border-radius: 0;
  }

  /* Pentagon shape */
  .shape-pentagon .section-inner {
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
    border-radius: 0;
  }

  /* Rounded rectangle (default but enhanced) */
  .shape-rounded .section-inner {
    border-radius: 20px;
  }

  /* Pill shape */
  .shape-pill .section-inner {
    border-radius: 100px;
  }

  /* Trapezoid shape */
  .shape-trapezoid .section-inner {
    clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
    border-radius: 0;
  }

  /* Cross shape */
  .shape-cross .section-inner {
    clip-path: polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%);
    border-radius: 0;
  }

  /* Star shape */
  .shape-star .section-inner {
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    border-radius: 0;
  }

  /* Interior icons */
  .interior-icon {
    font-size: 24px;
    opacity: 0.7;
  }

  /* Animated pulse for active sections */
  .section-pulse {
    position: absolute;
    inset: -4px;
    border-radius: inherit;
    border: 2px solid;
    opacity: 0;
    animation: pulse-border 2s infinite;
  }

  @keyframes pulse-border {
    0% { opacity: 0; transform: scale(0.95); }
    50% { opacity: 0.6; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.05); }
  }

  .section-container:hover .section-pulse {
    animation: pulse-border 1s infinite;
  }

  /* Color themes */
  .theme-cyan { --theme-color: #06b6d4; --theme-glow: rgba(6, 182, 212, 0.3); }
  .theme-blue { --theme-color: #3b82f6; --theme-glow: rgba(59, 130, 246, 0.3); }
  .theme-purple { --theme-color: #8b5cf6; --theme-glow: rgba(139, 92, 246, 0.3); }
  .theme-pink { --theme-color: #ec4899; --theme-glow: rgba(236, 72, 153, 0.3); }
  .theme-orange { --theme-color: #f97316; --theme-glow: rgba(249, 115, 22, 0.3); }
  .theme-green { --theme-color: #10b981; --theme-glow: rgba(16, 185, 129, 0.3); }
  .theme-yellow { --theme-color: #eab308; --theme-glow: rgba(234, 179, 8, 0.3); }
  .theme-red { --theme-color: #ef4444; --theme-glow: rgba(239, 68, 68, 0.3); }

  .theme-cyan .section-inner { border-color: rgba(6, 182, 212, 0.4); }
  .theme-blue .section-inner { border-color: rgba(59, 130, 246, 0.4); }
  .theme-purple .section-inner { border-color: rgba(139, 92, 246, 0.4); }
  .theme-pink .section-inner { border-color: rgba(236, 72, 153, 0.4); }
  .theme-orange .section-inner { border-color: rgba(249, 115, 22, 0.4); }
  .theme-green .section-inner { border-color: rgba(16, 185, 129, 0.4); }
  .theme-yellow .section-inner { border-color: rgba(234, 179, 8, 0.4); }
  .theme-red .section-inner { border-color: rgba(239, 68, 68, 0.4); }

  .theme-cyan .section-id { color: #06b6d4; }
  .theme-blue .section-id { color: #3b82f6; }
  .theme-purple .section-id { color: #8b5cf6; }
  .theme-pink .section-id { color: #ec4899; }
  .theme-orange .section-id { color: #f97316; }
  .theme-green .section-id { color: #10b981; }
  .theme-yellow .section-id { color: #eab308; }
  .theme-red .section-id { color: #ef4444; }

  .theme-cyan .section-pulse { border-color: #06b6d4; }
  .theme-blue .section-pulse { border-color: #3b82f6; }
  .theme-purple .section-pulse { border-color: #8b5cf6; }
  .theme-pink .section-pulse { border-color: #ec4899; }
  .theme-orange .section-pulse { border-color: #f97316; }
  .theme-green .section-pulse { border-color: #10b981; }
  .theme-yellow .section-pulse { border-color: #eab308; }
  .theme-red .section-pulse { border-color: #ef4444; }

  /* Glow effect on hover */
  .section-container:hover .section-inner {
    box-shadow: 0 0 40px var(--theme-glow), inset 0 0 30px var(--theme-glow);
  }

  /* Grid pattern inside sections */
  .interior-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 4px;
    width: 80%;
    height: 70%;
  }

  .interior-grid-cell {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
  }

  /* Circle detail for elevators */
  .interior-circle {
    width: 50%;
    height: 50%;
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    position: relative;
  }

  .interior-circle::before {
    content: '';
    position: absolute;
    inset: 25%;
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  /* Stairs detail */
  .interior-stairs {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 60%;
    height: 70%;
  }

  .stair-step {
    flex: 1;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 2px;
  }

  /* Equipment detail */
  .interior-equipment {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 6px;
    width: 75%;
    height: 70%;
  }

  .equipment-item {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: rgba(148, 163, 184, 0.5);
  }

  /* Connector lines */
  .connector-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  .connector-line {
    stroke: rgba(6, 182, 212, 0.15);
    stroke-width: 1;
    stroke-dasharray: 8 4;
    fill: none;
  }

  .connector-line-main {
    stroke: rgba(6, 182, 212, 0.25);
    stroke-width: 2;
  }

  /* Compass */
  .compass {
    position: absolute;
    bottom: 30px;
    left: 30px;
    width: 90px;
    height: 90px;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    backdrop-filter: blur(10px);
  }

  .compass-inner {
    width: 70px;
    height: 70px;
    position: relative;
  }

  .compass-ring {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(6, 182, 212, 0.4);
    border-radius: 50%;
  }

  .compass-needle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center;
  }

  .compass-needle-north {
    width: 3px;
    height: 28px;
    background: linear-gradient(180deg, #06b6d4, transparent);
    transform: translate(-50%, -100%);
    border-radius: 2px;
  }

  .compass-needle-south {
    width: 2px;
    height: 18px;
    background: rgba(148, 163, 184, 0.4);
    transform: translate(-50%, 0);
    border-radius: 2px;
  }

  .compass-label {
    position: absolute;
    font-size: 10px;
    font-weight: 600;
    color: rgba(148, 163, 184, 0.8);
  }

  .compass-n { top: 2px; left: 50%; transform: translateX(-50%); color: #06b6d4; }
  .compass-e { right: 2px; top: 50%; transform: translateY(-50%); }
  .compass-s { bottom: 2px; left: 50%; transform: translateX(-50%); }
  .compass-w { left: 2px; top: 50%; transform: translateY(-50%); }

  /* References panel */
  .references-panel {
    position: absolute;
    top: 30px;
    right: 30px;
    background: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(6, 182, 212, 0.2);
    border-radius: 12px;
    padding: 16px 20px;
    z-index: 20;
    backdrop-filter: blur(10px);
    min-width: 200px;
  }

  .references-title {
    font-size: 11px;
    font-weight: 600;
    color: #06b6d4;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(6, 182, 212, 0.2);
  }

  .reference-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    font-size: 11px;
    color: rgba(148, 163, 184, 0.9);
  }

  .reference-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
  }
  
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
  }
  
  .modal-container {
    position: relative;
    background: linear-gradient(145deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98));
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: 16px;
    padding: 0;
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(6, 182, 212, 0.1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 28px;
    background: linear-gradient(180deg, rgba(6, 182, 212, 0.1) 0%, transparent 100%);
    border-bottom: 1px solid rgba(6, 182, 212, 0.2);
  }

  .modal-title-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .modal-id {
    font-size: 10px;
    letter-spacing: 3px;
    font-weight: 600;
  }

  .modal-title {
    font-size: 22px;
    font-weight: 700;
    color: #f8fafc;
    margin: 0;
  }

  .modal-level {
    font-size: 12px;
    color: rgba(148, 163, 184, 0.8);
    margin-top: 4px;
  }
  
  .modal-close {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.05);
  }
  
  .modal-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  @media (max-width: 768px) {
    .modal-content {
      grid-template-columns: 1fr;
    }
  }
  
  .modal-visual {
    padding: 28px;
    background: rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 280px;
  }

  .modal-shape-preview {
    width: 180px;
    height: 180px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
  }

  .modal-shape-inner {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .modal-shape-glass {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  }
  
  .modal-info {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .modal-section {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 16px;
  }
  
  .modal-section-title {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.7);
    margin-bottom: 10px;
  }

  .modal-description {
    font-size: 13px;
    line-height: 1.6;
    color: rgba(226, 232, 240, 0.9);
  }

  .modal-specs {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 8px;
  }

  .modal-spec-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: rgba(226, 232, 240, 0.85);
  }

  .modal-spec-item::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--theme-color, #06b6d4);
    flex-shrink: 0;
  }

  .modal-footer {
    padding: 20px 28px;
    background: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-dimensions {
    display: flex;
    gap: 16px;
  }

  .dimension-item {
    text-align: center;
  }

  .dimension-value {
    font-size: 16px;
    font-weight: 600;
    color: #f8fafc;
  }

  .dimension-label {
    font-size: 9px;
    color: rgba(148, 163, 184, 0.6);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .modal-button {
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2));
    border: 1px solid rgba(6, 182, 212, 0.4);
    color: #06b6d4;
    padding: 10px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.2s;
  }

  .modal-button:hover {
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(59, 130, 246, 0.3));
    transform: translateY(-1px);
  }

  /* Loading */
  .loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 300;
    backdrop-filter: blur(10px);
  }
  
  .loading-content {
    text-align: center;
  }
  
  .loading-title {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 24px;
  }
  
  .loading-bar-container {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .loading-bar {
    width: 8px;
    height: 40px;
    background: rgba(6, 182, 212, 0.2);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .loading-bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, #06b6d4, #3b82f6);
    border-radius: 4px;
    transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .loading-progress {
    font-size: 12px;
    color: rgba(148, 163, 184, 0.7);
    letter-spacing: 2px;
  }

  /* Decorative elements */
  .decoration-ring {
    position: absolute;
    border: 1px solid rgba(6, 182, 212, 0.1);
    border-radius: 50%;
    pointer-events: none;
  }

  /* Depth indicator */
  .depth-indicator {
    position: absolute;
    left: 40px;
    top: 150px;
    bottom: 150px;
    width: 2px;
    background: linear-gradient(180deg, 
      rgba(6, 182, 212, 0.1) 0%,
      rgba(6, 182, 212, 0.4) 50%,
      rgba(6, 182, 212, 0.1) 100%
    );
    z-index: 5;
  }

  .depth-marker {
    position: absolute;
    left: 12px;
    font-size: 9px;
    color: rgba(148, 163, 184, 0.5);
    transform: translateY(-50%);
    white-space: nowrap;
  }

  .depth-marker::before {
    content: '';
    position: absolute;
    left: -16px;
    top: 50%;
    width: 8px;
    height: 1px;
    background: rgba(6, 182, 212, 0.4);
  }
`;

const bunkerLevels = [
  {
    id: "level-5",
    name: "NIVEL 5",
    subtitle: "ACCESO",
    yPosition: 80,
    dimensions: { length: "30m", width: "18m", height: "3.8m" },
    sections: [
      {
        id: "ASC-01",
        name: "Ascensor Principal",
        description: "Acceso principal blindado con sistemas biométricos de reconocimiento. Capacidad de 8 personas con sistema independiente de energía.",
        shape: "circular",
        theme: "cyan",
        icon: "⬆",
        position: { x: 200, y: 0 },
        size: { width: 130, height: 130 },
        dimensions: { length: "2.5m", width: "2.5m", height: "2.8m" },
        specs: ["Carga máx: 1,200 KG", "Velocidad: 2.5 M/S", "Blindaje: NIJ IV", "Sistema: Hidráulico"]
      },
      {
        id: "ESC-01",
        name: "Escalera Emergencia",
        description: "Vía de evacuación presurizada con sistema independiente de ventilación. Puertas cortafuegos en cada nivel.",
        shape: "pill",
        theme: "orange",
        icon: "∭",
        position: { x: 370, y: 20 },
        size: { width: 80, height: 90 },
        dimensions: { length: "1.5m", width: "3.0m", height: "3.8m" },
        specs: ["Material: Acero 316L", "Capacidad: 30 pers/min", "Presurización: +50 PA", "Iluminación: LED 72H"]
      },
      {
        id: "SEC-01",
        name: "Control Seguridad",
        description: "Centro de control de acceso con sistemas biométricos y de vigilancia.",
        shape: "hexagonal",
        theme: "red",
        icon: "⚙",
        position: { x: 500, y: 0 },
        size: { width: 110, height: 110 },
        dimensions: { length: "3.5m", width: "3.5m", height: "3.8m" },
        specs: ["Biometría: Nivel 4", "Cámaras: 24/7", "AI: Reconocimiento facial", "Backup: 30 días"]
      }
    ]
  },
  {
    id: "level-4",
    name: "NIVEL 4",
    subtitle: "RESIDENCIAL ÉLITE",
    yPosition: 280,
    dimensions: { length: "30m", width: "18m", height: "4.2m" },
    sections: [
      {
        id: "STAFF-01",
        name: "Alojamiento Personal",
        description: "Zona de vivienda para el personal de servicio con dormitorios y áreas comunes.",
        shape: "rounded",
        theme: "purple",
        icon: "⌂",
        position: { x: 80, y: 0 },
        size: { width: 220, height: 140 },
        dimensions: { length: "12m", width: "8m", height: "4.2m" },
        specs: ["Capacidad: 12 personas", "Dormitorios: 6", "Baños: 3", "Filtración: HEPA H14"]
      },
      {
        id: "GUEST-01",
        name: "Suites VIP",
        description: "Suites para invitados con acabados de lujo y medidas de seguridad biométrica.",
        shape: "diamond",
        theme: "pink",
        icon: "◇",
        position: { x: 330, y: 10 },
        size: { width: 130, height: 130 },
        dimensions: { length: "7m", width: "7m", height: "4.2m" },
        specs: ["Suite Guest: 35 m²", "Acabados: Lujo", "Aislamiento: 65 DB", "Blindaje: NIJ III-A"]
      },
      {
        id: "MASTER-02",
        name: "Suite Principal",
        description: "Suite principal con área médica integrada y quirófano de emergencia.",
        shape: "octagonal",
        theme: "blue",
        icon: "★",
        position: { x: 500, y: 0 },
        size: { width: 160, height: 140 },
        dimensions: { length: "10m", width: "8m", height: "4.2m" },
        specs: ["Quirófano: Nivel 2", "Diagnóstico: Rx", "Farmacia: 200+ meds", "BSL-2 Bio"]
      }
    ]
  },
  {
    id: "level-3",
    name: "NIVEL 3",
    subtitle: "SOCIAL Y OPERATIVO",
    yPosition: 480,
    dimensions: { length: "30m", width: "18m", height: "4.5m" },
    sections: [
      {
        id: "DINING-01",
        name: "Comedor Principal",
        description: "Área de comedor formal con cocina integrada y elevador de servicio.",
        shape: "t-shaped",
        theme: "orange",
        icon: "Ϝ",
        position: { x: 60, y: 0 },
        size: { width: 200, height: 150 },
        dimensions: { length: "12m", width: "8m", height: "4.5m" },
        specs: ["Capacidad: 20 pers", "Cocina: 30 m²", "Despensa: 15 m³", "Elevador: 250 KG"]
      },
      {
        id: "CTRL-01",
        name: "Centro de Control",
        description: "Centro de control operativo con comunicaciones satelitales redundantes.",
        shape: "hexagonal",
        theme: "cyan",
        icon: "◉",
        position: { x: 290, y: 10 },
        size: { width: 150, height: 130 },
        dimensions: { length: "10m", width: "7m", height: "4.5m" },
        specs: ["Monitores: 24 OLED", "Comms: 3 redundantes", "Servidores: 6 racks", "EMP Shield"]
      },
      {
        id: "FITNESS-01",
        name: "Centro Fitness",
        description: "Gimnasio completo con piscina, zona cardiovascular y spa.",
        shape: "l-shaped",
        theme: "green",
        icon: "⚽",
        position: { x: 480, y: 0 },
        size: { width: 200, height: 150 },
        dimensions: { length: "12m", width: "8m", height: "4.5m" },
        specs: ["Piscina: 3x8m", "Cardio: 6 equipos", "Fuerza: 1200 KG", "Sauna: 4 pers"]
      }
    ]
  },
  {
    id: "level-2",
    name: "NIVEL 2",
    subtitle: "INDUSTRIAL",
    yPosition: 690,
    dimensions: { length: "30m", width: "18m", height: "5.2m" },
    sections: [
      {
        id: "STORE-01",
        name: "Almacén Logística",
        description: "Almacenamiento de alimentos liofilizados con sistema rotativo automatizado.",
        shape: "rounded",
        theme: "yellow",
        icon: "▦",
        position: { x: 60, y: 0 },
        size: { width: 200, height: 150 },
        dimensions: { length: "12m", width: "8m", height: "5.2m" },
        specs: ["Capacidad: 120 m³", "Temp: 14-18°C", "Humedad: 35-40%", "Sistema: FIFO"]
      },
      {
        id: "TACT-01",
        name: "Entrenamiento Táctico",
        description: "Área de entrenamiento con equipamiento táctico y simuladores de combate.",
        shape: "pentagon",
        theme: "red",
        icon: "✖",
        position: { x: 290, y: 10 },
        size: { width: 130, height: 130 },
        dimensions: { length: "8m", width: "8m", height: "5.2m" },
        specs: ["Tiro: 15m", "Simulador: 360°", "Obstáculos: Config", "Armería: 24 armas"]
      },
      {
        id: "H2O-01",
        name: "Sistema Atmosférico",
        description: "Purificación de agua y aire con filtros HEPA y tratamiento QBRN.",
        shape: "cross",
        theme: "blue",
        icon: "❂",
        position: { x: 460, y: 0 },
        size: { width: 180, height: 150 },
        dimensions: { length: "12m", width: "8m", height: "5.2m" },
        specs: ["Agua: 5,000L/día", "Aire: HEPA H14", "Reserva: 150,000L", "Sensores: 128"]
      }
    ]
  },
  {
    id: "level-1",
    name: "NIVEL 1",
    subtitle: "INFRAESTRUCTURA",
    yPosition: 900,
    dimensions: { length: "30m", width: "18m", height: "6.0m" },
    sections: [
      {
        id: "POWER-01",
        name: "Planta Energética",
        description: "Central eléctrica con generadores diésel, paneles solares y baterías.",
        shape: "star",
        theme: "yellow",
        icon: "⚡",
        position: { x: 60, y: 0 },
        size: { width: 180, height: 160 },
        dimensions: { length: "12m", width: "8m", height: "6.0m" },
        specs: ["Generadores: 2x250KW", "Combustible: 45,000L", "Baterías: 500KWH", "Autonomía: 36 meses"]
      },
      {
        id: "WORK-01",
        name: "Taller Técnico",
        description: "Área de mantenimiento con herramientas CNC e impresoras 3D.",
        shape: "trapezoid",
        theme: "purple",
        icon: "⚙",
        position: { x: 280, y: 10 },
        size: { width: 140, height: 140 },
        dimensions: { length: "10m", width: "7m", height: "6.0m" },
        specs: ["Impresoras 3D: 2", "CNC: Torno+Fresa", "Repuestos: 15,000", "Docs: Completa"]
      },
      {
        id: "GARAGE-01",
        name: "Garage y Túnel",
        description: "Garage con vehículos blindados y túneles de evacuación.",
        shape: "rounded",
        theme: "green",
        icon: "🚗",
        position: { x: 460, y: 0 },
        size: { width: 200, height: 160 },
        dimensions: { length: "12m", width: "8m", height: "6.0m" },
        specs: ["Vehículos: 2 B7", "Túnel: 2.5 KM", "Plataforma: 5,000 KG", "O2: Independiente"]
      }
    ]
  }
];

const getShapeStyles = (shape) => {
  return `shape-${shape}`;
};

const renderInteriorDetail = (section) => {
  const { shape, id } = section;
  
  if (id.includes('ASC')) {
    return (
      <div className="interior-circle">
        <div className="section-pulse"></div>
      </div>
    );
  }
  
  if (id.includes('ESC')) {
    return (
      <div className="interior-stairs">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="stair-step"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="interior-grid">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="interior-grid-cell"></div>
      ))}
    </div>
  );
};

const BunkerExplodedView = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLevels, setShowLevels] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const levelsInOrder = [...bunkerLevels].reverse();
    let levelIndex = 0;

    const animationInterval = setInterval(() => {
      if (levelIndex < levelsInOrder.length) {
        setShowLevels(prev => [...prev, levelsInOrder[levelIndex].id]);
        levelIndex++;
      } else {
        clearInterval(animationInterval);
        setAnimationComplete(true);
      }
    }, 500);

    return () => clearInterval(animationInterval);
  }, []);

  const handleSectionClick = (level, section) => {
    setSelectedSection({ level, section });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedSection(null), 300);
  };

  const Modal = () => {
    if (!selectedSection) return null;
    const { level, section } = selectedSection;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-backdrop"></div>
        <div className={`modal-container theme-${section.theme}`} onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title-section">
              <span className="modal-id">{section.id}</span>
              <h3 className="modal-title">{section.name}</h3>
              <span className="modal-level">{level.name} - {level.subtitle}</span>
            </div>
            <button className="modal-close" onClick={closeModal}>✕</button>
          </div>
          
          <div className="modal-content">
            <div className="modal-visual">
              <div className={`modal-shape-preview ${getShapeStyles(section.shape)}`}>
                <div className="modal-shape-inner">
                  <div className="modal-shape-glass"></div>
                  <span style={{ fontSize: '48px', opacity: 0.8 }}>{section.icon}</span>
                </div>
              </div>
            </div>
            
            <div className="modal-info">
              <div className="modal-section">
                <div className="modal-section-title">Descripción</div>
                <p className="modal-description">{section.description}</p>
              </div>
              
              <div className="modal-section">
                <div className="modal-section-title">Especificaciones</div>
                <ul className="modal-specs">
                  {section.specs.map((spec, i) => (
                    <li key={i} className="modal-spec-item">{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <div className="modal-dimensions">
              <div className="dimension-item">
                <div className="dimension-value">{section.dimensions.length}</div>
                <div className="dimension-label">Largo</div>
              </div>
              <div className="dimension-item">
                <div className="dimension-value">{section.dimensions.width}</div>
                <div className="dimension-label">Ancho</div>
              </div>
              <div className="dimension-item">
                <div className="dimension-value">{section.dimensions.height}</div>
                <div className="dimension-label">Alto</div>
              </div>
            </div>
            <button className="modal-button" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      </div>
    );
  };

  // Calculate total height for SVG
  const totalHeight = 1100;
  const centerX = 380;

  return (
    <div className="bunker-container">
      <div className="header">
        <h1>BUNKER DE SUPERVIVENCIA</h1>
        <p>VISTA ESQUEMÁTICA INTERACTIVA</p>
        <p className="subtitle">CLASIFICACIÓN: RESTRINGIDO</p>
      </div>

      <div className="main-container">
        {/* Background decorative rings */}
        <div className="decoration-ring" style={{ width: '600px', height: '600px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
        <div className="decoration-ring" style={{ width: '800px', height: '800px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
        
        {/* Depth indicator */}
        <div className="depth-indicator">
          {[0, 15, 30, 45, 60].map((depth, i) => (
            <div key={i} className="depth-marker" style={{ top: `${(i + 1) * 18}%` }}>
              {depth}m
            </div>
          ))}
        </div>

        {/* Connection lines SVG */}
        <svg className="connector-svg" viewBox="0 0 760 1100" preserveAspectRatio="xMidYMid meet">
          {/* Main vertical line */}
          <line x1={centerX} y1="50" x2={centerX} y2="1050" className="connector-line connector-line-main" />
          
          {bunkerLevels.map((level, idx) => (
            <g key={`connector-${level.id}`} opacity={showLevels.includes(level.id) ? 1 : 0} style={{ transition: 'opacity 0.5s' }}>
              {/* Horizontal connector */}
              <line 
                x1={level.sections[0]?.position.x + (level.sections[0]?.size.width / 2) || centerX} 
                y1={level.yPosition + 80} 
                x2={level.sections[level.sections.length - 1]?.position.x + (level.sections[level.sections.length - 1]?.size.width / 2) || centerX} 
                y2={level.yPosition + 80} 
                className="connector-line" 
              />
              {/* Vertical drops to sections */}
              {level.sections.map(section => (
                <line 
                  key={`drop-${section.id}`}
                  x1={section.position.x + section.size.width / 2} 
                  y1={level.yPosition + 80} 
                  x2={section.position.x + section.size.width / 2} 
                  y2={level.yPosition + (section.size.height / 2)} 
                  className="connector-line" 
                />
              ))}
            </g>
          ))}
        </svg>

        {/* Level containers */}
        {bunkerLevels.map((level) => (
          <div
            key={level.id}
            className={`level-container ${showLevels.includes(level.id) ? 'level-visible' : 'level-hidden'}`}
            style={{ top: level.yPosition, width: '700px' }}
          >
            <div className="level-label">{level.name} · {level.subtitle}</div>
            
            {level.sections.map((section) => (
              <div
                key={section.id}
                className={`section-container ${getShapeStyles(section.shape)} theme-${section.theme} ${selectedSection?.section?.id === section.id ? 'selected' : ''}`}
                style={{
                  left: section.position.x,
                  top: section.position.y,
                  width: section.size.width,
                  height: section.size.height
                }}
                onClick={() => handleSectionClick(level, section)}
              >
                <div className="section-pulse"></div>
                <div className="section-inner">
                  <div className="section-glass"></div>
                  <div className="section-header">
                    <div className="section-id">{section.id}</div>
                    <div className="section-name">{section.name}</div>
                  </div>
                  <div className="section-interior">
                    {renderInteriorDetail(section)}
                  </div>
                  <div className="section-dimensions">{section.dimensions.length} × {section.dimensions.width}</div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Compass */}
        <div className="compass">
          <div className="compass-inner">
            <div className="compass-ring"></div>
            <div className="compass-needle compass-needle-north"></div>
            <div className="compass-needle compass-needle-south"></div>
            <span className="compass-label compass-n">N</span>
            <span className="compass-label compass-e">E</span>
            <span className="compass-label compass-s">S</span>
            <span className="compass-label compass-w">O</span>
          </div>
        </div>

        {/* References panel */}
        <div className="references-panel">
          <div className="references-title">Referencias</div>
          <div className="reference-item">
            <div className="reference-color" style={{ background: '#06b6d4' }}></div>
            <span>Control / Ascensor</span>
          </div>
          <div className="reference-item">
            <div className="reference-color" style={{ background: '#8b5cf6' }}></div>
            <span>Residencial</span>
          </div>
          <div className="reference-item">
            <div className="reference-color" style={{ background: '#f97316' }}></div>
            <span>Social / Comedor</span>
          </div>
          <div className="reference-item">
            <div className="reference-color" style={{ background: '#10b981' }}></div>
            <span>Fitness / Garage</span>
          </div>
          <div className="reference-item">
            <div className="reference-color" style={{ background: '#eab308' }}></div>
            <span>Energía / Almacén</span>
          </div>
          <div className="reference-item">
            <div className="reference-color" style={{ background: '#ef4444' }}></div>
            <span>Seguridad</span>
          </div>
        </div>
      </div>

      {showModal && <Modal />}

      {!animationComplete && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-title">Inicializando Vista Bunker</div>
            <div className="loading-bar-container">
              {bunkerLevels.map((_, i) => (
                <div key={i} className="loading-bar">
                  <div 
                    className="loading-bar-fill" 
                    style={{ height: showLevels.length > i ? '100%' : '0%' }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="loading-progress">{showLevels.length} / {bunkerLevels.length} Niveles</div>
          </div>
        </div>
      )}
    </div>
  );
};

const StyleElement = () => <style>{styles}</style>;

const Bunker = () => (
  <>
    <StyleElement />
    <BunkerExplodedView />
  </>
);

export default Bunker;