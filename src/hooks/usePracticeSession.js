import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEMO_EXERCISE,
  evaluatePractice,
  getExpectedNote,
  getTotalDurationMs,
} from "../utils/exercise";
const SAMPLE_INTERVAL_MS = 80;
const UNSTABLE_CENTS_THRESHOLD = 18;

/**
 * Runs a timed exercise, collects pitch samples, and produces a summary.
 */
export function usePracticeSession({ pitch, exercise: initialExercise }) {
  const [exercise, setExercise] = useState(initialExercise ?? DEMO_EXERCISE);
  const [phase, setPhase] = useState("idle"); // idle | practicing | summary
  const [elapsedMs, setElapsedMs] = useState(0);
  const [summary, setSummary] = useState(null);
  const [currentTarget, setCurrentTarget] = useState(null);

  const samplesRef = useRef([]);
  const centsHistoryRef = useRef([]);
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const noteWindowRef = useRef({ index: -1, enteredAt: 0 });

  useEffect(() => {
    setExercise(initialExercise ?? DEMO_EXERCISE);
  }, [initialExercise]);

  const totalMs = getTotalDurationMs(exercise);

  const recordSample = useCallback(() => {
    const now = Date.now() - startTimeRef.current;
    const expected = getExpectedNote(exercise, now);
    const targetNote = expected.name;
    pitch.setTargetNote(targetNote);
    setCurrentTarget(targetNote);

    const detected = pitch.detectedNote;
    const isSilent = pitch.feedback === "gray";
    const noteCents = pitch.cents;

    // Track cents variance for unstable pitch detection
    if (noteCents != null && !isSilent) {
      centsHistoryRef.current.push(noteCents);
      if (centsHistoryRef.current.length > 8) centsHistoryRef.current.shift();
    } else {
      centsHistoryRef.current = [];
    }

    let unstable = false;
    if (centsHistoryRef.current.length >= 4) {
      const arr = centsHistoryRef.current;
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const variance =
        arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length;
      unstable = Math.sqrt(variance) > UNSTABLE_CENTS_THRESHOLD;
    }

    // Early/late: first sound in note window vs expected start
    const noteIdx = exercise.notes.findIndex((n, i) => {
      let start = 0;
      for (let j = 0; j < i; j++) start += exercise.notes[j].durationMs;
      return now >= start && now < start + n.durationMs;
    });

    let timingOff = false;
    if (noteIdx >= 0 && noteWindowRef.current.index !== noteIdx) {
      let windowStart = 0;
      for (let j = 0; j < noteIdx; j++) windowStart += exercise.notes[j].durationMs;
      noteWindowRef.current = { index: noteIdx, enteredAt: windowStart };
    }
    if (!isSilent && detected && noteWindowRef.current.index === noteIdx) {
      const offset = now - noteWindowRef.current.enteredAt;
      if (offset < 120 || offset > expected.durationMs - 120) timingOff = true;
    }

    samplesRef.current.push({
      elapsedMs: now,
      detectedNote: detected,
      targetNote,
      cents: noteCents,
      isSilent,
      unstable,
      timingOff,
    });
  }, [exercise, pitch]);

  const finish = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    pitch.stop();
    const result = evaluatePractice(exercise, samplesRef.current);
    setSummary(result);
    setPhase("summary");
  }, [exercise, pitch]);

  const startPractice = useCallback(async () => {
    samplesRef.current = [];
    centsHistoryRef.current = [];
    noteWindowRef.current = { index: -1, enteredAt: 0 };
    setSummary(null);
    setElapsedMs(0);

    const ok = await pitch.start();
    if (!ok) return;

    setPhase("practicing");
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now() - startTimeRef.current;
      setElapsedMs(now);
      recordSample();

      if (now >= totalMs) finish();
    }, SAMPLE_INTERVAL_MS);
  }, [pitch, totalMs, finish, recordSample]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    pitch.stop();
    setPhase("idle");
    setElapsedMs(0);
    setSummary(null);
    setCurrentTarget(null);
    samplesRef.current = [];
  }, [pitch]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const progress = Math.min(100, Math.round((elapsedMs / totalMs) * 100));
  const noteIndex = exercise.notes.findIndex((_, i) => {
    let start = 0;
    for (let j = 0; j < i; j++) start += exercise.notes[j].durationMs;
    const end = start + exercise.notes[i].durationMs;
    return elapsedMs >= start && elapsedMs < end;
  });
  const barProgress =
    noteIndex >= 0 ? `${noteIndex + 1} / ${exercise.notes.length}` : `0 / ${exercise.notes.length}`;

  return {
    exercise,
    setExercise,
    phase,
    elapsedMs,
    totalMs,
    progress,
    barProgress,
    currentTarget,
    summary,
    startPractice,
    reset,
    finish,
  };
}
