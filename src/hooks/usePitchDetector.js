import { useCallback, useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";
import {
  centsFromTarget,
  frequencyToNoteName,
  getPitchFeedback,
} from "../utils/musicNotes";

const CLARITY_THRESHOLD = 0.85;
const MIN_FREQUENCY = 65;

/**
 * Web Audio API + pitchy: live microphone pitch detection.
 */
export function usePitchDetector() {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [cents, setCents] = useState(null);
  const [feedback, setFeedback] = useState("gray");
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const targetNoteRef = useRef(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    setIsListening(false);
    setDetectedNote(null);
    setFrequency(null);
    setCents(null);
    setFeedback("gray");
  }, []);

  const setTargetNote = useCallback((noteName) => {
    targetNoteRef.current = noteName;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone not supported in this browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      const buffer = new Float32Array(analyser.fftSize);

      const tick = () => {
        analyser.getFloatTimeDomainData(buffer);
        const [pitch, clarity] = detector.findPitch(buffer, ctx.sampleRate);
        const target = targetNoteRef.current;
        const isSilent = clarity < CLARITY_THRESHOLD || pitch < MIN_FREQUENCY;

        if (isSilent) {
          setDetectedNote(null);
          setFrequency(null);
          setCents(null);
          setFeedback("gray");
        } else {
          const note = frequencyToNoteName(pitch);
          const noteCents = target ? centsFromTarget(pitch, target) : null;
          setDetectedNote(note);
          setFrequency(pitch);
          setCents(noteCents);
          setFeedback(getPitchFeedback(note, target, noteCents, false));
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      setIsListening(true);
      tick();
      return true;
    } catch (err) {
      setError(err.message || "Microphone access denied");
      stop();
      return false;
    }
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return {
    isListening,
    detectedNote,
    frequency,
    cents,
    feedback,
    error,
    start,
    stop,
    setTargetNote,
  };
}
