import { useRef, useState } from "react";
import { useApp } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import EmptyState from "../components/EmptyState";
import SheetImageViewer from "../components/SheetImageViewer";

const ACCEPT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

export default function UploadDigitizeScreen() {
  const { setDigitizedNotes, setUploadPreview, setSheetAsset, navigate, showToast } = useApp();
  const inputRef = useRef(null);
  const [asset, setAsset] = useState(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | ready
  const [error, setError] = useState("");

  const readAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });

  const handleFile = async (file) => {
    if (!file) return;
    const valid =
      ACCEPT_TYPES.includes(file.type) ||
      /\.(png|jpe?g|pdf)$/i.test(file.name);
    if (!valid) {
      showToast("Please upload PNG, JPG, or PDF");
      return;
    }

    setError("");
    const id = `uploaded-${Date.now()}`;
    const title = file.name.replace(/\.[^.]+$/, "") || "Uploaded Piece";
    try {
      const dataUrl = await readAsDataUrl(file);
      const nextAsset = {
        id,
        fileName: file.name,
        mimeType: file.type || "image/jpeg",
        dataUrl,
        createdAt: new Date().toISOString(),
      };
      setAsset(nextAsset);
      setFileName(file.name);
      setStatus("ready");
      setUploadPreview(dataUrl);
      setDigitizedNotes([], {
        id,
        title,
        subtitle: "Uploaded sheet image",
      });
      setSheetAsset(id, nextAsset);
      showToast("Sheet uploaded");
    } catch (err) {
      setError(err.message || "Upload failed");
      showToast("Could not load this file");
    }
  };

  return (
    <main className="screen">
      <section className="hero small">
        <h1>
          Upload <span>Sheet Music</span>
        </h1>
        <p>Upload a real sheet page and practice directly from your own score.</p>
      </section>

      {status === "idle" && !asset && (
        <EmptyState
          icon="📄"
          title="Upload sheet music to begin"
          message="PNG, JPG, or PDF — your original sheet stays visible during annotation and practice."
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
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />

        <button
          type="button"
          className="upload-btn"
          onClick={() => inputRef.current?.click()}
        >
          📄 Choose file (PNG / JPG / PDF)
        </button>

        {error && <p className="upload-error">{error}</p>}

        {asset?.dataUrl && (
          <div className="sheet-preview-wrap upload-sheet-preview">
            <SheetImageViewer asset={asset} annotations={[]} showAnnotations={false} />
            <span className="sheet-preview-label">{fileName}</span>
          </div>
        )}

        <button
          type="button"
          className="primary digitize-btn"
          disabled={!asset}
          onClick={() => navigate(ROUTES.SHEET_EDITOR)}
        >
          Open sheet & annotate
        </button>
      </section>
    </main>
  );
}
