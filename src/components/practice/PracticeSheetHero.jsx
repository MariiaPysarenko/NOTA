import SheetMusicRenderer from "../SheetMusicRenderer";
import AnnotationLayer from "../AnnotationLayer";
import SheetImageViewer from "../SheetImageViewer";
import EmptyState from "../EmptyState";

export default function PracticeSheetHero({
  notes,
  sheetAsset = null,
  annotations,
  activeNoteId,
  difficultMeasures,
  progress,
  showAnnotations = true,
  autoScroll = false,
  onChooseTrack,
}) {
  if (!notes.length && !sheetAsset?.dataUrl) {
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
        {sheetAsset?.dataUrl ? (
          <SheetImageViewer asset={sheetAsset} annotations={annotations} showAnnotations={showAnnotations} />
        ) : (
          <>
            <SheetMusicRenderer
              notes={notes}
              activeNoteId={activeNoteId}
              difficultMeasures={difficultMeasures}
              progress={progress}
              width={350}
              measuresPerLine={2}
              autoScroll={autoScroll}
              className="sheet-hero-renderer"
            />
            {showAnnotations && <AnnotationLayer annotations={annotations} />}
          </>
        )}
      </div>
    </section>
  );
}
