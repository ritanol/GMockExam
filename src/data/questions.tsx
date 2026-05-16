import type { ReactNode } from "react";
import {
  CircleDiagram,
  CoordinatePlaneDiagram,
  RightTriangleTrigDiagram,
  SimilarityDiagram,
  SolidDiagram,
  TransformationDiagram,
} from "../components/GeometryDiagrams";

export type GeometryStandard =
  | "Congruence"
  | "Similarity"
  | "Transformations"
  | "Circles"
  | "Right Triangle Trigonometry"
  | "Coordinate Geometry"
  | "Area, Surface Area, and Volume"
  | "Proofs and Reasoning";

export type Question = {
  id: number;
  question: string;
  choices: string[];
  answer: number;
  standard: GeometryStandard;
  diagram?: ReactNode;
};

function makeChoices(correct: string, distractors: string[]) {
  return [distractors[0], correct, distractors[1], distractors[2]];
}

function math(value: string | number) {
  return `\\(${value}\\)`;
}

function coordinate(x: number, y: number) {
  return `\\(\\left(${x}, ${y}\\right)\\)`;
}

function piUnits(coefficient: number, units: string) {
  return `\\(${coefficient}\\pi\\) ${units}`;
}

const similarityConfigs = [
  [8, 15, 4, "7.5"],
  [12, 21, 8, "14"],
  [10, 18, 15, "27"],
  [6, 14, 9, "21"],
  [9, 16, 27, "48"],
  [5, 13, 20, "52"],
] as const;

const trigConfigs = [
  [35, 14, undefined, "x", "\\sin 35^\\circ = \\frac{14}{x}"],
  [62, 18, undefined, "x", "\\sin 62^\\circ = \\frac{18}{x}"],
  [28, undefined, "x", 32, "\\cos 28^\\circ = \\frac{x}{32}"],
  [47, 11, "x", undefined, "\\tan 47^\\circ = \\frac{11}{x}"],
  [53, "x", undefined, 20, "\\sin 53^\\circ = \\frac{x}{20}"],
  [41, undefined, "x", 16, "\\cos 41^\\circ = \\frac{x}{16}"],
] as const;

const coordinateConfigs = [
  [[2, 3], [6, 11], "2"],
  [[-4, 2], [6, 2], "(1, 2)"],
  [[-3, -1], [5, 7], "1"],
  [[1, -5], [7, 4], "3/2"],
  [[-6, 4], [2, -4], "-1"],
  [[3, 8], [3, -2], "undefined"],
] as const;

const cylinderConfigs = [
  [5, 9, 225],
  [4, 12, 192],
  [7, 6, 294],
  [3, 15, 135],
] as const;

const prismConfigs = [
  [8, 3, 5, 120],
  [10, 4, 6, 240],
  [7, 5, 9, 315],
  [12, 2, 8, 192],
] as const;

const circleConfigs = [
  [10, 100],
  [6, 36],
  [12, 144],
  [9, 81],
  [15, 225],
] as const;

