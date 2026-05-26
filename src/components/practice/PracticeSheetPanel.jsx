import SheetMusicRenderer from "../SheetMusicRenderer";
import AnnotationLayer from "../AnnotationLayer";
import EmptyState from "../EmptyState";

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
        <EmptyState
          compact
          icon="📄"
          title="No sheet music loaded"
          message="Upload or choose a track from the library to see digital notes here."
          actionLabel="Choose a track"
          onAction={onEditNotes}
        />
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
