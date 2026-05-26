import { useCallback, useEffect, useRef, useState } from "react";

export function useMetronome(initialBpm = 100) {
  const [bpm, setBpm] = useState(initialBpm);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const tick = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    const ms = (60 / bpm) * 1000;
    tick();
    intervalRef.current = setInterval(tick, ms);
  }, [bpm, tick]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    if (isRunning) stop();
    else start();
  }, [isRunning, start, stop]);

  useEffect(() => {
    if (!isRunning) return;
    stop();
    start();
  }, [bpm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stop(), [stop]);

  return { bpm, setBpm, isRunning, start, stop, toggle };
}
