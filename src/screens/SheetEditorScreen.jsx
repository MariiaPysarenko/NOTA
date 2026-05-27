import { useMemo, useState } from "react";
import { useApp } from "../store/useNotaStore";
import SheetMusicRenderer from "../components/SheetMusicRenderer";
import SheetImageViewer from "../components/SheetImageViewer";
import { ROUTES } from "../navigation/routes";

const TOOLS = { PEN: "pen", HIGHLIGHTER: "highlighter", ERASER: "eraser" };

function makeAnnotation({ points, tool, color, size, sheetId }) {
  return {
    id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    sheet_id: sheetId,
    type: tool,
    color,
    size,
    points,
    created_at: new Date().toISOString(),
  };
}

export default function SheetEditorScreen() {
  const {
    digitizedNotes,
    pieceMeta,
    annotationsBySheet,
    sheetAssetsById,
    setAnnotationsForSheet,
    navigate,
    showToast,
  } = useApp();
  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState("#ff7a00");
  const [size, setSize] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [path, setPath] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showAnnotations, setShowAnnotations] = useState(true);

  const annotations = annotationsBySheet[pieceMeta.id] || [];
  const activeAsset = sheetAssetsById[pieceMeta.id] || null;
  const hasImageSheet = Boolean(activeAsset?.dataUrl);
  const canDraw = hasImageSheet || digitizedNotes.length > 0;

  const commitHistory = (next) => {
    setHistory((h) => [...h, annotations]);
    setAnnotationsForSheet(pieceMeta.id, next);
    setRedoStack([]);
  };

  const commitPath = (nextPath) => {
    if (nextPath.length < 2) {
      setPath([]);
      return;
    }
    const annotation = makeAnnotation({
      points: nextPath,
      tool,
      color,
      size,
      sheetId: pieceMeta.id,
    });
    commitHistory([...annotations, annotation]);
    setPath([]);
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

  const drawingSurface = useMemo(() => {
    if (hasImageSheet) {
      return (
        <SheetImageViewer
          asset={activeAsset}
          annotations={annotations}
          editable
          showAnnotations={showAnnotations}
          tool={tool}
          color={color}
          size={size}
          currentPath={path}
          onPathChange={setPath}
          onPathComplete={commitPath}
        />
      );
    }

    if (!digitizedNotes.length) return null;
    return (
      <div className="editor-zoom-surface sheet-layer-wrap">
        <SheetMusicRenderer notes={digitizedNotes} width={330} height={220} />
      </div>
    );
  }, [
    activeAsset,
    annotations,
    commitPath,
    color,
    digitizedNotes,
    hasImageSheet,
    path,
    showAnnotations,
    size,
    tool,
  ]);

  return (
    <main className="screen sheet-editor-screen">
      <section className="hero small">
        <h1>
          Sheet <span>Editor</span>
        </h1>
        <p>{hasImageSheet ? "Draw directly on your uploaded sheet." : "Draw markings on your score."}</p>
      </section>

      {canDraw ? (
        <section className="digital-sheet-card drawing-surface glass-card">
          <div
            className="editor-zoom-surface"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          >
            {drawingSurface}
          </div>
        </section>
      ) : (
        <section className="digital-sheet-card drawing-surface glass-card">
          <p className="muted">Upload a sheet first to start annotating.</p>
        </section>
      )}

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
              max={1.8}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
          </label>
          <label className="toggle-row">
            <span>Show annotations</span>
            <button
              type="button"
              className={`chip ${showAnnotations ? "active" : ""}`}
              onClick={() => setShowAnnotations((v) => !v)}
            >
              {showAnnotations ? "On" : "Off"}
            </button>
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
          navigate(hasImageSheet ? ROUTES.PRACTICE : ROUTES.REVIEW);
        }}
      >
        Save & Return
      </button>
    </main>
  );
}
