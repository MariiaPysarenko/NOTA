import { useRef, useState } from "react";
import AnnotationLayer from "./AnnotationLayer";

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 1400;

export default function SheetImageViewer({
  asset,
  annotations = [],
  showAnnotations = true,
  editable = false,
  tool = "pen",
  color = "#ff7a00",
  size = 3,
  currentPath = [],
  onPathChange,
  onPathComplete,
  className = "",
}) {
  const surfaceRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!asset?.dataUrl) return null;

  const getPoint = (e) => {
    const svg = surfaceRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT;
    return { x, y };
  };

  const onPointerDown = (e) => {
    if (!editable) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    onPathChange?.([getPoint(e)]);
  };

  const onPointerMove = (e) => {
    if (!editable || !isDrawing) return;
    onPathChange?.([...(currentPath || []), getPoint(e)]);
  };

  const onPointerUp = () => {
    if (!editable) return;
    setIsDrawing(false);
    onPathComplete?.(currentPath || []);
  };

  return (
    <div className={`sheet-image-viewer ${className}`}>
      {asset.mimeType === "application/pdf" ? (
        <iframe title={asset.fileName || "Uploaded sheet PDF"} src={asset.dataUrl} className="sheet-image" />
      ) : (
        <img src={asset.dataUrl} alt={asset.fileName || "Uploaded sheet"} className="sheet-image" />
      )}
      {(showAnnotations || editable) && (
        <svg
          ref={surfaceRef}
          className={`annotation-canvas ${editable ? "editable" : "readonly"}`}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {showAnnotations && <AnnotationLayer annotations={annotations} embedded />}
          {editable && currentPath?.length > 1 && (
            <polyline
              points={currentPath.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={tool === "eraser" ? "#0d0d0d" : color}
              strokeWidth={size}
              opacity={tool === "highlighter" ? 0.45 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      )}
    </div>
  );
}
