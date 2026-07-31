import { useEffect, useState } from "react";
import api from "../../api/axios";
import parentService from "../../services/parentService";
import { useParentDashboard } from "./ParentDashboardContext";

export default function ParentSettings() {
  const { data, loading, error, refresh } = useParentDashboard();
  const [formState, setFormState] = useState({
    phone: "",
    address: "",
    occupation: "",
    profilePhoto: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setFormState({
        phone: data.parent.phone ?? "",
        address: data.parent.address ?? "",
        occupation: data.parent.occupation ?? "",
        profilePhoto: data.parent.profilePhoto ?? "",
      });
      setPhotoFile(null);
      setPreviewUrl(data.parent.profilePhoto ?? null);
    }
  }, [data]);

  useEffect(() => {
    if (!photoFile) return;
    const objectUrl = URL.createObjectURL(photoFile);
    setPreviewUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photoFile]);

  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (loading) return <p className="text-slate-600">Loading settings...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-slate-600">No parent profile is available.</p>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      let profilePhotoUrl = formState.profilePhoto || null;

      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        const { data: uploadResult } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profilePhotoUrl = uploadResult.url;
      }

      await parentService.updateProfile({
        phone: formState.phone || null,
        address: formState.address || null,
        occupation: formState.occupation || null,
        profilePhoto: profilePhotoUrl,
      });
      setStatus("Profile updated successfully.");
      setIsEditing(false);
      await refresh();
    } catch {
      setStatus("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (data) {
      setFormState({
        phone: data.parent.phone ?? "",
        address: data.parent.address ?? "",
        occupation: data.parent.occupation ?? "",
        profilePhoto: data.parent.profilePhoto ?? "",
      });
      setPhotoFile(null);
      setPreviewUrl(data.parent.profilePhoto ?? null);
    }
    setStatus(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="mt-2 text-sm text-slate-500">Update your parent contact details and profile photo.</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Edit profile settings
              </button>
            )}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600">First name</label>
            <input value={data.parent.firstName} disabled className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Last name</label>
            <input value={data.parent.lastName} disabled className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Phone</label>
            <input
              value={formState.phone}
              disabled={!isEditing}
              onChange={(e) => setFormState((current) => ({ ...current, phone: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Address</label>
            <input
              value={formState.address}
              disabled={!isEditing}
              onChange={(e) => setFormState((current) => ({ ...current, address: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Occupation</label>
            <input
              value={formState.occupation}
              disabled={!isEditing}
              onChange={(e) => setFormState((current) => ({ ...current, occupation: e.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>
          {isEditing && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-600">Profile photo</label>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-200">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-500">No photo</div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                      Choose image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setPhotoFile(file);
                        }}
                      />
                    </label>
                    {(photoFile || previewUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoFile(null);
                          setPreviewUrl(data?.parent.profilePhoto ?? null);
                        }}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        Clear selected photo
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-600">Profile photo URL (optional)</label>
                  <input
                    value={formState.profilePhoto}
                    onChange={(e) => setFormState((current) => ({ ...current, profilePhoto: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Uploaded image will override the URL when submitting.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <button type="submit" disabled={!isEditing || saving} className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save changes"}
        </button>
        {status ? <p className="text-sm text-slate-700">{status}</p> : null}
      </form>
    </div>
  );
}
