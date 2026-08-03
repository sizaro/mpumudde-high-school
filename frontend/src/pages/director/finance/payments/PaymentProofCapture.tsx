import { useEffect, useRef, useState } from "react";

type Props = { file: File | null; existingUrl?: string | null; onChange: (file: File | null) => void; documentLabel?: string };

export default function PaymentProofCapture({ file, existingUrl, onChange, documentLabel: _documentLabel = "receipt" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [review, setReview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [error, setError] = useState("");
  useEffect(() => { if (videoRef.current && stream) videoRef.current.srcObject = stream; }, [stream]);
  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);
  const close = () => { stream?.getTracks().forEach((track) => track.stop()); setStream(null); setReview(null); };
  const openCamera = async (mode: "environment" | "user" = facingMode) => { close(); setError(""); try { const next = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: mode } }, audio: false }); setFacingMode(mode); setStream(next); } catch { setError("Camera access is unavailable. Allow camera permission and try again."); } };
  const capture = () => { const video = videoRef.current; if (!video) return; const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d")?.drawImage(video, 0, 0); setReview(canvas.toDataURL("image/jpeg", 0.9)); stream?.getTracks().forEach((track) => track.stop()); setStream(null); };
  const accept = async () => { if (!review) return; const blob = await (await fetch(review)).blob(); onChange(new File([blob], `payment-proof-${Date.now()}.jpg`, { type: "image/jpeg" })); close(); };
  const previewUrl = file ? URL.createObjectURL(file) : existingUrl;

  return <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
    <div className="flex flex-wrap gap-2"><button type="button" onClick={() => inputRef.current?.click()} className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700">Choose image or PDF</button><button type="button" onClick={() => void openCamera()} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Take receipt photo</button>{(file || existingUrl) && <button type="button" onClick={() => onChange(null)} className="rounded-xl px-3 py-2 text-sm font-semibold text-rose-600">Remove</button>}</div>
    <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(event) => onChange(event.target.files?.[0] ?? null)}/>
    {file && <p className="mt-2 text-xs text-emerald-700">Selected: {file.name}</p>}{previewUrl && file?.type.startsWith("image/") && <img src={previewUrl} alt="Payment proof preview" className="mt-3 max-h-40 rounded-xl object-contain"/>}{previewUrl && (file?.type === "application/pdf" || (!file && existingUrl)) && <a href={previewUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-blue-700">View current proof</a>}{error && <p className="mt-2 text-xs text-rose-700">{error}</p>}
    {(stream || review) && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4"><div className="w-full max-w-2xl rounded-3xl bg-white p-5"><h3 className="font-semibold">{review ? "Review receipt photo" : "Take receipt photo"}</h3>{review ? <img src={review} alt="Captured receipt" className="mt-3 max-h-[60vh] w-full rounded-2xl bg-black object-contain"/> : <video ref={videoRef} autoPlay muted playsInline className="mt-3 max-h-[60vh] w-full rounded-2xl bg-black"/>}<div className="mt-4 grid gap-2 sm:grid-cols-2">{review ? <><button type="button" onClick={() => void accept()} className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white">Use this photo</button><button type="button" onClick={() => { setReview(null); void openCamera(); }} className="rounded-xl border px-4 py-3">Retake</button></> : <><button type="button" onClick={() => void openCamera(facingMode === "environment" ? "user" : "environment")} className="rounded-xl border px-4 py-3">Switch camera</button><button type="button" onClick={capture} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">Capture photo</button></>}<button type="button" onClick={close} className="rounded-xl px-4 py-2 text-slate-600 sm:col-span-2">Close camera</button></div></div></div>}
  </div>;
}
