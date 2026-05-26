import { useCallback, useEffect, useRef } from "react";

export function useMetronome(bpm = 100, shouldRun = false) {
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

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    const ms = (60 / bpm) * 1000;
    tick();
    intervalRef.current = setInterval(tick, ms);
  }, [bpm, tick, stop]);

  useEffect(() => {
    if (shouldRun) start();
    else stop();
    return stop;
  }, [shouldRun, bpm, start, stop]);

  return { isRunning: shouldRun };
}
