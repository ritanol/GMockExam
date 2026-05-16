import type { ReactNode } from "react";

type DiagramFrameProps = {
  title?: string;
  children: ReactNode;
};

type Point = {
  x: number;
  y: number;
  label?: string;
};

type LabelProps = {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
};

const axisColor = "#111827";
const gridColor = "#d9e2ec";
const blue = "#2563eb";
const green = "#059669";
const amber = "#d97706";

function SvgLabel({ x, y, children, anchor = "middle" }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fill="#111827"
      stroke="#ffffff"
      strokeWidth="5"
      paintOrder="stroke"
      className="text-[13px] font-semibold"
    >
      {children}
    </text>
  );
}

function MutedLabel({ x, y, children, anchor = "middle" }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fill="#334155"
      className="text-[12px] font-medium"
    >
      {children}
    </text>
  );
}

export function DiagramFrame({ title = "Geometry Diagram", children }: DiagramFrameProps) {
  return (
    <div className="mt-8 rounded-md border border-[#c8d1dc] bg-white p-5 shadow-sm">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#53657d]">
        {title}
      </div>
      <div className="min-h-[260px] rounded-sm bg-[#f8fafc]">{children}</div>
    </div>
  );
}

export function SimilarityDiagram({
  sideA,
  sideB,
  correspondingA,
  unknownLabel = "x",
}: {
  sideA: number;
  sideB: number;
  correspondingA: number;
  unknownLabel?: string;
}) {
  return (
    <svg viewBox="0 0 460 280" className="h-full w-full" role="img">
      <polygon points="58,222 216,222 156,40" fill="#dbeafe" stroke={blue} strokeWidth="4" />
      <polygon points="284,222 400,222 362,76" fill="#dcfce7" stroke={green} strokeWidth="4" />
      <SvgLabel x={91} y={132} anchor="end">{sideA}</SvgLabel>
      <SvgLabel x={197} y={126} anchor="start">{sideB}</SvgLabel>
      <SvgLabel x={319} y={147} anchor="end">{correspondingA}</SvgLabel>
      <SvgLabel x={390} y={137} anchor="start">{unknownLabel}</SvgLabel>
      <MutedLabel x={137} y={246}>Triangle A</MutedLabel>
      <MutedLabel x={342} y={246}>Triangle B</MutedLabel>
    </svg>
  );
}

export function RightTriangleTrigDiagram({
  angle,
  opposite,
  adjacent,
  hypotenuse,
  unknown = "x",
}: {
  angle: number;
  opposite?: string | number;
  adjacent?: string | number;
  hypotenuse?: string | number;
  unknown?: string;
}) {
  return (
    <svg viewBox="0 0 460 280" className="h-full w-full" role="img">
      <polygon points="72,224 356,224 356,58" fill="#dbeafe" stroke={blue} strokeWidth="4" />
      <path d="M334 224 L334 202 L356 202" fill="none" stroke={axisColor} strokeWidth="3" />
      <path d="M108 224 A36 36 0 0 1 132 190" fill="none" stroke={amber} strokeWidth="3" />
      <SvgLabel x={133} y={211}>{angle} deg</SvgLabel>
      <SvgLabel x={214} y={246}>{adjacent ?? unknown}</SvgLabel>
      <SvgLabel x={378} y={142} anchor="start">{opposite ?? unknown}</SvgLabel>
      <SvgLabel x={206} y={121}>{hypotenuse ?? "hypotenuse"}</SvgLabel>
    </svg>
  );
}

export function CircleDiagram({
  radius,
  chord,
  centralAngle,
}: {
  radius?: number;
  chord?: string;
  centralAngle?: number;
}) {
  return (
    <svg viewBox="0 0 380 280" className="h-full w-full" role="img">
      <circle cx="190" cy="140" r="88" fill="#dbeafe" stroke={blue} strokeWidth="4" />
      <circle cx="190" cy="140" r="4" fill={axisColor} />
      {radius !== undefined && (
        <>
          <line x1="190" y1="140" x2="278" y2="140" stroke={green} strokeWidth="4" />
          <SvgLabel x={236} y={122}>r = {radius}</SvgLabel>
        </>
      )}
      {chord && (
        <>
          <line x1="118" y1="86" x2="262" y2="194" stroke={amber} strokeWidth="4" />
          <SvgLabel x={207} y={83}>{chord}</SvgLabel>
        </>
      )}
      {centralAngle !== undefined && (
        <>
          <line x1="190" y1="140" x2="240" y2="66" stroke={green} strokeWidth="3" />
          <line x1="190" y1="140" x2="278" y2="140" stroke={green} strokeWidth="3" />
          <path d="M222 140 A32 32 0 0 0 208 113" fill="none" stroke={amber} strokeWidth="3" />
          <SvgLabel x={229} y={111}>{centralAngle} deg</SvgLabel>
        </>
      )}
    </svg>
  );
}

