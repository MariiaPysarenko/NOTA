import { useRef, useState } from "react";
import { mockExerciseFromUpload } from "../utils/exercise";

/**
 * Upload sheet music image (PNG/JPG) — placeholder OCR generates a mock exercise.
 */
export default function SheetMusicUpload({ onExerciseGenerated, showToast }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = (file) => {
    if (!file) return;
    const valid = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
    if (!valid) {
      showToast?.("Please upload PNG or JPG");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFileName(file.name);

    // Placeholder “AI/OCR” step
    setStatusMessage("Sheet music uploaded. Demo exercise generated.");
    const exercise = mockExerciseFromUpload(file.name);
    onExerciseGenerated?.(exercise);
    showToast?.("Exercise ready — tap Start Practice");
  };

  return (
    <section className="upload-card">
      <h3 className="upload-title">
        Sheet <span>Music</span>
      </h3>
      <p className="upload-hint">PNG, JPG, or JPEG — preview and mock exercise</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg"
        className="upload-input-hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <button
        type="button"
        className="upload-btn"
        onClick={() => inputRef.current?.click()}
      >
        📄 Upload Sheet Music
      </button>

      {statusMessage && (
        <p className="upload-status" role="status">
          <span className="upload-status-icon">✦</span>
          {statusMessage}
        </p>
      )}

      {previewUrl && (
        <div className="sheet-preview-wrap">
          <img src={previewUrl} alt={`Sheet music: ${fileName}`} className="sheet-preview" />
          <span className="sheet-preview-label">{fileName}</span>
        </div>
      )}
    </section>
  );
}
