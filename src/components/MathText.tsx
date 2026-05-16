import katex from "katex";
import "katex/dist/katex.min.css";

type MathTextProps = {
  children: string;
  className?: string;
};

type Segment = {
  content: string;
  isMath: boolean;
  displayMode: boolean;
};

const mathPattern = /(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;

function parseSegments(value: string): Segment[] {
  return value.split(mathPattern).filter(Boolean).map((segment) => {
    const isInlineMath = segment.startsWith("\\(") && segment.endsWith("\\)");
    const isDisplayMath = segment.startsWith("\\[") && segment.endsWith("\\]");

    if (!isInlineMath && !isDisplayMath) {
      return { content: segment, isMath: false, displayMode: false };
    }

    return {
      content: segment.slice(2, -2),
      isMath: true,
      displayMode: isDisplayMath,
    };
  });
}

export function MathText({ children, className }: MathTextProps) {
  const segments = parseSegments(children);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (!segment.isMath) {
          return <span key={index}>{segment.content}</span>;
        }

        let html: string;

        try {
          html = katex.renderToString(segment.content, {
            displayMode: segment.displayMode,
            throwOnError: false,
            strict: false,
          });
        } catch {
          html = segment.content;
        }

        return (
          <span
            key={index}
            className={segment.displayMode ? "my-3 block" : "inline-block align-baseline"}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}
