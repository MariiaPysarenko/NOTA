import { useCallback, useEffect, useRef, useState } from "react";
import { durationToMs } from "../utils/noteModel";

/** Highlights notes in sequence as a demo playback (no mic). */
export function useNoteAutoplay(notes = [], tempoMultiplier = 1) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timersRef = useRef([]);

  const stop = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setIsPlaying(false);
    setActiveIndex(-1);
  }, []);

  const play = useCallback(() => {
    stop();
    if (!notes.length) return;
    setIsPlaying(true);
    let delay = 0;
    notes.forEach((note, i) => {
      const ms = durationToMs(note.duration) / tempoMultiplier;
      timersRef.current.push(
        setTimeout(() => setActiveIndex(i), delay)
      );
      delay += ms;
    });
    timersRef.current.push(setTimeout(() => stop(), delay + 200));
  }, [notes, tempoMultiplier, stop]);

  useEffect(() => () => stop(), [stop]);

  return { isPlaying, activeIndex, play, stop, toggle: () => (isPlaying ? stop() : play()) };
}
