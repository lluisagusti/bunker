"use client"

import { useState, useEffect } from 'react';

const styles = `
  /* Estilos generales */
  .bunker-container {
    position: relative;
    width: 100%;
    overflow: auto;
    min-height: 100vh;
    background-color: #f0f4f8;
    font-family: 'Courier New', monospace;
  }

  .header {
    text-align: center;
    padding: 16px;
    background-color: #dbeafe;
    border-bottom: 2px solid #2563eb;
  }
  
  .header h1 {
    font-size: 24px;
    font-weight: bold;
    color: #2563eb;
    margin: 0;
  }
  
  .header p {
    color: #2563eb;
    margin: 4px 0;
  }
  
  .header .subtitle {
    font-size: 14px;
  }
  
  .main-container {
    position: relative;
    margin: 0 auto;
    width: 1000px;
    height: 1200px;
    margin-top: 32px;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 20px;
    perspective: 2000px; /* Added for 3D context */
  }
  
  .grid-reference {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(12, 1fr);
    pointer-events: none;
    opacity: 0.1;
  }
  
  .grid-cell {
    border: 1px solid #2563eb;
  }
  
  /* Conector de líneas */
  .connector-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  .visible-level {
    opacity: 1;
    transition: opacity 0.5s;
  }
  
  .hidden-level {
    opacity: 0;
    transition: opacity 0.5s;
  }
  
  /* Contenedores de nivel */
  .level-container {
    position: absolute;
    transition: all 1s ease;
    left: 0;
    right: 0;
  }
  
  .level-visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .level-hidden {
    opacity: 0;
    transform: translateY(20px);
  }
  
  /* Contenedores de sección */
  .section-container {
    position: absolute;
    transition: transform 0.5s;
    cursor: pointer;
    transform-style: preserve-3d;
  }
  
  .section-selected {
    transform: scale(1.05);
    z-index: 20;
  }

  .section-label, .section-dimensions {
    position: absolute;
    width: 100%;
    text-align: center;
    color: #2563eb;
    font-weight: bold;
    z-index: 20;
    text-shadow: 0px 0px 2px white;
    pointer-events: none;
  }

  .section-label {
    top: -24px;
    font-size: 12px;
  }

  .section-dimensions {
    bottom: -32px;
    font-size: 10px;
  }

  /* NEW 3D STYLES */
  :root {
    --depth: 20px;
  }
  
  .section-3d-box {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(60deg) rotateZ(-45deg);
    transition: transform 0.4s ease-out;
  }

  .section-container:hover .section-3d-box {
    transform: rotateX(55deg) rotateZ(-45deg) scale3d(1.05, 1.05, 1.05);
  }

  .section-face {
    position: absolute;
    box-sizing: border-box;
    border: 1px dashed #93c5fd;
    background-color: rgba(219, 234, 254, 0.4);
  }
  
  .top-face {
    width: 100%;
    height: 100%;
    transform: translateZ(var(--depth));
    border: 2px solid #2563eb;
    background-color: rgba(219, 234, 254, 0.7);
  }

  .top-face.selected {
    background-color: rgba(147, 197, 253, 0.9);
    border-color: #1d4ed8;
  }

  .bottom-face {
    width: 100%;
    height: 100%;
    transform: translateZ(0px);
    background-color: rgba(147, 197, 253, 0.3);
  }

  .wall {
    background-image: linear-gradient(rgba(219, 234, 254, 0.2), rgba(147, 197, 253, 0.5));
  }

  .front-face {
    width: 100%;
    height: var(--depth);
    top: 100%;
    transform-origin: top;
    transform: rotateX(90deg) translateY(-100%);
  }

  .back-face {
    width: 100%;
    height: var(--depth);
    top: 0;
    transform-origin: top;
    transform: rotateX(-90deg);
  }

  .left-face {
    width: var(--depth);
    height: 100%;
    left: 0;
    transform-origin: left;
    transform: rotateY(90deg);
  }

  .right-face {
    width: var(--depth);
    height: 100%;
    left: 100%;
    transform-origin: left;
    transform: rotateY(-90deg) translateX(-100%);
  }
  
  .section-content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .section-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(37, 99, 235, 0.3);
    z-index: 10;
  }
  
  .section-interior {
    position: absolute;
    inset: 16px;
    border: 1px dashed #2563eb;
  }
  
  /* Detalles de secciones */
  .section-detail {
    position: absolute;
    inset: 0;
  }
  
  .section-detail-asc {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .section-detail-asc .circle {
    width: 50%;
    height: 50%;
    border: 1px solid #2563eb;
    border-radius: 50%;
  }

  .section-generic-grid {
    position: absolute;
    inset: 32px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 8px;
    opacity: 0.6;
  }
  
  .section-generic-grid .grid-cell {
    border: 1px solid #2563eb;
  }
  
  /* Medidas y cotas */
  .dimension-line {
    stroke: #2563eb;
    stroke-width: 1;
    stroke-dasharray: 3,2;
  }
  
  .dimension-text {
    fill: #2563eb;
    font-size: 10px;
    font-family: 'Courier New', monospace;
  }

  .dimension-arrow {
    stroke: #2563eb;
    stroke-width: 1;
    fill: none;
  }
  
  /* Referencias e instrucciones */
  .references-box {
    position: absolute;
    top: 40px;
    right: 40px;
    padding: 16px;
    border: 2px solid #2563eb;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 30;
  }
  
  .references-box h4 {
    color: #2563eb;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 8px;
    border-bottom: 1px solid #93c5fd;
    padding-bottom: 4px;
  }
  
  .references-box ul {
    color: #2563eb;
    font-size: 12px;
    padding-left: 20px;
    margin: 0;
  }

  .references-box .reference-section {
    margin-bottom: 10px;
  }
  
  .references-box .tech-specs {
    margin-top: 10px;
    font-size: 10px;
  }
  
  .instructions {
    position: absolute;
    bottom: 16px;
    right: 16px;
    font-size: 14px;
    color: #2563eb;
    max-width: 320px;
    text-align: right;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 8px;
    border: 1px solid #93c5fd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .instructions .security-note {
    font-size: 12px;
    margin-top: 4px;
    font-style: italic;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }
  
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-container {
    position: relative;
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    max-width: 800px;
    width: 100%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 2px solid #2563eb;
    font-family: 'Courier New', monospace;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 8px;
  }
  
  .modal-title {
    font-size: 20px;
    font-weight: bold;
    color: #2563eb;
    margin: 0;
  }
  
  .modal-close-button {
    color: #2563eb;
    font-weight: bold;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
  }
  
  .modal-close-button:hover {
    color: #1d4ed8;
  }
  
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  @media (min-width: 768px) {
    .modal-content {
      flex-direction: row;
    }
  }
  
  .modal-image {
    width: 100%;
    background-color: #dbeafe;
    border: 1px solid #93c5fd;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 12px;
    color: #2563eb;
  }
  
  .modal-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  @media (min-width: 768px) {
    .modal-image, .modal-info {
      width: 50%;
    }
  }
  
  .modal-section {
    background-color: #dbeafe;
    border: 1px solid #93c5fd;
    padding: 12px;
  }
  
  .modal-section h4 {
    color: #2563eb;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 14px;
    border-bottom: 1px solid #93c5fd;
    padding-bottom: 4px;
  }
  
  .modal-section p {
    color: #2563eb;
    margin: 0;
    font-size: 12px;
  }
  
  .spec-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 12px;
  }
  
  .spec-list li {
    margin-bottom: 4px;
    color: #2563eb;
    display: flex;
    align-items: flex-start;
  }
  
  .spec-list li:before {
    content: "•";
    margin-right: 5px;
  }
  
  .modal-footer {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #93c5fd;
    padding-top: 16px;
  }
  
  .modal-location {
    color: #2563eb;
    font-size: 12px;
  }
  
  .modal-button {
    background-color: #2563eb;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  .modal-button:hover {
    background-color: #1d4ed8;
  }
  
  /* Carga */
  .loading-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }
  
  .loading-content {
    text-align: center;
    color: #2563eb;
    background-color: white;
    padding: 30px;
    border: 2px solid #2563eb;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .loading-title {
    margin-bottom: 16px;
    font-size: 24px;
    font-weight: bold;
  }
  
  .loading-bars {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  
  .loading-bar {
    width: 12px;
    height: 48px;
    background-color: #2563eb;
    opacity: 0.3;
    animation: pulse 1s infinite;
    transition: opacity 0.3s;
  }
  
  .loading-bar.loaded {
    opacity: 1;
  }
  
  .loading-progress {
    margin-top: 16px;
    font-size: 14px;
  }
  
  @keyframes pulse {
    0% { opacity: 0.3; }
    50% { opacity: 0.7; }
    100% { opacity: 0.3; }
  }
  
  /* Compass */
  .compass {
    position: absolute;
    bottom: 16px;
    left: 16px;
    width: 80px;
    height: 80px;
    border: 2px solid #2563eb;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
  }
  
  .compass-inner {
    width: 70%;
    height: 70%;
    position: relative;
  }
  
  .compass-arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center;
    background-color: #2563eb;
  }
  
  .compass-north {
    width: 2px;
    height: 50%;
    transform: translate(-50%, -100%);
  }
  
  .compass-east {
    width: 50%;
    height: 2px;
    transform: translate(0%, -50%);
  }
  
  .compass-south {
    width: 2px;
    height: 25%;
    transform: translate(-50%, 0%);
  }
  
  .compass-west {
    width: 25%;
    height: 2px;
    transform: translate(-100%, -50%);
  }
  
  .compass-label {
    position: absolute;
    font-size: 10px;
    color: #2563eb;
    font-weight: bold;
  }
  
  .compass-n {
    top: 0;
    left: 50%;
    transform: translate(-50%, -120%);
  }
  
  .compass-e {
    top: 50%;
    right: 0;
    transform: translate(120%, -50%);
  }
  
  .compass-s {
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 120%);
  }
  
  .compass-w {
    top: 50%;
    left: 0;
    transform: translate(-120%, -50%);
  }
    `;