const generatedQuestions: Question[] = [
  ...similarityConfigs.map(([sideA, sideB, correspondingA, answer], index) => ({
    id: index + 1,
    standard: "Similarity" as const,
    question: `Triangle \\(ABC\\) is similar to triangle \\(DEF\\). A side of length \\(${sideA}\\) corresponds to a side of length \\(${correspondingA}\\). If another side of triangle \\(ABC\\) is \\(${sideB}\\), what is the corresponding side length in triangle \\(DEF\\)?`,
    choices: makeChoices(math(answer), [
      math(Number(answer) + 4),
      math(Math.max(1, Number(answer) - 3)),
      math(sideB * correspondingA),
    ]),
    answer: 1,
    diagram: <SimilarityDiagram sideA={sideA} sideB={sideB} correspondingA={correspondingA} />,
  })),
  ...circleConfigs.map(([radius, answer], index) => ({
    id: index + 7,
    standard: "Circles" as const,
    question: `What is the area of a circle with radius \\(${radius}\\) units?`,
    choices: makeChoices(piUnits(answer, "square units"), [
      piUnits(radius * 2, "square units"),
      piUnits(radius, "square units"),
      piUnits(radius * radius * 2, "square units"),
    ]),
    answer: 1,
    diagram: <CircleDiagram radius={radius} />,
  })),
  {
    id: 12,
    standard: "Circles",
    question: "A central angle of \\(90^\\circ\\) intercepts an arc of a circle. What fraction of the full circumference is the arc length?",
    choices: [math("\\frac{1}{2}"), math("\\frac{1}{4}"), math("\\frac{1}{8}"), math("\\frac{3}{4}")],
    answer: 1,
    diagram: <CircleDiagram centralAngle={90} />,
  },
  {
    id: 13,
    standard: "Circles",
    question: "A central angle of \\(120^\\circ\\) intercepts an arc. What fraction of the circle is the arc?",
    choices: [math("\\frac{1}{4}"), math("\\frac{1}{3}"), math("\\frac{1}{2}"), math("\\frac{2}{3}")],
    answer: 1,
    diagram: <CircleDiagram centralAngle={120} />,
  },
  ...trigConfigs.map(([angle, opposite, adjacent, hypotenuse, answer], index) => ({
    id: index + 14,
    standard: "Right Triangle Trigonometry" as const,
    question: `In a right triangle, use the \\(${angle}^\\circ\\) angle and the labeled sides to choose the equation that could be used to solve for \\(x\\).`,
    choices: makeChoices(math(answer), [
      math(`\\sin ${angle}^\\circ = \\frac{x}{14}`),
      math(`\\cos ${angle}^\\circ = \\frac{14}{x}`),
      math(`\\tan ${angle}^\\circ = \\frac{x}{20}`),
    ]),
    answer: 1,
    diagram: (
      <RightTriangleTrigDiagram
        angle={angle}
        opposite={opposite}
        adjacent={adjacent}
        hypotenuse={hypotenuse}
      />
    ),
  })),
  ...coordinateConfigs.map(([[x1, y1], [x2, y2], answer], index) => ({
    id: index + 20,
    standard: "Coordinate Geometry" as const,
    question:
      index === 1
        ? `The endpoints of a diameter of a circle are ${coordinate(x1, y1)} and ${coordinate(x2, y2)}. What is the center of the circle?`
        : `What is the slope of the line through ${coordinate(x1, y1)} and ${coordinate(x2, y2)}?`,
    choices:
      index === 1
        ? [coordinate(2, 1), coordinate(1, 2), coordinate(5, 0), coordinate(-1, 2)]
        : makeChoices(math(answer === "3/2" ? "\\frac{3}{2}" : answer), answer === "2" ? [math(0), math(1), math(-2)] : [math(0), math(2), math(-2)]),
    answer: 1,
    diagram: (
      <CoordinatePlaneDiagram
        points={[
          { x: x1, y: y1, label: `A(${x1}, ${y1})` },
          { x: x2, y: y2, label: `B(${x2}, ${y2})` },
        ]}
        xRange={[-8, 8]}
        yRange={[-8, 12]}
      />
    ),
  })),
  {
    id: 26,
    standard: "Transformations",
    question: "Which transformation changes the size of a figure while preserving angle measures?",
    choices: ["Reflection", "Dilation", "Translation", "Rotation"],
    answer: 1,
    diagram: <TransformationDiagram type="dilation" />,
  },
  {
    id: 27,
    standard: "Transformations",
    question: "A triangle is reflected across a vertical line. Which statement must be true about the image?",
    choices: ["It is larger.", "It is congruent to the original.", "Its perimeter doubles.", "It is always in Quadrant I."],
    answer: 1,
    diagram: <TransformationDiagram type="reflection" />,
  },
  {
    id: 28,
    standard: "Transformations",
    question: "Triangle \\(RST\\) is translated \\(5\\) units right and \\(3\\) units down. What is true about triangle \\(R'S'T'\\)?",
    choices: ["It is similar but not congruent.", "It is congruent to triangle \\(RST\\).", "Its side lengths increase by \\(8\\).", "Its angles double."],
    answer: 1,
    diagram: <TransformationDiagram type="translation" preimageLabel="RST" imageLabel="R'S'T'" />,
  },
  {
    id: 29,
    standard: "Transformations",
    question: "A rotation is performed around a fixed point. Which measurement is preserved?",
    choices: ["Only area", "Side length and angle measure", "Only orientation", "Distance from the x-axis"],
    answer: 1,
    diagram: <TransformationDiagram type="rotation" />,
  },
  {
    id: 30,
    standard: "Transformations",
    question: "A dilation with scale factor \\(3\\) is applied to a triangle. What happens to each side length?",
    choices: ["It is divided by \\(3\\).", "It is multiplied by \\(3\\).", "It stays the same.", "It is increased by \\(3\\) units."],
    answer: 1,
    diagram: <TransformationDiagram type="dilation" />,
  },
  ...cylinderConfigs.map(([radius, height, answer], index) => ({
    id: index + 31,
    standard: "Area, Surface Area, and Volume" as const,
    question: `What is the volume of a cylinder with radius \\(${radius}\\) units and height \\(${height}\\) units?`,
    choices: makeChoices(piUnits(answer, "cubic units"), [
      piUnits(radius * height, "cubic units"),
      piUnits(radius * radius + height, "cubic units"),
      piUnits(2 * radius * height, "cubic units"),
    ]),
    answer: 1,
    diagram: <SolidDiagram shape="cylinder" radius={radius} height={height} />,
  })),
  ...prismConfigs.map(([length, width, height, answer], index) => ({
    id: index + 35,
    standard: "Area, Surface Area, and Volume" as const,
    question: `A rectangular prism has length \\(${length}\\), width \\(${width}\\), and height \\(${height}\\). What is its volume?`,
    choices: makeChoices(math(answer) + " cubic units", [
      math(length + width + height) + " cubic units",
      math(2 * (length + width + height)) + " cubic units",
      math(length * width) + " cubic units",
    ]),
    answer: 1,
    diagram: <SolidDiagram shape="rectangular-prism" length={length} width={width} height={height} />,
  })),
  {
    id: 39,
    standard: "Congruence",
    question: "Two triangles have two pairs of corresponding sides congruent and the included angles congruent. Which theorem proves the triangles are congruent?",
    choices: [math("AAA"), math("SAS"), math("SSA"), math("SSS")],
    answer: 1,
    diagram: <SimilarityDiagram sideA={9} sideB={12} correspondingA={9} unknownLabel="12" />,
  },
  {
    id: 40,
    standard: "Congruence",
    question: "Which condition is sufficient to prove two triangles congruent?",
    choices: [math("AAA"), math("SSS"), math("SS"), math("A")],
    answer: 1,
  },
  {
    id: 41,
    standard: "Congruence",
    question: "If two figures are congruent, which statement must be true?",
    choices: ["They have different areas.", "Corresponding sides and angles are equal.", "They are different sizes.", "Only their angles match."],
    answer: 1,
  },
  {
    id: 42,
    standard: "Congruence",
    question: "A rigid motion maps triangle \\(ABC\\) onto triangle \\(DEF\\). What conclusion can be made?",
    choices: ["The triangles are similar only.", "The triangles are congruent.", "The image is larger.", "The angle measures changed."],
    answer: 1,
    diagram: <TransformationDiagram type="translation" preimageLabel="ABC" imageLabel="DEF" />,
  },
  {
    id: 43,
    standard: "Proofs and Reasoning",
    question: "Lines \\(p\\) and \\(q\\) are parallel. A transversal creates alternate interior angles measuring \\(3x + 12\\) and \\(5x - 18\\) degrees. What is \\(x\\)?",
    choices: [math(9), math(15), math(24), math(30)],
    answer: 1,
  },
  {
    id: 44,
    standard: "Proofs and Reasoning",
    question: "Which statement is the converse of: If a quadrilateral is a rectangle, then it has four right angles?",
    choices: [
      "If it is not a rectangle, it has no right angles.",
      "If a quadrilateral has four right angles, then it is a rectangle.",
      "If it is a rectangle, then it has no right angles.",
      "If it has no right angles, then it is a rectangle.",
    ],
    answer: 1,
  },
  {
    id: 45,
    standard: "Proofs and Reasoning",
    question: "Which reason justifies the statement: \\(\\angle A \\cong \\angle A\\)?",
    choices: ["Transitive Property", "Reflexive Property", "Substitution Property", "Triangle Sum Theorem"],
    answer: 1,
  },
  {
    id: 46,
    standard: "Proofs and Reasoning",
    question: "If two angles form a linear pair, what must be true?",
    choices: ["They are congruent.", "They are supplementary.", "They are complementary.", "They are vertical angles."],
    answer: 1,
  },
  {
    id: 47,
    standard: "Similarity",
    question: "A scale drawing uses \\(1\\) inch to represent \\(6\\) feet. If a room is \\(4.5\\) inches long on the drawing, how long is the actual room?",
    choices: [math(10.5) + " feet", math(27) + " feet", math(24) + " feet", math(36) + " feet"],
    answer: 1,
  },
  {
    id: 48,
    standard: "Coordinate Geometry",
    question: "A line has slope \\(-2\\) and passes through \\(\\left(0, 5\\right)\\). Which equation represents the line?",
    choices: [math("y = 2x + 5"), math("y = -2x + 5"), math("y = 5x - 2"), math("y = -2x - 5")],
    answer: 1,
  },
  {
    id: 49,
    standard: "Area, Surface Area, and Volume",
    question: "A triangle has base \\(18\\) units and height \\(7\\) units. What is its area?",
    choices: [math(25) + " square units", math(63) + " square units", math(126) + " square units", math(252) + " square units"],
    answer: 1,
  },
  {
    id: 50,
    standard: "Circles",
    question: "A chord is drawn in a circle. Which statement is always true about the perpendicular from the center of the circle to the chord?",
    choices: ["It doubles the chord.", "It bisects the chord.", "It is tangent to the circle.", "It creates a diameter parallel to the chord."],
    answer: 1,
    diagram: <CircleDiagram chord="chord" />,
  },
];

export const baseQuestions: Question[] = generatedQuestions;
