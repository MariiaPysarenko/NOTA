import { useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import SheetMusicRenderer from "../components/SheetMusicRenderer";
import { linkAnnotationToMeasure } from "../utils/annotationLinking";
import { ROUTES } from "../navigation/routes";

const TOOLS = {
  PEN: "pen",
  HIGHLIGHTER: "highlighter",
  ERASER: "eraser",
};

function makeAnnotation({ points, tool, color, size, userId, sheetId, linked }) {
  return {
    id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    user_id: userId,
    sheet_id: sheetId,
    type: tool,
    color,
    size,
    points,
    created_at: new Date().toISOString(),
    ...linked,
  };
}

export default function SheetEditorScreen() {
  const { digitizedNotes, pieceMeta, annotationsBySheet, setAnnotationsForSheet, user, navigate, showToast } =
    useApp();
  const canvasRef = useRef(null);
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState("#ff7a00");
  const [size, setSize] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const annotations = annotationsBySheet[pieceMeta.id] || [];

  const sheetAnnotations = useMemo(() => annotations, [annotations]);

  const pushAnnotation = (ann) => {
    setAnnotationsForSheet(pieceMeta.id, [...sheetAnnotations, ann]);
    setRedoStack([]);
  };

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom };
  };

  const onPointerDown = (e) => {
    setIsDrawing(true);
    setPath([getPoint(e)]);
  };

  const onPointerMove = (e) => {
    if (!isDrawing) return;
    setPath((prev) => [...prev, getPoint(e)]);
  };

  const onPointerUp = () => {
    if (!isDrawing || path.length < 2) {
      setIsDrawing(false);
      return;
    }
    const linked = linkAnnotationToMeasure({ points: path }, digitizedNotes);
    const annotation = makeAnnotation({
      points: path,
      tool,
      color,
      size,
      userId: user?.id ?? "demo-user",
      sheetId: pieceMeta.id,
      linked,
    });
    pushAnnotation(annotation);
    setPath([]);
    setIsDrawing(false);
  };

  const undo = () => {
    if (!sheetAnnotations.length) return;
    const next = sheetAnnotations.slice(0, -1);
    setRedoStack((r) => [sheetAnnotations[sheetAnnotations.length - 1], ...r]);
    setAnnotationsForSheet(pieceMeta.id, next);
  };

  const redo = () => {
    if (!redoStack.length) return;
    const [head, ...rest] = redoStack;
    setRedoStack(rest);
    setAnnotationsForSheet(pieceMeta.id, [...sheetAnnotations, head]);
  };

  const clearAll = () => {
    setAnnotationsForSheet(pieceMeta.id, []);
    setRedoStack([]);
  };

  const fitToScreen = () => setZoom(1);

  return (
    <main className="screen sheet-editor-screen">
      <section className="hero small">
        <h1>
          Sheet <span>Editor</span>
        </h1>
        <p>Draw and mark directly on top of the digital sheet.</p>
      </section>

      <section className="digital-sheet-card drawing-surface">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
          <SheetMusicRenderer notes={digitizedNotes} width={330} height={180} />
          <svg
            ref={canvasRef}
            className="annotation-canvas"
            viewBox="0 0 330 180"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {sheetAnnotations.map((ann) => (
              <polyline
                key={ann.id}
                points={ann.points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={ann.type === TOOLS.ERASER ? "#0d0d0d" : ann.color}
                strokeWidth={ann.size}
                opacity={ann.type === TOOLS.HIGHLIGHTER ? 0.45 : 1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {path.length > 1 && (
              <polyline
                points={path.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={tool === TOOLS.ERASER ? "#0d0d0d" : color}
                strokeWidth={size}
                opacity={tool === TOOLS.HIGHLIGHTER ? 0.45 : 1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>
      </section>

      <section className="editor-tools">
        <div className="chips">
          {Object.values(TOOLS).map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${tool === t ? "active" : ""}`}
              onClick={() => setTool(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="tool-grid">
          <label>
            Color
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <label>
            Brush
            <input
              type="range"
              min={1}
              max={16}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Zoom
            <input
              type="range"
              min={0.7}
              max={2}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
          </label>
        </div>

        <div className="editor-toolbar">
          <button type="button" className="secondary small-btn" onClick={undo}>
            Undo
          </button>
          <button type="button" className="secondary small-btn" onClick={redo}>
            Redo
          </button>
          <button type="button" className="secondary small-btn" onClick={clearAll}>
            Clear
          </button>
          <button type="button" className="secondary small-btn" onClick={fitToScreen}>
            Fit
          </button>
        </div>
      </section>

      <button
        type="button"
        className="primary"
        onClick={() => {
          showToast("Annotations saved");
          navigate(ROUTES.PRACTICE);
        }}
      >
        Save & Return
      </button>
    </main>
  );
}
