export default function AnnotationLayer({ annotations = [] }) {
  if (!annotations.length) return null;
  return (
    <svg className="annotation-canvas readonly" viewBox="0 0 330 180">
      {annotations.map((ann) => (
        <polyline
          key={ann.id}
          points={ann.points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={ann.type === "eraser" ? "#0d0d0d" : ann.color}
          strokeWidth={ann.size}
          opacity={ann.type === "highlighter" ? 0.45 : 1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
