import { useEffect, useRef } from "react";
import { Formatter, Renderer, Stave, StaveNote, Voice } from "vexflow";

const DURATION_VF = {
  whole: "w",
  half: "h",
  quarter: "q",
  eighth: "8",
  sixteenth: "16",
};

function pitchToVexKey(pitch) {
  const m = pitch.match(/^([A-G][#b]?)(\d)$/);
  if (!m) return "c/4";
  let name = m[1].toLowerCase();
  if (name.includes("b")) name = name.replace("b", "b");
  return `${name}/${m[2]}`;
}

/**
 * Renders structured notes as digital sheet music (VexFlow SVG).
 */
export default function SheetMusicRenderer({
  notes = [],
  activeNoteId = null,
  width = 340,
  height = 150,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = "";

    if (notes.length === 0) return;

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const ctx = renderer.getContext();
    ctx.setFillStyle("#e8e8e8");
    ctx.setStrokeStyle("#e8e8e8");

    const stave = new Stave(10, 24, width - 24);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(ctx).draw();

    const tickables = notes.map((n) => {
      const sn = new StaveNote({
        clef: "treble",
        keys: [pitchToVexKey(n.pitch)],
        duration: DURATION_VF[n.duration] || "q",
      });
      if (n.id === activeNoteId) {
        sn.setStyle({ fillStyle: "#ff7a00", strokeStyle: "#ff9700" });
      }
      return sn;
    });

    const totalBeats = notes.reduce((sum, n) => {
      const beats = { whole: 4, half: 2, quarter: 1, eighth: 0.5, sixteenth: 0.25 };
      return sum + (beats[n.duration] ?? 1);
    }, 0);
    const numBeats = Math.max(4, Math.ceil(totalBeats));

    const voice = new Voice({ num_beats: numBeats, beat_value: 4 });
    voice.setStrict(false);
    voice.addTickables(tickables);

    try {
      new Formatter().joinVoices([voice]).format([voice], width - 60);
      voice.draw(ctx, stave);
    } catch {
      tickables.forEach((sn, idx) => {
        sn.setStave(stave);
        sn.setContext(ctx);
        sn.setXShift(idx * 38);
        try {
          sn.draw();
        } catch {
          /* skip invalid tickables */
        }
      });
    }
  }, [notes, activeNoteId, width, height]);

  if (notes.length === 0) {
    return (
      <div className={`vexflow-empty ${className}`}>
        <p>No notes to display yet.</p>
      </div>
    );
  }

  return (
    <div className={`vexflow-wrap ${className}`}>
      <div ref={containerRef} className="vexflow-container" aria-label="Digital sheet music" />
    </div>
  );
}
