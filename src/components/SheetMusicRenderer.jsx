import { useEffect, useRef } from "react";
import {
  BarlineType,
  Beam,
  Formatter,
  Renderer,
  Stave,
  StaveNote,
  Voice,
} from "vexflow";

const DURATION_VF = {
  whole: "w",
  half: "h",
  quarter: "q",
  eighth: "8",
  sixteenth: "16",
};

const BEATS = { whole: 4, half: 2, quarter: 1, eighth: 0.5, sixteenth: 0.25 };

const STAVE_TOP = 22;
const STAVE_BLOCK_HEIGHT = 118;
const SYSTEM_GAP = 38;
const STAVE_LEFT = 6;
const MIN_MEASURE_WIDTH = 80;
const STAVE_LINE_SPACING = 11;

function pitchToVexKey(pitch) {
  const m = pitch.match(/^([A-G][#b]?)(\d)$/);
  if (!m) return "c/4";
  return `${m[1].toLowerCase()}/${m[2]}`;
}

function groupNotesByMeasure(notes) {
  const map = new Map();
  for (const n of notes) {
    const m = n.measure ?? 1;
    if (!map.has(m)) map.set(m, []);
    map.get(m).push(n);
  }
  const maxMeasure = Math.max(...map.keys(), 1);
  const groups = [];
  for (let m = 1; m <= maxMeasure; m++) {
    groups.push(map.get(m) || []);
  }
  return groups;
}

function chunkMeasures(measureGroups, perLine) {
  const lines = [];
  for (let i = 0; i < measureGroups.length; i += perLine) {
    lines.push(measureGroups.slice(i, i + perLine));
  }
  return lines;
}

function resolveMeasuresPerLine(width, requested) {
  const maxFit = Math.floor((width - STAVE_LEFT * 2) / MIN_MEASURE_WIDTH);
  const cap = requested ?? (width < 360 ? 2 : 4);
  return Math.max(2, Math.min(cap, Math.max(2, maxFit)));
}

function createTickable(note, { difficultSet, activeNoteId }) {
  const isDifficult = difficultSet.has(note.measure);
  const isActive = note.id === activeNoteId;
  const sn = new StaveNote({
    clef: "treble",
    keys: [pitchToVexKey(note.pitch)],
    duration: DURATION_VF[note.duration] || "q",
  });
  if (isActive) {
    sn.setStyle({
      fillStyle: "#ff7a00",
      strokeStyle: "#ffcc66",
      lineWidth: 2.2,
    });
  } else if (isDifficult) {
    sn.setStyle({ fillStyle: "#ff3f24", strokeStyle: "#ff6b55" });
  }
  return sn;
}

function drawMeasure(ctx, measureNotes, x, y, measureWidth, options) {
  const { difficultSet, activeNoteId, showClef, showTime } = options;
  if (measureNotes.length === 0) return measureWidth;

  const stave = new Stave(x, y, measureWidth, {
    spacingBetweenLinesPx: STAVE_LINE_SPACING,
    spaceAboveStaffLn: 4,
    spaceBelowStaffLn: 4,
  });

  if (showClef) stave.addClef("treble");
  if (showTime) stave.addTimeSignature("4/4");
  stave.setEndBarType(BarlineType.SINGLE);
  stave.setContext(ctx).draw();

  const tickables = measureNotes.map((n) =>
    createTickable(n, { difficultSet, activeNoteId })
  );

  const measureBeats = measureNotes.reduce(
    (sum, n) => sum + (BEATS[n.duration] ?? 1),
    0
  );
  const numBeats = Math.max(4, Math.ceil(measureBeats));

  const voice = new Voice({ num_beats: numBeats, beat_value: 4 });
  voice.setMode(Voice.Mode.SOFT);
  voice.addTickables(tickables);

  const formatter = new Formatter({ softmaxFactor: 8, maxIterations: 12 });
  formatter.joinVoices([voice]).formatToStave([voice], stave, { stave, context: ctx });
  voice.setContext(ctx).setStave(stave).drawWithStyle();

  try {
    const beams = Beam.generateBeams(voice.getTickables(), {
      beamRests: true,
      maintainStemDirections: true,
    });
    beams.forEach((beam) => beam.setContext(ctx).drawWithStyle());
  } catch {
    /* beaming optional */
  }

  return measureWidth;
}

export default function SheetMusicRenderer({
  notes = [],
  activeNoteId = null,
  difficultMeasures = [],
  progress = 0,
  width = 340,
  height: heightProp,
  measuresPerLine: measuresPerLineProp,
  scrollToNoteId = null,
  className = "",
}) {
  const containerRef = useRef(null);
  const wrapRef = useRef(null);
  const difficultSet = new Set(difficultMeasures);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = "";

    if (notes.length === 0) return;

    const measuresPerLine = resolveMeasuresPerLine(width, measuresPerLineProp);
    const measureGroups = groupNotesByMeasure(notes);
    const systems = chunkMeasures(measureGroups, measuresPerLine);
    const systemStep = STAVE_BLOCK_HEIGHT + SYSTEM_GAP;
    const totalHeight =
      heightProp ?? STAVE_TOP + systems.length * systemStep + 28;
    const contentWidth = width - STAVE_LEFT * 2;

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(width, totalHeight);
    const ctx = renderer.getContext();
    ctx.setFillStyle("#e8e8e8");
    ctx.setStrokeStyle("#e8e8e8");

    systems.forEach((lineMeasures, lineIndex) => {
      const y = STAVE_TOP + lineIndex * systemStep;
      const firstMeasure = lineMeasures[0]?.[0]?.measure ?? lineIndex * measuresPerLine + 1;
      const measureCount = lineMeasures.length;
      const measureWidth = contentWidth / measureCount;

      let x = STAVE_LEFT;
      lineMeasures.forEach((measureNotes, mi) => {
        const isFirst = lineIndex === 0 && mi === 0;
        const w = drawMeasure(ctx, measureNotes, x, y, measureWidth, {
          difficultSet,
          activeNoteId,
          showClef: isFirst,
          showTime: isFirst,
        });
        x += w;
      });

      const systemRow = document.createElement("div");
      systemRow.className = "sheet-system-marker";
      systemRow.dataset.systemStart = String(firstMeasure);
      systemRow.style.position = "absolute";
      systemRow.style.top = `${y}px`;
      systemRow.style.left = "0";
      systemRow.style.width = "1px";
      systemRow.style.height = `${STAVE_BLOCK_HEIGHT}px`;
      systemRow.style.pointerEvents = "none";
      el.appendChild(systemRow);
    });
  }, [
    notes,
    activeNoteId,
    difficultMeasures,
    width,
    heightProp,
    measuresPerLineProp,
  ]);

  useEffect(() => {
    if (!scrollToNoteId || !wrapRef.current) return;
    const note = notes.find((n) => n.id === scrollToNoteId);
    if (!note) return;

    const measuresPerLine = resolveMeasuresPerLine(width, measuresPerLineProp);
    const systemStart =
      Math.floor((note.measure - 1) / measuresPerLine) * measuresPerLine + 1;
    const marker = wrapRef.current.querySelector(
      `[data-system-start="${systemStart}"]`
    );
    marker?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [scrollToNoteId, notes, width, measuresPerLineProp]);

  const showPlayhead = progress > 0 && !activeNoteId;
  const playheadLeft = `${12 + progress * (width - 40)}px`;

  if (notes.length === 0) {
    return (
      <div className={`vexflow-empty ${className}`}>
        <p>No notes to display yet.</p>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`vexflow-wrap sheet-with-playhead sheet-scroll ${className} ${
        activeNoteId ? "has-active-note" : ""
      }`}
    >
      <div ref={containerRef} className="vexflow-container" aria-label="Digital sheet music" />
      {showPlayhead && (
        <div className="sheet-playhead active" style={{ left: playheadLeft }} />
      )}
    </div>
  );
}
