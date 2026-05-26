import { mockDigitizeSheetMusic } from "./mockOmr";

/**
 * Future integration point for a real OMR service.
 * Set VITE_OMR_API_URL in .env when ready.
 */
export async function digitizeSheetMusic(file, { useMock = true } = {}) {
  const apiUrl = import.meta.env.VITE_OMR_API_URL;

  if (!useMock && apiUrl) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${apiUrl}/digitize`, { method: "POST", body: form });
    if (!res.ok) throw new Error("OMR service failed");
    const data = await res.json();
    return data.notes;
  }

  return mockDigitizeSheetMusic(file);
}
