import { noteNameToMidi } from "./musicNotes";

const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const INSTRUMENT_OFFSETS = {
  "Alto Saxophone": -9,
  Clarinet: -2,
  Trumpet: -2,
  Flute: 0,
  Violin: 0,
  "Acoustic Guitar": 0,
  "Electric Guitar": 0,
  Piano: 0,
  Drums: 0,
};

export function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const idx = ((midi % 12) + 12) % 12;
  return `${NOTE_NAMES_SHARP[idx]}${octave}`;
}

export function writtenToConcertPitch(writtenPitch, instrumentName) {
  const midi = noteNameToMidi(writtenPitch);
  if (midi == null) return writtenPitch;
  const offset = INSTRUMENT_OFFSETS[instrumentName] ?? 0;
  return midiToNoteName(midi + offset);
}

export function enrichNotesWithConcertPitch(notes, instrumentName) {
  return notes.map((note) => ({
    ...note,
    writtenPitch: note.writtenPitch || note.pitch,
    concertPitch: writtenToConcertPitch(note.pitch, instrumentName),
  }));
}
