import SheetMusicRenderer from "../SheetMusicRenderer";
import AnnotationLayer from "../AnnotationLayer";
import EmptyState from "../EmptyState";

export default function PracticeSheetHero({
  notes,
  annotations,
  activeNoteId,
  difficultMeasures,
  progress,
  onChooseTrack,
}) {
  if (!notes.length) {
    return (
      <section className="practice-v2-sheet glass-card">
        <EmptyState
          compact
          icon="📄"
          title="No sheet loaded"
          message="Choose a track to begin practicing."
          actionLabel="Select music"
          onAction={onChooseTrack}
        />
      </section>
    );
  }

  return (
    <section className="practice-v2-sheet glass-card">
      <div className="practice-v2-sheet-inner sheet-layer-wrap">
        <SheetMusicRenderer
          notes={notes}
          activeNoteId={activeNoteId}
          difficultMeasures={difficultMeasures}
          progress={progress}
          width={350}
          height={200}
          className="sheet-hero-renderer"
        />
        <AnnotationLayer annotations={annotations} />
        {progress > 0 && (
          <div
            className="sheet-playhead active"
            style={{ left: `${Math.min(98, progress * 100)}%` }}
          />
        )}
      </div>
    </section>
  );
}
