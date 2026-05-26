export function linkAnnotationToMeasure(annotation, notes = [], canvasWidth = 320) {
  if (!annotation?.points?.length || !notes.length) return { linked_measure: null, linked_note_id: null };
  const maxMeasure = Math.max(...notes.map((n) => n.measure || 1));
  const avgX =
    annotation.points.reduce((sum, p) => sum + p.x, 0) / Math.max(1, annotation.points.length);
  const ratio = Math.min(1, Math.max(0, avgX / canvasWidth));
  const linkedMeasure = Math.max(1, Math.min(maxMeasure, Math.round(ratio * maxMeasure)));
  const nearest = notes.find((n) => (n.measure || 1) === linkedMeasure) || notes[0];
  return {
    linked_measure: linkedMeasure,
    linked_note_id: nearest?.id ?? null,
  };
}