const bunkerLevels = [
    {
      id: "level-5",
      name: "NIVEL 5 - ACCESO",
      yPosition: 50,
      dimensions: { length: "30m", width: "18m", height: "3.8m" },
      floorMaterial: "Concreto reforzado de alta densidad (350kg/cm²)",
      wallsThickness: "60cm",
      sections: [
        {
          id: "asc-01",
          name: "ASCENSOR PRINCIPAL ASC-01",
          description: "Acceso principal blindado con sistemas biométricos de reconocimiento. Capacidad de 8 personas. Sistema independiente de energía.",
          position: { top: 0, left: 0 },
          size: { width: 100, height: 100 },
          centerX: 390,
          centerY: 150,
          width: 150,
          height: 150,
          dimensions: { length: "2.5m", width: "2.5m", height: "2.8m" },
          specs: [
            "CARGA MÁX: 1,200 KG",
            "VELOCIDAD: 2.5 M/S",
            "BLINDAJE: KEVLAR/ACERO COMPUESTO (NIJ IV)",
            "SISTEMA: HIDRÁULICO CON RESPALDO MECÁNICO",
            "PUERTAS: DOBLE HOJA CON SELLADO HERMÉTICO"
          ],
          elements: [
            { id: "panel", name: "PANEL DE CONTROL", x: "60%", y: "30%", width: "15%", height: "30%" },
            { id: "floor", name: "PISO ANTIDESLIZANTE", x: "10%", y: "70%", width: "80%", height: "20%" }
          ]
        },
        {
          id: "esc-01",
          name: "ESCALERA DE EMERGENCIA ESC-01",
          description: "Vía de evacuación presurizada con sistema independiente de ventilación. Puertas cortafuegos en cada nivel.",
          position: { top: 0, left: 120 },
          size: { width: 100, height: 100 },
          centerX: 610,
          centerY: 150,
          width: 50,
          height: 50,
          dimensions: { length: "1.5m", width: "3.0m", height: "3.8m" },
          specs: [
            "MATERIAL: ACERO INOXIDABLE 316L",
            "PELDAÑOS: 24 UNIDADES POR NIVEL",
            "CAPACIDAD: 30 PERSONAS/MIN",
            "PRESURIZACIÓN: +50 PA",
            "ILUMINACIÓN: LED AUTÓNOMA 72H"
          ],
          elements: [
            { id: "steps", name: "PELDAÑOS ANTIDESLIZANTES", x: "20%", y: "20%", width: "60%", height: "60%" },
            { id: "handrail", name: "BARANDILLA REFORZADA", x: "80%", y: "20%", width: "10%", height: "60%" }
          ]
        }
      ]
    },
    {
      id: "level-4",
      name: "NIVEL 4 - RESIDENCIAL ÉLITE",
      yPosition: 220,
      dimensions: { length: "30m", width: "18m", height: "4.2m" },
      floorMaterial: "Concreto con aislamiento acústico y térmico",
      wallsThickness: "45cm",
      sections: [
        {
          id: "level-4-left",
          name: "ALOJAMIENTO PERSONAL LEVEL 1 - ACCESO Y CONTROL",
          description: "Zona de vivienda para el personal de servicio. Incluye dormitorios, áreas comunes y sistema de vigilancia de accesos.",
          position: { top: 0, left: 0 },
          size: { width: 220, height: 200 },
          centerX: 250,
          centerY: 330,
          width: 280,
          height: 200,
          dimensions: { length: "12m", width: "8m", height: "4.2m" },
          specs: [
            "CAPACIDAD: 12 PERSONAS",
            "DORMITORIOS: 6 UNIDADES (2 PERSONAS/UNIDAD)",
            "BAÑOS: 3 UNIDADES COMPLETOS",
            "FILTRACIÓN AIRE: HEPA H14 + CARBÓN ACTIVADO",
            "SISTEMA SEGURIDAD: BIOMÉTRICO NIVEL 2"
          ],
          elements: [
            { id: "beds", name: "DORMITORIOS", x: "10%", y: "10%", width: "40%", height: "40%" },
            { id: "common", name: "ÁREA COMÚN", x: "60%", y: "10%", width: "30%", height: "40%" },
            { id: "bathroom", name: "BAÑOS", x: "10%", y: "60%", width: "25%", height: "30%" },
            { id: "storage", name: "ALMACENAMIENTO", x: "40%", y: "60%", width: "50%", height: "30%" }
          ]
        },
        {
          id: "level-4-center",
          name: "HABITACIONES GUEST-01 y MASTER-02",
          description: "Suites para invitados y suite secundaria con medidas de seguridad biométrica. Acabados de lujo.",
          position: { top: 0, left: 240 },
          size: { width: 200, height: 180 },
          centerX: 500,
          centerY: 450,
          width: 250,
          height: 160,
          dimensions: { length: "10m", width: "7m", height: "4.2m" },
          specs: [
            "SUITE GUEST-01: 35 M²",
            "SUITE MASTER-02: 45 M²",
            "ACABADOS: MÁRMOL/MADERA EXÓTICA",
            "AISLAMIENTO: ACÚSTICO 65 DB",
            "BLINDAJE: NIVEL NIJ III-A"
          ],
          elements: [
            { id: "master", name: "SUITE MASTER-02", x: "10%", y: "10%", width: "45%", height: "80%" },
            { id: "guest", name: "SUITE GUEST-01", x: "60%", y: "10%", width: "35%", height: "80%" }
          ]
        },
        {
          id: "level-4-right",
          name: "CENTRO DE SALUD MASTER-01",
          description: "Suite principal con área médica integrada. Incluye quirófano de emergencia y equipamiento de diagnóstico avanzado.",
          position: { top: 0, left: 460 },
          size: { width: 220, height: 200 },
          centerX: 750,
          centerY: 330,
          width: 280,
          height: 200,
          dimensions: { length: "12m", width: "8m", height: "4.2m" },
          specs: [
            "QUIRÓFANO: NIVEL 2 (25 M²)",
            "DIAGNÓSTICO: EQUIPO RADIOLÓGICO COMPACTO",
            "FARMACIA: 200+ MEDICAMENTOS ESENCIALES",
            "MONITOREO: SIGNOS VITALES REMOTO",
            "AISLAMIENTO: BIOLÓGICO NIVEL BSL-2"
          ],
          elements: [
            { id: "surgery", name: "QUIRÓFANO", x: "10%", y: "10%", width: "45%", height: "45%" },
            { id: "recovery", name: "RECUPERACIÓN", x: "60%", y: "10%", width: "30%", height: "30%" },
            { id: "pharmacy", name: "FARMACIA", x: "10%", y: "60%", width: "30%", height: "30%" },
            { id: "diagnostic", name: "DIAGNÓSTICO", x: "45%", y: "45%", width: "45%", height: "45%" }
          ]
        },
      ]
    },
    {
      id: "level-3",
      name: "NIVEL 3 - SOCIAL Y OPERATIVO",
      yPosition: 420,
      dimensions: { length: "30m", width: "18m", height: "4.5m" },
      floorMaterial: "Concreto pulido con tratamiento antiestático",
      wallsThickness: "50cm",
      sections: [
        {
          id: "level-3-left",
          name: "COMEDOR PRINCIPAL",
          description: "Área de comedor formal con capacidad para 20 personas. Conectado con cocina principal mediante elevador de servicio.",
          position: { top: 0, left: 0 },
          size: { width: 220, height: 200 },
          centerX: 250,
          centerY: 550,
          width: 280,
          height: 200,
          dimensions: { length: "12m", width: "8m", height: "4.5m" },
          specs: [
            "CAPACIDAD: 20 PERSONAS",
            "MESAS: 4 UNIDADES MULTIFUNCIÓN",
            "COCINA: INTEGRADA 30 M²",
            "ALMACENAJE: DESPENSA 15 M³",
            "ELEVADOR SERVICIO: 250 KG"
          ],
          elements: [
            { id: "tables", name: "ÁREA DE MESAS", x: "20%", y: "20%", width: "60%", height: "60%" },
            { id: "kitchen", name: "COCINA", x: "10%", y: "10%", width: "70%", height: "30%" },
            { id: "storage", name: "DESPENSA", x: "85%", y: "10%", width: "10%", height: "80%" }
          ]
        },
        {
          id: "level-3-center",
          name: "CENTRO DE CONTROL",
          description: "Centro de control operativo con comunicaciones satelitales redundantes y sistema de vigilancia centralizado.",
          position: { top: 0, left: 240 },
          size: { width: 200, height: 180 },
          centerX: 500,
          centerY: 550,
          width: 250,
          height: 160,
          dimensions: { length: "10m", width: "7m", height: "4.5m" },
          specs: [
            "MONITOREO: 24 PANTALLAS OLED",
            "COMUNICACIÓN: 3 SISTEMAS REDUNDANTES",
            "SERVIDORES: 6 RACKS REFRIGERADOS",
            "BLINDAJE: EMI/EMP COMPLETO",
            "AUTONOMÍA: 180 DÍAS"
          ],
          elements: [
            { id: "screens", name: "PARED DE MONITORES", x: "10%", y: "10%", width: "80%", height: "30%" },
            { id: "workstations", name: "ESTACIONES DE TRABAJO", x: "20%", y: "50%", width: "60%", height: "40%" },
            { id: "servers", name: "SERVIDORES", x: "85%", y: "10%", width: "10%", height: "80%" }
          ]
        },
        {
          id: "level-3-right",
          name: "CENTRO FITNESS MUED-01",
          description: "Gimnasio completamente equipado con zona cardiovascular, área de pesas y piscina de entrenamiento.",
          position: { top: 0, left: 460 },
          size: { width: 220, height: 200 },
          centerX: 750,
          centerY: 550,
          width: 280,
          height: 200,
          dimensions: { length: "12m", width: "8m", height: "4.5m" },
          specs: [
            "PISCINA: 3x8M CONTRACORRIENTE",
            "CARDIO: 6 EQUIPOS AUTOGENERATIVOS",
            "FUERZA: SISTEMA COMPLETO 1200KG",
            "SAUNA: INFRARROJO 4 PERSONAS",
            "VESTUARIOS: 2 UNIDADES COMPLETAS"
          ],
          elements: [
            { id: "pool", name: "PISCINA", x: "10%", y: "10%", width: "45%", height: "80%" },
            { id: "cardio", name: "ZONA CARDIO", x: "60%", y: "10%", width: "35%", height: "40%" },
            { id: "weights", name: "ZONA PESAS", x: "60%", y: "55%", width: "35%", height: "40%" }
          ]
        },
      ]
    },
    {
      id: "level-2",
      name: "NIVEL 2 - INDUSTRIAL",
      yPosition: 620,
      dimensions: { length: "30m", width: "18m", height: "5.2m" },
      floorMaterial: "Concreto industrial con recubrimiento epóxico resistente a químicos",
      wallsThickness: "65cm",
      sections: [
        {
          id: "level-2-left",
          name: "ALMACÉN Y LOGÍSTICA WDRX-01",
          description: "Almacenamiento de alimentos liofilizados, bienes de larga duración y sistema rotativo automatizado de inventario.",
          position: { top: 0, left: 0 },
          size: { width: 220, height: 200 },
          centerX: 250,
          centerY: 750,
          width: 280,
          height: 200,
          dimensions: { length: "12m", width: "8m", height: "5.2m" },
          specs: [
            "CAPACIDAD: 120 M³ DE ALMACENAJE",
            "ESTANTERÍAS: SISTEMA AUTOMATIZADO",
            "TEMPERATURA: 14-18°C CONSTANTE",
            "HUMEDAD: 35-40% CONTROLADA",
            "ROTACIÓN: FIFO AUTOMATIZADO"
          ],
          elements: [
            { id: "shelves", name: "ESTANTERÍAS ROTATIVAS", x: "10%", y: "10%", width: "70%", height: "80%" },
            { id: "control", name: "SISTEMA DE CONTROL", x: "85%", y: "10%", width: "10%", height: "30%" },
            { id: "loading", name: "ÁREA DE CARGA", x: "85%", y: "45%", width: "10%", height: "50%" }
          ]
        },
        {
          id: "level-2-center",
          name: "GYM-01",
          description: "Área de entrenamiento físico con equipamiento táctico y simuladores de combate para el personal de seguridad.",
          position: { top: 0, left: 240 },
          size: { width: 200, height: 180 },
          centerX: 500,
          centerY: 750,
          width: 250,
          height: 160,
          dimensions: { length: "10m", width: "7m", height: "5.2m" },
          specs: [
            "ZONA TIRO: 15M CON RECUPERACIÓN",
            "SIMULADOR: 360° PROYECCIÓN TÁCTICA",
            "OBSTÁCULOS: CURSO CONFIGURABLE",
            "ARMERÍA: CAPACIDAD 24 ARMAS",
            "MONITOREO: BIOMECÁNICO COMPLETO"
          ],
          elements: [
            { id: "shooting", name: "ZONA DE TIRO", x: "10%", y: "10%", width: "40%", height: "80%" },
            { id: "training", name: "ENTRENAMIENTO FÍSICO", x: "55%", y: "10%", width: "40%", height: "40%" },
            { id: "armory", name: "ARMERÍA", x: "55%", y: "55%", width: "40%", height: "40%" }
          ]
        },
        {
          id: "level-2-right",
          name: "SISTEMA ATMOSFÉRICO H2O-SYS",
          description: "Sistema de purificación de agua y aire con filtros HEPA y tratamiento contra agentes QBRN. Reservas para 30 meses.",
          position: { top: 0, left: 460 },
          size: { width: 220, height: 200 },
          centerX: 750,
          centerY: 750,
          width: 280,
          height: 200,
          dimensions: { length: "12m", width: "8m", height: "5.2m" },
          specs: [
            "PURIFICACIÓN AGUA: 5,000L/DÍA",
            "FILTRACIÓN AIRE: HEPA H14 + QBRN",
            "RESERVA AGUA: 150,000L TRATADA",
            "RECICLAJE: 95% EFICIENCIA",
            "SENSORES: 128 PUNTOS MONITOREO"
          ],
          elements: [
            { id: "water", name: "SISTEMA DE AGUA", x: "10%", y: "10%", width: "40%", height: "80%" },
            { id: "air", name: "SISTEMA DE AIRE", x: "55%", y: "10%", width: "40%", height: "50%" },
            { id: "monitoring", name: "MONITOREO", x: "55%", y: "65%", width: "40%", height: "30%" }
          ]
        },
      ]
    },
    {
      id: "level-1",
      name: "NIVEL 1 - INFRAESTRUCTURA",
      yPosition: 820,
      dimensions: { length: "30m", width: "18m", height: "6.0m" },
      floorMaterial: "Concreto de alta resistencia con aislamiento vibratorio",
      wallsThickness: "80cm",
      sections: [
        {
          id: "level-1-left",
          name: "PLANTA ENERGÉTICA POWER-01",
          description: "Central eléctrica con generadores diésel, paneles solares plegables y sistema de almacenamiento de energía redundante.",
          position: { top: 0, left: 0 },
          size: { width: 220, height: 200 },
          centerX: 250,
          centerY: 950,
          width: 280,
          height: 200,
          dimensions: { length: "12m", width: "8m", height: "6.0m" },
          specs: [
            "GENERADORES: 2X 250KW DIESEL",
            "COMBUSTIBLE: 45,000L RESERVA",
            "BATERÍAS: 500KWH LITIO-TITANATO",
            "PANELES: 120KW PLEGABLES",
            "AUTONOMÍA: 36 MESES PLENA CARGA"
          ],
          elements: [
            { id: "generators", name: "GENERADORES", x: "10%", y: "10%", width: "45%", height: "45%" },
            { id: "fuel", name: "DEPÓSITOS COMBUSTIBLE", x: "10%", y: "60%", width: "45%", height: "35%" },
            { id: "batteries", name: "BANCO BATERÍAS", x: "60%", y: "10%", width: "35%", height: "80%" }
          ]
        },
        {
          id: "level-1-center",
          name: "TALLER TÉCNICO",
          description: "Área de mantenimiento con herramientas industriales, impresoras 3D y stock de repuestos críticos.",
          position: { top: 0, left: 240 },
          size: { width: 200, height: 180 },
          centerX: 500,
          centerY: 950,
          width: 250,
          height: 160,
          dimensions: { length: "10m", width: "7m", height: "6.0m" },
          specs: [
            "HERRAMIENTAS: INVENTARIO COMPLETO",
            "IMPRESORAS 3D: 2 UNIDADES METAL/POLÍMERO",
            "CNC: TORNO Y FRESADORA COMPACTOS",
            "REPUESTOS: 15,000 REFERENCIAS",
            "DOCUMENTACIÓN: BIBLIOTECA TÉCNICA COMPLETA"
          ],
          elements: [
            { id: "workbench", name: "MESAS DE TRABAJO", x: "10%", y: "10%", width: "80%", height: "40%" },
            { id: "3dprinters", name: "IMPRESORAS 3D", x: "10%", y: "55%", width: "40%", height: "40%" },
            { id: "storage", name: "ALMACÉN REPUESTOS", x: "55%", y: "55%", width: "40%", height: "40%" }
          ]
        },
        {
          id: "garage-01",
          name: "GARAGE-01 Y TÚNEL DE ESCAPE",
          description: "Garage con vehículos blindados, cuatriciclos y sistema de túneles de evacuación hacia puntos seguros.",
          position: { top: 0, left: 460 },
          size: { width: 220, height: 200 },
          centerX: 750,
          centerY: 950,
          width: 280,
          height: 200,
          dimensions: { length: "12m", width: "8m", height: "6.0m" },
          specs: [
            "VEHÍCULOS: 2 BLINDADOS NIVEL B7",
            "TÚNEL: 2.5KM HACIA PUNTO SEGURO",
            "PLATAFORMA: ELEVADORA 5,000KG",
            "COMPUERTAS: BLINDAJE BALÍSTICO",
            "AUTONOMÍA: SISTEMA OXÍGENO INDEPENDIENTE"
          ],
          elements: [
            { id: "vehicles", name: "ÁREA VEHÍCULOS", x: "10%", y: "10%", width: "80%", height: "50%" },
            { id: "tunnel", name: "ACCESO TÚNEL", x: "60%", y: "65%", width: "35%", height: "30%" },
            { id: "equipment", name: "EQUIPAMIENTO", x: "10%", y: "65%", width: "45%", height: "30%" }
          ]
        },
      ]
    },
];

