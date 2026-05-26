import { useCallback, useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";
import {
  centsFromTarget,
  frequencyToNoteName,
  getPitchFeedback,
} from "../utils/musicNotes";

const CLARITY_THRESHOLD = 0.82;
const MIN_FREQUENCY = 70;
const SMOOTHING = 0.35;
const NOISE_GATE_RMS = 0.008;

function rms(buffer) {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
  return Math.sqrt(sum / buffer.length);
}

/**
 * Web Audio API + pitchy with smoothing, noise gate, and mic states.
 * micState: idle | listening | paused | detecting
 */
export function usePitchDetector() {
  const [micState, setMicState] = useState("idle");
  const [detectedNote, setDetectedNote] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [cents, setCents] = useState(null);
  const [feedback, setFeedback] = useState("gray");
  const [error, setError] = useState(null);
  const [hasMicrophone, setHasMicrophone] = useState(true);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const targetNoteRef = useRef(null);
  const pausedRef = useRef(false);
  const smoothFreqRef = useRef(null);
  const smoothClarityRef = useRef(0);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
    pausedRef.current = false;
    smoothFreqRef.current = null;
    setMicState("idle");
    setDetectedNote(null);
    setFrequency(null);
    setCents(null);
    setFeedback("gray");
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    setMicState("paused");
    setDetectedNote(null);
    setFeedback("gray");
  }, []);

  const resume = useCallback(() => {
    if (!streamRef.current) return;
    pausedRef.current = false;
    setMicState("listening");
  }, []);

  const setTargetNote = useCallback((noteName) => {
    targetNoteRef.current = noteName;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setHasMicrophone(false);
        throw new Error("Microphone not available — use a supported browser");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      setHasMicrophone(true);

      const ctx = new AudioContext();
      if (ctx.state === "suspended") await ctx.resume();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      const buffer = new Float32Array(analyser.fftSize);

      const tick = () => {
        if (pausedRef.current) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        analyser.getFloatTimeDomainData(buffer);
        const level = rms(buffer);
        const [pitch, clarity] = detector.findPitch(buffer, ctx.sampleRate);

        smoothClarityRef.current =
          smoothClarityRef.current * (1 - SMOOTHING) + clarity * SMOOTHING;

        const gateOpen = level > NOISE_GATE_RMS;
        const validPitch =
          gateOpen &&
          smoothClarityRef.current >= CLARITY_THRESHOLD &&
          pitch >= MIN_FREQUENCY;

        if (validPitch) {
          smoothFreqRef.current =
            smoothFreqRef.current == null
              ? pitch
              : smoothFreqRef.current * (1 - SMOOTHING) + pitch * SMOOTHING;

          const stablePitch = smoothFreqRef.current;
          const target = targetNoteRef.current;
          const note = frequencyToNoteName(stablePitch);
          const noteCents = target ? centsFromTarget(stablePitch, target) : null;

          setDetectedNote(note);
          setFrequency(stablePitch);
          setCents(noteCents);
          setFeedback(getPitchFeedback(note, target, noteCents, false));
          setMicState("detecting");
        } else {
          smoothFreqRef.current = null;
          setDetectedNote(null);
          setFrequency(null);
          setCents(null);
          setFeedback("gray");
          setMicState("listening");
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      pausedRef.current = false;
      setMicState("listening");
      tick();
      return true;
    } catch (err) {
      setError(err.message || "Microphone access denied");
      setHasMicrophone(false);
      stop();
      return false;
    }
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return {
    micState,
    isListening: micState === "listening" || micState === "detecting",
    isPaused: micState === "paused",
    detectedNote,
    frequency,
    cents,
    feedback,
    error,
    hasMicrophone,
    start,
    stop,
    pause,
    resume,
    setTargetNote,
  };
}
