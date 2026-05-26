import { useRef, useState } from "react";
import { useApp } from "../store/useNotaStore";
import SheetMusicRenderer from "../components/SheetMusicRenderer";
import { linkAnnotationToMeasure } from "../utils/annotationLinking";
import { ROUTES } from "../navigation/routes";

const TOOLS = { PEN: "pen", HIGHLIGHTER: "highlighter", ERASER: "eraser" };
const SHEET_W = 330;
const SHEET_H = 180;

function makeAnnotation({ points, tool, color, size, sheetId, linked }) {
  return {
    id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
  const { digitizedNotes, pieceMeta, annotationsBySheet, setAnnotationsForSheet, navigate, showToast } =
    useApp();
  const surfaceRef = useRef(null);
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState("#ff7a00");
  const [size, setSize] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const annotations = annotationsBySheet[pieceMeta.id] || [];

  const commitHistory = (next) => {
    setHistory((h) => [...h, annotations]);
    setAnnotationsForSheet(pieceMeta.id, next);
    setRedoStack([]);
  };

  /** Map pointer to fixed viewBox coordinates (zoom-stable) */
  const getPoint = (e) => {
    const svg = surfaceRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * SHEET_W;
    const y = ((e.clientY - rect.top) / rect.height) * SHEET_H;
    return { x, y };
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
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
      setPath([]);
      return;
    }
    const linked = linkAnnotationToMeasure({ points: path }, digitizedNotes, SHEET_W);
    const annotation = makeAnnotation({
      points: path,
      tool,
      color,
      size,
      sheetId: pieceMeta.id,
      linked,
    });
    commitHistory([...annotations, annotation]);
    setPath([]);
    setIsDrawing(false);
  };

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [annotations, ...r]);
    setHistory((h) => h.slice(0, -1));
    setAnnotationsForSheet(pieceMeta.id, prev);
  };

  const redo = () => {
    if (!redoStack.length) return;
    const [next, ...rest] = redoStack;
    setHistory((h) => [...h, annotations]);
    setRedoStack(rest);
    setAnnotationsForSheet(pieceMeta.id, next);
  };

  const clearAll = () => {
    commitHistory([]);
    setHistory([]);
    setRedoStack([]);
  };

  return (
    <main className="screen sheet-editor-screen">
      <section className="hero small">
        <h1>
          Sheet <span>Editor</span>
        </h1>
        <p>Draw markings aligned to your digital notes.</p>
      </section>

      <section className="digital-sheet-card drawing-surface glass-card">
        <div
          className="editor-zoom-surface"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          <SheetMusicRenderer notes={digitizedNotes} width={SHEET_W} height={SHEET_H} />
          <svg
            ref={surfaceRef}
            className="annotation-canvas"
            viewBox={`0 0 ${SHEET_W} ${SHEET_H}`}
            preserveAspectRatio="xMidYMid meet"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {annotations.map((ann) => (
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

      <section className="editor-tools glass-card">
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
              max={12}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Zoom
            <input
              type="range"
              min={0.8}
              max={1.6}
              step={0.05}
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
          <button type="button" className="secondary small-btn" onClick={() => setZoom(1)}>
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
