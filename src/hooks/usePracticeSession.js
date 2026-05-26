import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEMO_EXERCISE,
  evaluatePractice,
  getExpectedNote,
  getExpectedNoteIndex,
  getTotalDurationMs,
} from "../utils/exercise";

const SAMPLE_INTERVAL_MS = 80;
const UNSTABLE_CENTS_THRESHOLD = 18;
const PAUSE_THRESHOLD_MS = 450;

/**
 * Timed practice session with real-time feedback: correct, wrong, pause, rhythm.
 */
export function usePracticeSession({ pitch, exercise: initialExercise }) {
  const [exercise, setExercise] = useState(initialExercise ?? DEMO_EXERCISE);
  const [phase, setPhase] = useState("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [summary, setSummary] = useState(null);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [currentConcertTarget, setCurrentConcertTarget] = useState(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [liveFeedback, setLiveFeedback] = useState("ready");
  const [difficultMeasures, setDifficultMeasures] = useState([]);
  const [liveAccuracy, setLiveAccuracy] = useState(null);
  const mistakeMeasuresRef = useRef({});

  const samplesRef = useRef([]);
  const centsHistoryRef = useRef([]);
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const noteWindowRef = useRef({ index: -1, enteredAt: 0 });
  const pauseStartRef = useRef(null);

  useEffect(() => {
    setExercise(initialExercise ?? DEMO_EXERCISE);
  }, [initialExercise]);

  const totalMs = getTotalDurationMs(exercise);

  const recordSample = useCallback(() => {
    const now = Date.now() - startTimeRef.current;
    const idx = getExpectedNoteIndex(exercise, now);
    const expected = getExpectedNote(exercise, now);
    const targetNote = expected.writtenName || expected.name;
    const targetConcert = expected.concertName || expected.name;
    pitch.setTargetNote(targetConcert);
    setCurrentTarget(targetNote);
    setCurrentConcertTarget(targetConcert);
    setCurrentNoteIndex(idx);

    const detected = pitch.detectedNote;
    const isSilent = pitch.feedback === "gray";
    const noteCents = pitch.cents;

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

    if (idx !== noteWindowRef.current.index) {
      let windowStart = 0;
      for (let j = 0; j < idx; j++) windowStart += exercise.notes[j].durationMs;
      noteWindowRef.current = { index: idx, enteredAt: windowStart };
    }

    let timingOff = false;
    if (!isSilent && detected && noteWindowRef.current.index === idx) {
      const offset = now - noteWindowRef.current.enteredAt;
      const expectedDur = expected.durationMs;
      if (offset < 100 || offset > expectedDur * 0.85) timingOff = true;
    }

    const measure = expected.measure ?? 1;
    if (!isSilent && (detected !== targetConcert || timingOff)) {
      mistakeMeasuresRef.current[measure] = (mistakeMeasuresRef.current[measure] || 0) + 1;
    }

    // Real-time feedback
    if (isSilent) {
      if (pauseStartRef.current == null) pauseStartRef.current = now;
      const pauseLen = now - pauseStartRef.current;
      if (pauseLen > PAUSE_THRESHOLD_MS) setLiveFeedback("pause");
      else setLiveFeedback("silent");
    } else {
      pauseStartRef.current = null;
      if (timingOff) setLiveFeedback("rhythm");
      else if (detected === targetConcert && Math.abs(noteCents ?? 99) <= 35)
        setLiveFeedback("correct");
      else if (detected && detected !== targetConcert) setLiveFeedback("wrong");
      else if (detected) setLiveFeedback("rhythm");
      else setLiveFeedback("silent");
    }

    samplesRef.current.push({
      elapsedMs: now,
      detectedNote: detected,
      targetNote: targetConcert,
      cents: noteCents,
      isSilent,
      unstable,
      timingOff,
    });

    const played = samplesRef.current.filter((s) => !s.isSilent);
    if (played.length > 0) {
      const hits = played.filter(
        (s) =>
          s.detectedNote === s.targetNote &&
          Math.abs(s.cents ?? 99) <= 35 &&
          !s.timingOff
      ).length;
      setLiveAccuracy(Math.round((hits / played.length) * 100));
    }
  }, [exercise, pitch]);

  const finish = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    pitch.stop();
    const result = evaluatePractice(exercise, samplesRef.current);
    const hard = Object.entries(mistakeMeasuresRef.current)
      .filter(([, count]) => count >= 2)
      .map(([m]) => parseInt(m, 10))
      .sort((a, b) => a - b);
    result.difficultMeasures = hard;
    setDifficultMeasures(hard);
    setSummary(result);
    setPhase("summary");
    setLiveFeedback("ready");
    return result;
  }, [exercise, pitch]);

  const startPractice = useCallback(async () => {
    samplesRef.current = [];
    centsHistoryRef.current = [];
    noteWindowRef.current = { index: -1, enteredAt: 0 };
    pauseStartRef.current = null;
    mistakeMeasuresRef.current = {};
    setSummary(null);
    setElapsedMs(0);

    const ok = await pitch.start();
    if (!ok) return;

    setPhase("practicing");
    setLiveFeedback("silent");
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (pitch.isPaused) return;
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
    setCurrentConcertTarget(null);
    setCurrentNoteIndex(-1);
    setLiveFeedback("ready");
    setDifficultMeasures([]);
    setLiveAccuracy(null);
    mistakeMeasuresRef.current = {};
    samplesRef.current = [];
  }, [pitch]);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  const progress = Math.min(100, Math.round((elapsedMs / totalMs) * 100));
  const noteIndex = getExpectedNoteIndex(exercise, elapsedMs);
  const barProgress =
    noteIndex >= 0
      ? `${noteIndex + 1} / ${exercise.notes.length}`
      : `0 / ${exercise.notes.length}`;

  return {
    exercise,
    setExercise,
    phase,
    elapsedMs,
    totalMs,
    progress,
    barProgress,
    currentTarget,
    currentConcertTarget,
    currentNoteIndex,
    liveFeedback,
    difficultMeasures,
    liveAccuracy,
    summary,
    startPractice,
    reset,
    finish,
  };
}
