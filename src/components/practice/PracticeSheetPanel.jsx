import SheetMusicRenderer from "../SheetMusicRenderer";
import AnnotationLayer from "../AnnotationLayer";

export default function PracticeSheetPanel({
  notes,
  annotations,
  activeNoteId,
  difficultMeasures,
  progress,
  onEditNotes,
}) {
  if (!notes.length) {
    return (
      <section className="digital-sheet-card practice-sheet glass-card">
        <div className="empty-state">
          <p>Upload sheet music to begin</p>
          <button type="button" className="secondary small-btn" onClick={onEditNotes}>
            Go to library
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="digital-sheet-card practice-sheet glass-card">
      <div className="sheet-layer-wrap">
        <SheetMusicRenderer
          notes={notes}
          activeNoteId={activeNoteId}
          difficultMeasures={difficultMeasures}
          progress={progress}
          width={330}
          height={140}
        />
        <AnnotationLayer annotations={annotations} />
      </div>
    </section>
  );
}
