/** Export practice result as shareable image (canvas) */

export async function exportResultImage({ title, accuracy, xp, streak, instrument }) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, 600, 400);
  grad.addColorStop(0, "#1a0a02");
  grad.addColorStop(1, "#0c0c0c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 400);

  ctx.fillStyle = "#ff7a00";
  ctx.font = "bold 36px Inter, sans-serif";
  ctx.fillText("NOTA", 40, 60);

  ctx.fillStyle = "#ffffff";
  ctx.font = "24px Inter, sans-serif";
  ctx.fillText(title || "Practice Session", 40, 110);

  ctx.fillStyle = "#ffb468";
  ctx.font = "18px Inter, sans-serif";
  ctx.fillText(`${instrument || "Alto Saxophone"}`, 40, 145);

  ctx.fillStyle = "#69d318";
  ctx.font = "bold 64px Inter, sans-serif";
  ctx.fillText(`${accuracy}%`, 40, 230);

  ctx.fillStyle = "#aaaaaa";
  ctx.font = "16px Inter, sans-serif";
  ctx.fillText("Accuracy", 40, 255);
  ctx.fillText(`+${xp} XP · ${streak} day streak`, 40, 300);

  ctx.strokeStyle = "rgba(255,122,0,0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 560, 360);

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

export async function shareWithTeacher({ title, accuracy, minutes, instrument }) {
  const text = `NOTA Practice Report\nPiece: ${title}\nInstrument: ${instrument}\nAccuracy: ${accuracy}%\nTime: ${minutes} min\n— Shared from NOTA Teacher Mode`;
  if (navigator.share) {
    await navigator.share({ title: "NOTA Practice Result", text });
    return true;
  }
  await navigator.clipboard.writeText(text);
  return false;
}
