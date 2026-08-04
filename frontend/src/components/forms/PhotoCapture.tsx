import { useEffect, useRef, useState } from 'react';

export default function PhotoCapture({ value, onChange, label, facingMode = 'user' }: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  facingMode?: 'user' | 'environment';
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [review, setReview] = useState<string | null>(null);

  useEffect(() => () => stream?.getTracks().forEach((track) => track.stop()), [stream]);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      void videoRef.current.play();
    }
  }, [stream]);

  const stop = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };
  const openCamera = async () => {
    try {
      setStream(await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } }, audio: false,
      }));
    } catch {
      window.alert('Allow camera permission, then try again.');
    }
  };
  const capture = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    setReview(canvas.toDataURL('image/jpeg', 0.9));
    stop();
  };

  return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-slate-200">
        {value ? <img src={value} alt={`${label} preview`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-2 text-center text-xs text-slate-500">No photo</div>}
      </div>
      <div>
        <p className="font-semibold text-slate-800">{label}</p>
        <p className="mb-3 text-sm text-slate-500">Choose a saved image or use the device camera, then review it.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} className="rounded-xl border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700">Choose image</button>
          <button type="button" onClick={() => void openCamera()} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Take photo</button>
          {value && <button type="button" onClick={() => onChange('')} className="px-3 py-2 text-sm font-semibold text-red-600">Remove</button>}
        </div>
      </div>
    </div>
    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setReview(String(reader.result));
      reader.readAsDataURL(file);
      event.target.value = '';
    }} />
    {(stream || review) && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl">
        <h2 className="mb-3 font-semibold">{review ? `Review ${label.toLowerCase()}` : `Take ${label.toLowerCase()}`}</h2>
        {review ? <img src={review} alt="Photo review" className="max-h-[58vh] w-full rounded-xl object-contain" /> : <video ref={videoRef} muted autoPlay playsInline className="max-h-[58vh] w-full rounded-xl bg-black" />}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {review ? <>
            <button type="button" onClick={() => { onChange(review); setReview(null); }} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Use this photo</button>
            <button type="button" onClick={() => { setReview(null); void openCamera(); }} className="rounded-xl border px-4 py-3 text-sm">Retake</button>
          </> : <>
            <button type="button" onClick={stop} className="rounded-xl border px-4 py-3 text-sm">Close</button>
            <button type="button" onClick={capture} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">Capture photo</button>
          </>}
        </div>
      </div>
    </div>}
  </div>;
}
