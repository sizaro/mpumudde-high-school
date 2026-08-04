import { useState, type ReactNode } from 'react';
import type { Guardian } from '../../../services/parentService';
import PhotoCapture from '../../../components/forms/PhotoCapture';

export type GuardianFormValues = {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  occupation: string;
  address: string;
  profilePhoto: string;
};

const OCCUPATIONS = ['Self-employed', 'Teacher', 'Civil servant', 'Business owner', 'Farmer', 'Healthcare worker', 'Driver', 'Engineer', 'Lawyer', 'Accountant', 'Security personnel', 'Unemployed'];

export const emptyGuardian: GuardianFormValues = {
  firstName: '', lastName: '', gender: '', phone: '', email: '', occupation: '', address: '', profilePhoto: '',
};

export function guardianToForm(guardian: Guardian): GuardianFormValues {
  return {
    firstName: guardian.firstName ?? '', lastName: guardian.lastName ?? '', gender: guardian.gender ?? '',
    phone: guardian.phone ?? '', email: guardian.email ?? '', occupation: guardian.occupation ?? '',
    address: guardian.address ?? '', profilePhoto: guardian.profilePhoto ?? '',
  };
}

export default function GuardianProfileForm({ initial = emptyGuardian, submitLabel, busy, onSubmit, children }: {
  initial?: GuardianFormValues;
  submitLabel: string;
  busy?: boolean;
  onSubmit: (values: GuardianFormValues) => Promise<void>;
  children?: ReactNode;
}) {
  const [values, setValues] = useState(initial);
  const update = (field: keyof GuardianFormValues, value: string) => setValues((current) => ({ ...current, [field]: value }));

  return <form onSubmit={(event) => { event.preventDefault(); void onSubmit(values); }} className="space-y-6">
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div><h2 className="text-lg font-semibold">Guardian information</h2><p className="mt-1 text-sm text-slate-500">Communication details are separate from the guardian’s portal login.</p></div>
      <PhotoCapture label="Guardian photo" value={values.profilePhoto} onChange={(value) => update('profilePhoto', value)} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="First name" required value={values.firstName} onChange={(value) => update('firstName', value)} />
        <Field label="Last name" required value={values.lastName} onChange={(value) => update('lastName', value)} />
        <Select label="Gender" value={values.gender} onChange={(value) => update('gender', value)} options={['Male', 'Female', 'Other']} />
        <Field label="Phone" required value={values.phone} onChange={(value) => update('phone', value)} />
        <Field label="Communication email" type="email" value={values.email} onChange={(value) => update('email', value)} />
        <OccupationField value={values.occupation} onChange={(value) => update('occupation', value)} />
        <div className="md:col-span-2"><Field label="Address" value={values.address} onChange={(value) => update('address', value)} /></div>
      </div>
    </section>
    {children}
    <button disabled={busy} className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : submitLabel}</button>
  </form>;
}

function Field({ label, value, onChange, required, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) {
  return <label className="block text-sm font-medium text-slate-700">{label}<input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" /></label>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="text-sm font-medium text-slate-700">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"><option value="">Select {label.toLowerCase()}</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function OccupationField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const custom = Boolean(value) && value !== 'Other' && !OCCUPATIONS.includes(value);
  return <label className="text-sm font-medium text-slate-700">Occupation<select value={custom ? 'Other' : value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"><option value="">Select occupation</option>{OCCUPATIONS.map((option) => <option key={option}>{option}</option>)}<option>Other</option></select>{(value === 'Other' || custom) && <input value={custom ? value : ''} onChange={(event) => onChange(event.target.value || 'Other')} placeholder="Type occupation" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" />}</label>;
}
