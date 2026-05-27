import { useEffect, useRef } from "react";
import { Formatter, Renderer, Stave, StaveNote, Voice } from "vexflow";

const DURATION_VF = {
  whole: "w",
  half: "h",
  quarter: "q",
  eighth: "8",
  sixteenth: "16",
};

const BEATS = { whole: 4, half: 2, quarter: 1, eighth: 0.5, sixteenth: 0.25 };

const STAVE_HEIGHT = 96;
const STAVE_TOP = 18;
const STAVE_LEFT = 8;

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

function createTickable(note, { difficultSet, activeNoteId }) {
  const isDifficult = difficultSet.has(note.measure);
  const isActive = note.id === activeNoteId;
  const sn = new StaveNote({
    clef: "treble",
    keys: [pitchToVexKey(note.pitch)],
    duration: DURATION_VF[note.duration] || "q",
  });
  if (isActive) {
    sn.setStyle({ fillStyle: "#ff7a00", strokeStyle: "#ff9700" });
  } else if (isDifficult) {
    sn.setStyle({ fillStyle: "#ff3f24", strokeStyle: "#ff6b55" });
  }
  return sn;
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

    const measuresPerLine =
      measuresPerLineProp ?? (width < 360 ? 2 : 4);
    const measureGroups = groupNotesByMeasure(notes);
    const systems = chunkMeasures(measureGroups, measuresPerLine);
    const staveWidth = width - STAVE_LEFT * 2;
    const totalHeight =
      heightProp ?? STAVE_TOP + systems.length * STAVE_HEIGHT + 24;

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(width, totalHeight);
    const ctx = renderer.getContext();
    ctx.setFillStyle("#e8e8e8");
    ctx.setStrokeStyle("#e8e8e8");

    systems.forEach((lineMeasures, lineIndex) => {
      const y = STAVE_TOP + lineIndex * STAVE_HEIGHT;
      const firstMeasure = lineMeasures[0]?.[0]?.measure ?? lineIndex * measuresPerLine + 1;

      const stave = new Stave(STAVE_LEFT, y, staveWidth);
      if (lineIndex === 0) {
        stave.addClef("treble").addTimeSignature("4/4");
      }
      stave.setContext(ctx).draw();

      const lineNotes = lineMeasures.flat();
      if (lineNotes.length === 0) return;

      const tickables = lineNotes.map((n) =>
        createTickable(n, { difficultSet, activeNoteId })
      );

      const lineBeats = lineNotes.reduce(
        (sum, n) => sum + (BEATS[n.duration] ?? 1),
        0
      );
      const numBeats = Math.max(4, Math.ceil(lineBeats));

      const voice = new Voice({ num_beats: numBeats, beat_value: 4 });
      voice.setStrict(false);
      voice.addTickables(tickables);

      const formatWidth = staveWidth - (lineIndex === 0 ? 72 : 16);

      try {
        new Formatter().joinVoices([voice]).format([voice], formatWidth);
        voice.draw(ctx, stave);
      } catch {
        tickables.forEach((sn, idx) => {
          sn.setStave(stave);
          sn.setContext(ctx);
          sn.setXShift(idx * 42);
          try {
            sn.draw();
          } catch {
            /* skip */
          }
        });
      }

      const systemRow = document.createElement("div");
      systemRow.className = "sheet-system-marker";
      systemRow.dataset.systemStart = String(firstMeasure);
      systemRow.style.position = "absolute";
      systemRow.style.top = `${y}px`;
      systemRow.style.left = "0";
      systemRow.style.width = "1px";
      systemRow.style.height = `${STAVE_HEIGHT}px`;
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

    const measuresPerLine =
      measuresPerLineProp ?? (width < 360 ? 2 : 4);
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
      className={`vexflow-wrap sheet-with-playhead sheet-scroll ${className}`}
    >
      <div ref={containerRef} className="vexflow-container" aria-label="Digital sheet music" />
      {showPlayhead && (
        <div className="sheet-playhead active" style={{ left: playheadLeft }} />
      )}
    </div>
  );
}