const BunkerExplodedView = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLevels, setShowLevels] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const levelsInAnimationOrder = [...bunkerLevels].reverse();
    let levelIndex = 0;

    const animationInterval = setInterval(() => {
      if (levelIndex < levelsInAnimationOrder.length) {
        setShowLevels(prev => [...prev, levelsInAnimationOrder && levelsInAnimationOrder[levelIndex] && levelsInAnimationOrder[levelIndex].id]);
        levelIndex++;
      } else {
        clearInterval(animationInterval);
        setAnimationComplete(true);
      }
    }, 600);

    return () => clearInterval(animationInterval);
  }, []);

  const handleSectionClick = (level, section) => {
    if (level && section) {
      setSelectedSection({ level, section });
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSection(null);
  };

  const Modal = () => {
    if (!selectedSection || !selectedSection.level || !selectedSection.section) return null;
    const { level, section } = selectedSection;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-backdrop"></div>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">{section.name}</h3>
            <button className="modal-close-button" onClick={closeModal}>X</button>
          </div>
          <div className="modal-content">
            <div className="modal-image">
              <p>IMAGEN REFERENCIAL</p>
            </div>
            <div className="modal-info">
              <div className="modal-section">
                <h4>DESCRIPCIÓN:</h4>
                <p>{section.description}</p>
              </div>
              <div className="modal-section">
                <h4>ESPECIFICACIONES:</h4>
                <ul className="spec-list">
                  <li>UBICACIÓN: {level.name}</li>
                  <li>CÓDIGO: {section.id.toUpperCase()}</li>
                  <li>ACCESO: NIVEL {bunkerLevels.findIndex(l => l.id === level.id) + 1}</li>
                   {section.specs.map(spec => <li key={spec}>{spec}</li>)}
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-button" onClick={closeModal}>CERRAR [ESC]</button>
          </div>
        </div>
      </div>
    );
  };

  const ConnectorLines = () => (
      <svg className="connector-lines" style={{ zIndex: 5 }}>
        <line x1="500" y1="100" x2="500" y2="1000" style={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '10,5' }} />
        {bunkerLevels.map((level, idx) => (
          <g key={`connector-${level.id}`} className={showLevels.includes(level.id) ? 'visible-level' : 'hidden-level'}>
            <line x1="500" y1={level.yPosition + 100} x2="250" y2={level.yPosition + 100} style={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '10,5' }} />
            <line x1="500" y1={level.yPosition + 100} x2="750" y2={level.yPosition + 100} style={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '10,5' }} />
            <text x="120" y={level.yPosition + 30} style={{ fill: '#2563eb', fontFamily: 'Courier New, monospace', fontSize: '12px' }}>{level.name}</text>
            <line x1="100" y1={level.yPosition} x2="100" y2={level.yPosition + 200} style={{ stroke: '#2563eb', strokeWidth: 1 }} />
            <line x1="95" y1={level.yPosition} x2="105" y2={level.yPosition} style={{ stroke: '#2563eb', strokeWidth: 1 }} />
            <line x1="95" y1={level.yPosition + 200} x2="105" y2={level.yPosition + 200} style={{ stroke: '#2563eb', strokeWidth: 1 }} />
            <text x="70" y={level.yPosition + 100} style={{ fill: '#2563eb', fontFamily: 'Courier New, monospace', fontSize: '10px' }}>{(idx * 15) + 'm'}</text>
          </g>
        ))}
        <line x1="390" y1="150" x2="390" y2="950" style={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '5,5' }} />
        <text x="370" y="130" style={{ fill: '#2563eb', fontFamily: 'Courier New, monospace', fontSize: '10px' }}>PRTL-ASC</text>
        <line x1="610" y1="150" x2="610" y2="950" style={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '5,5' }} />
        <text x="615" y="130" style={{ fill: '#2563eb', fontFamily: 'Courier New, monospace', fontSize: '10px' }}>SEC-ESC</text>
        <text x="850" y="500" style={{ fill: '#2563eb', fontFamily: 'Courier New, monospace', fontSize: '12px', writingMode: 'vertical-rl' }}>LONGITUD: 30M</text>
        <text x="880" y="500" style={{ fill: '#2563eb', fontFamily: 'Courier New, monospace', fontSize: '12px', writingMode: 'vertical-rl' }}>ANCHO: 18M</text>
      </svg>
  );

  return (
    <div className="bunker-container">
      <div className="header">
        <h1>BUNKER DE SUPERVIVENCIA EXTENDIDA</h1>
        <p>ESQUEMÁTICO ISOMÉTRICO // VISTA EXPLODIDA 3D</p>
        <p className="subtitle">CLASIFICACIÓN: CONFIDENCIAL - SOLO PARA PROPIETARIOS</p>
      </div>

      <div className="main-container">
        <div className="grid-reference">
          {Array.from({ length: 120 }).map((_, i) => <div key={`grid-${i}`} className="grid-cell"></div>)}
        </div>

        <ConnectorLines />

        {bunkerLevels.map((level) => (
          <div
            key={level.id}
            className={`level-container ${showLevels.includes(level.id) ? 'level-visible' : 'level-hidden'}`}
            style={{ top: level.yPosition, left: 0, right: 0 }}
          >
            {level.sections.map((section) => (
              <div
                key={section.id}
                className={`section-container ${selectedSection?.section?.id === section.id ? 'section-selected' : ''}`}
                style={{
                  left: section.centerX - section.width / 2,
                  top: section.centerY - level.yPosition - section.height / 2,
                  width: section.width,
                  height: section.height,
                  '--depth': '20px'
                }}
                onClick={() => handleSectionClick(level, section)}
              >
                <div className="section-label">{section.id.toUpperCase()}</div>
                <div className="section-dimensions">{section.dimensions.length} x {section.dimensions.width}</div>

                <div className="section-3d-box">
                    <div className={`section-face top-face ${selectedSection?.section?.id === section.id ? 'selected' : ''}`}>
                         <div className="section-content">
                            {selectedSection?.section?.id === section.id && <div className="section-overlay"></div>}
                            <div className="section-interior"></div>
                            {section.id.includes('asc') && (
                                <div className="section-detail section-detail-asc"><div className="circle"></div></div>
                            )}
                            {!section.id.includes('asc') && !section.id.includes('esc') && (
                                <div className="section-generic-grid">
                                    <div className="grid-cell"></div><div className="grid-cell"></div>
                                    <div className="grid-cell"></div><div className="grid-cell"></div>
                                </div>
                            )}
                         </div>
                    </div>
                    <div className="section-face bottom-face"></div>
                    <div className="section-face wall front-face"></div>
                    <div className="section-face wall back-face"></div>
                    <div className="section-face wall left-face"></div>
                    <div className="section-face wall right-face"></div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="references-box">
          <h4>REFERENCIAS</h4>
          <ul>
            <li>ASC: Ascensor</li>
            <li>ESC: Escalera</li>
            <li>SYS: Sistema</li>
            <li>H2O: Agua</li>
            <li>AIRE: Ventilación</li>
          </ul>
        </div>
        <div className="compass">
            <div className="compass-inner">
                <div className="compass-arrow compass-north"></div><div className="compass-arrow compass-east"></div>
                <div className="compass-arrow compass-south"></div><div className="compass-arrow compass-west"></div>
                <div className="compass-label compass-n">N</div><div className="compass-label compass-e">E</div>
                <div className="compass-label compass-s">S</div><div className="compass-label compass-w">O</div>
            </div>
        </div>
        <div className="instructions">
          <p>HAGA CLIC EN CUALQUIER SECCIÓN PARA VER DETALLES</p>
          <p className="security-note">DISEÑO PREPARADO PARA BRIEFING DE SEGURIDAD NIVEL 4</p>
        </div>
      </div>

      {showModal && <Modal />}

      {!animationComplete && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-title">CARGANDO ESQUEMÁTICO 3D</div>
            <div className="loading-bars">
              {Array.from({ length: bunkerLevels.length }).map((_, i) => (
                <div
                  key={`loader-${i}`}
                  className={`loading-bar ${showLevels.length > i ? 'loaded' : ''}`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                ></div>
              ))}
            </div>
            <div className="loading-progress">{showLevels.length}/{bunkerLevels.length} NIVELES CARGADOS</div>
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
