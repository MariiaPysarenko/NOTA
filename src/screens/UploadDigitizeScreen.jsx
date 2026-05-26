import { useRef, useState } from "react";
import { useApp } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import { digitizeSheetMusic } from "../services/omrApi";
import DigitizeLoader from "../components/DigitizeLoader";
import EmptyState from "../components/EmptyState";

const ACCEPT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

export default function UploadDigitizeScreen() {
  const { setDigitizedNotes, setUploadPreview, navigate, showToast } = useApp();
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ready | processing | done
  const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!file) return;
    const valid =
      ACCEPT_TYPES.includes(file.type) ||
      /\.(png|jpe?g|pdf)$/i.test(file.name);
    if (!valid) {
      showToast("Please upload PNG, JPG, or PDF");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setFileName(file.name);
    setFileType(file.type);
    setError("");
    setStatus("ready");

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploadPreview(url);
    } else {
      setPreviewUrl(null);
      setUploadPreview(null);
    }
  };

  const handleDigitize = async () => {
    if (!selectedFile) {
      showToast("Upload a file first");
      return;
    }
    setStatus("processing");
    setError("");
    try {
      const notes = await digitizeSheetMusic(selectedFile);
      setDigitizedNotes(notes, {
        id: "uploaded",
        title: fileName.replace(/\.[^.]+$/, "") || "Uploaded Piece",
        subtitle: "Digitized from your sheet music",
      });
      setStatus("done");
      showToast("Sheet music digitized!");
      navigate(ROUTES.REVIEW);
    } catch (err) {
      setStatus("ready");
      setError(err.message || "Digitization failed");
      showToast("Could not digitize — try again");
    }
  };

  return (
    <main className="screen">
      <section className="hero small">
        <h1>
          Upload <span>Sheet Music</span>
        </h1>
        <p>Upload sheet music to begin. We convert it into structured digital notes.</p>
      </section>

      {status === "idle" && !selectedFile && (
        <EmptyState
          icon="📄"
          title="Upload sheet music to begin"
          message="PNG, JPG, or PDF — we'll analyze and convert it into digital notes."
          actionLabel="Choose file"
          onAction={() => inputRef.current?.click()}
        />
      )}

      <section className="upload-card">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,application/pdf,.png,.jpg,.jpeg,.pdf"
          className="upload-input-hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <button
          type="button"
          className="upload-btn"
          onClick={() => inputRef.current?.click()}
        >
          📄 Choose file (PNG / JPG / PDF)
        </button>

        {status === "processing" && (
          <DigitizeLoader message="Analyzing sheet music…" />
        )}

        {error && <p className="upload-error">{error}</p>}

        {previewUrl && (
          <div className="sheet-preview-wrap">
            <img src={previewUrl} alt={`Preview: ${fileName}`} className="sheet-preview" />
            <span className="sheet-preview-label">{fileName}</span>
          </div>
        )}

        {selectedFile && fileType === "application/pdf" && (
          <div className="pdf-placeholder">
            <span>📑</span>
            <p>{fileName}</p>
            <small>PDF preview not shown — digitization uses mock OMR</small>
          </div>
        )}

        <button
          type="button"
          className="primary digitize-btn"
          disabled={!selectedFile || status === "processing"}
          onClick={handleDigitize}
        >
          {status === "processing" ? "Digitizing…" : "Digitize Sheet Music"}
        </button>
      </section>
    </main>
  );
}