export function CoordinatePlaneDiagram({
  points,
  connect = true,
  xRange = [-6, 6],
  yRange = [-5, 5],
}: {
  points: Point[];
  connect?: boolean;
  xRange?: [number, number];
  yRange?: [number, number];
}) {
  const width = 460;
  const height = 310;
  const margin = 36;
  const plotWidth = width - margin * 2;
  const plotHeight = height - margin * 2;
  const sx = (x: number) => margin + ((x - xRange[0]) / (xRange[1] - xRange[0])) * plotWidth;
  const sy = (y: number) => margin + ((yRange[1] - y) / (yRange[1] - yRange[0])) * plotHeight;
  const path = points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img">
      {Array.from({ length: xRange[1] - xRange[0] + 1 }, (_, i) => xRange[0] + i).map((x) => (
        <line key={`x-${x}`} x1={sx(x)} y1={margin} x2={sx(x)} y2={height - margin} stroke={gridColor} />
      ))}
      {Array.from({ length: yRange[1] - yRange[0] + 1 }, (_, i) => yRange[0] + i).map((y) => (
        <line key={`y-${y}`} x1={margin} y1={sy(y)} x2={width - margin} y2={sy(y)} stroke={gridColor} />
      ))}
      <line x1={sx(0)} y1={margin} x2={sx(0)} y2={height - margin} stroke={axisColor} strokeWidth="2" />
      <line x1={margin} y1={sy(0)} x2={width - margin} y2={sy(0)} stroke={axisColor} strokeWidth="2" />
      {connect && points.length > 1 && <polyline points={path} fill="none" stroke={blue} strokeWidth="4" />}
      {points.map((point, index) => (
        <g key={`${point.x}-${point.y}-${point.label}`}>
          <circle cx={sx(point.x)} cy={sy(point.y)} r="5" fill={green} />
          <SvgLabel
            x={sx(point.x) + (index % 2 === 0 ? 10 : -10)}
            y={sy(point.y) - 14}
            anchor={index % 2 === 0 ? "start" : "end"}
          >
            {point.label ?? `(${point.x}, ${point.y})`}
          </SvgLabel>
        </g>
      ))}
    </svg>
  );
}

export function TransformationDiagram({
  type,
  preimageLabel = "A",
  imageLabel = "A'",
}: {
  type: "translation" | "reflection" | "rotation" | "dilation";
  preimageLabel?: string;
  imageLabel?: string;
}) {
  const imagePoints = {
    translation: "250,190 338,190 310,92",
    reflection: "250,76 338,76 310,174",
    rotation: "250,190 334,148 260,86",
    dilation: "235,226 398,226 346,42",
  }[type];

  return (
    <svg viewBox="0 0 460 280" className="h-full w-full" role="img">
      <line x1="230" y1="30" x2="230" y2="244" stroke="#94a3b8" strokeDasharray="7 7" />
      <polygon points="72,190 144,190 120,108" fill="#dbeafe" stroke={blue} strokeWidth="4" />
      <polygon points={imagePoints} fill="#dcfce7" stroke={green} strokeWidth="4" />
      <SvgLabel x={108} y={216}>{preimageLabel}</SvgLabel>
      <SvgLabel x={322} y={216}>{imageLabel}</SvgLabel>
      <MutedLabel x={230} y={20}>
        {type === "reflection" ? "line of reflection" : type}
      </MutedLabel>
    </svg>
  );
}

export function SolidDiagram({
  shape,
  radius,
  height,
  length,
  width,
}: {
  shape: "cylinder" | "rectangular-prism";
  radius?: number;
  height: number;
  length?: number;
  width?: number;
}) {
  if (shape === "rectangular-prism") {
    return (
      <svg viewBox="0 0 420 300" className="h-full w-full" role="img">
        <polygon points="92,100 270,100 330,52 152,52" fill="#dbeafe" stroke={blue} strokeWidth="4" />
        <polygon points="270,100 330,52 330,198 270,246" fill="#dcfce7" stroke={green} strokeWidth="4" />
        <polygon points="92,100 270,100 270,246 92,246" fill="#eff6ff" stroke={blue} strokeWidth="4" />
        <line x1="92" y1="246" x2="152" y2="198" stroke="#94a3b8" strokeWidth="3" />
        <line x1="152" y1="52" x2="152" y2="198" stroke="#94a3b8" strokeWidth="3" />
        <line x1="152" y1="198" x2="330" y2="198" stroke="#94a3b8" strokeWidth="3" />
        <SvgLabel x={172} y={268}>l = {length}</SvgLabel>
        <SvgLabel x={346} y={132} anchor="start">w = {width}</SvgLabel>
        <SvgLabel x={66} y={172} anchor="end">h = {height}</SvgLabel>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 380 310" className="h-full w-full" role="img">
      <ellipse cx="190" cy="68" rx="82" ry="28" fill="#dbeafe" stroke={blue} strokeWidth="4" />
      <ellipse cx="190" cy="242" rx="82" ry="28" fill="#eff6ff" stroke={blue} strokeWidth="4" />
      <line x1="108" y1="68" x2="108" y2="242" stroke={blue} strokeWidth="4" />
      <line x1="272" y1="68" x2="272" y2="242" stroke={blue} strokeWidth="4" />
      <line x1="190" y1="68" x2="272" y2="68" stroke={green} strokeWidth="4" />
      <SvgLabel x={292} y={156} anchor="start">h = {height}</SvgLabel>
      <SvgLabel x={232} y={48}>r = {radius}</SvgLabel>
    </svg>
  );
}
