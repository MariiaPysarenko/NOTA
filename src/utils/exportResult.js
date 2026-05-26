/** Export practice result as shareable image (canvas) */

function drawMiniChart(ctx, x, y, w, h, accuracy) {
  const bars = 8;
  const base = accuracy / 100;
  for (let i = 0; i < bars; i++) {
    const bh = h * (0.35 + base * 0.55 * ((i + 3) / bars));
    const bx = x + (i * w) / bars + 4;
    const bw = w / bars - 6;
    ctx.fillStyle = i === bars - 1 ? "#ff7a00" : "rgba(255, 122, 0, 0.45)";
    ctx.fillRect(bx, y + h - bh, bw, bh);
  }
}

export async function exportResultImage({
  title,
  accuracy = 0,
  xp = 0,
  streak = 0,
  instrument,
  durationMinutes = 0,
  durationSeconds = 0,
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 440;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 600, 440);
  grad.addColorStop(0, "#1a0a02");
  grad.addColorStop(1, "#0c0c0c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 440);

  ctx.fillStyle = "#ff7a00";
  ctx.font = "bold 36px Inter, system-ui, sans-serif";
  ctx.fillText("NOTA", 40, 52);

  ctx.fillStyle = "#ffffff";
  ctx.font = "22px Inter, system-ui, sans-serif";
  const titleText = title || "Practice Session";
  ctx.fillText(titleText.length > 28 ? `${titleText.slice(0, 28)}…` : titleText, 40, 98);

  ctx.fillStyle = "#ffb468";
  ctx.font = "16px Inter, system-ui, sans-serif";
  ctx.fillText(instrument || "Alto Saxophone", 40, 128);

  const mins = durationMinutes || Math.max(1, Math.round(durationSeconds / 60));
  ctx.fillStyle = "#888";
  ctx.font = "14px Inter, system-ui, sans-serif";
  ctx.fillText(`${mins} min practice`, 40, 152);

  ctx.fillStyle = accuracy >= 80 ? "#69d318" : "#ff9f16";
  ctx.font = "bold 72px Inter, system-ui, sans-serif";
  ctx.fillText(`${accuracy}%`, 40, 240);

  ctx.fillStyle = "#aaaaaa";
  ctx.font = "14px Inter, system-ui, sans-serif";
  ctx.fillText("Accuracy", 40, 262);

  ctx.fillStyle = "#ffb468";
  ctx.font = "bold 18px Inter, system-ui, sans-serif";
  ctx.fillText(`+${xp} XP`, 40, 300);
  ctx.fillStyle = "#ff9b35";
  ctx.font = "16px Inter, system-ui, sans-serif";
  ctx.fillText(`🔥 ${streak} day streak`, 40, 328);

  drawMiniChart(ctx, 360, 200, 200, 120, accuracy);

  ctx.fillStyle = "#666";
  ctx.font = "11px Inter, system-ui, sans-serif";
  ctx.fillText("Session progress", 360, 190);

  ctx.strokeStyle = "rgba(255,122,0,0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 568, 408);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function shareWithTeacher({
  title,
  accuracy,
  minutes,
  instrument,
  xp,
  streak,
}) {
  const text = `NOTA Practice Report
Piece: ${title}
Instrument: ${instrument}
Accuracy: ${accuracy}%
Duration: ${minutes} min
XP: +${xp}
Streak: ${streak} days
— Shared from NOTA`;
  if (navigator.share) {
    await navigator.share({ title: "NOTA Practice Result", text });
    return true;
  }
  await navigator.clipboard.writeText(text);
  return false;
}

export async function shareResultCard(blob, title) {
  const file = new File([blob], "nota-practice.png", { type: "image/png" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: "NOTA Practice",
      text: title,
      files: [file],
    });
    return true;
  }
  return false;
}
