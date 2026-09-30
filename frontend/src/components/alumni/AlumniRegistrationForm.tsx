import { useActionState, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  ImagePlus,
  LoaderCircle,
  Mail,
  UserRound,
  X,
} from "lucide-react";
import alumniService from "../../services/alumniService";

type AlumniRegistrationFormProps = {
  token: string;
};

type RegistrationState = {
  success: boolean;
  message: string;
  error: string;
};

const initialState: RegistrationState = {
  success: false,
  message: "",
  error: "",
};

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function submitAlumniRegistration(
  _previousState: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const token = String(formData.get("token") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();

  const graduationYearValue = String(
    formData.get("graduationYear") ?? "",
  ).trim();

  const studentPeriod = String(formData.get("studentPeriod") ?? "").trim();

  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();

  const rememberedPerson = String(
    formData.get("rememberedPerson") ?? "",
  ).trim();

  const profileImage = formData.get("profileImage");

  if (!token) {
    return {
      success: false,
      message: "",
      error: "Your registration link is missing or invalid.",
    };
  }

  if (!fullName) {
    return {
      success: false,
      message: "",
      error: "Please enter your full name.",
    };
  }

  let graduationYear: number | undefined;

  if (graduationYearValue) {
    const parsedYear = Number(graduationYearValue);

    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < 1900 ||
      parsedYear > 2100
    ) {
      return {
        success: false,
        message: "",
        error: "Please enter a valid graduation year between 1900 and 2100.",
      };
    }

    graduationYear = parsedYear;
  }

  try {
    const response = await alumniService.completeRegistration({
      token,
      fullName,
      graduationYear,
      studentPeriod: studentPeriod || undefined,
      whatsappNumber: whatsappNumber || undefined,
      rememberedPerson: rememberedPerson || undefined,
      profileImage:
        profileImage instanceof File && profileImage.size > 0
          ? profileImage
          : null,
    });

    return {
      success: true,
      message: response.message,
      error: "",
    };
  } catch (error: unknown) {
    const backendMessage =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data
        ? error.response.data.message
        : undefined;

    if (Array.isArray(backendMessage)) {
      return {
        success: false,
        message: "",
        error: backendMessage.join(" "),
      };
    }

    if (typeof backendMessage === "string") {
      return {
        success: false,
        message: "",
        error: backendMessage,
      };
    }

    return {
      success: false,
      message: "",
      error:
        "We could not complete your alumni registration. Please try again.",
    };
  }
}

export default function AlumniRegistrationForm({
  token,
}: AlumniRegistrationFormProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState("");

  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(
    null,
  );
  const [profileFileName, setProfileFileName] = useState("");
  const [profileFileSize, setProfileFileSize] = useState<number | null>(null);
  const [profileImageError, setProfileImageError] = useState("");

  const [state, formAction, isPending] = useActionState(
    submitAlumniRegistration,
    initialState,
  );

  useEffect(() => {
    let isMounted = true;

    async function verifyToken() {
      setIsVerifying(true);
      setVerificationError("");
      setEmail(null);

      try {
        const response = await alumniService.verifyRegistrationToken(token);

        if (!isMounted) {
          return;
        }

        if (!response.valid || !response.email) {
          setVerificationError(
            "This registration link is invalid or has expired. Please start your registration again.",
          );
          return;
        }

        setEmail(response.email);
      } catch {
        if (!isMounted) {
          return;
        }

        setVerificationError(
          "We could not verify this registration link. Please request a new verification email.",
        );
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    if (!token) {
      setVerificationError(
        "This registration link is missing a verification token.",
      );
      setIsVerifying(false);
      return;
    }

    void verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    return () => {
      if (profilePreviewUrl) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
    };
  }, [profilePreviewUrl]);

  function handleProfileImageChange(file: File | null) {
    setProfileImageError("");

    if (!file) {
      setProfilePreviewUrl(null);
      setProfileFileName("");
      setProfileFileSize(null);
      return;
    }

    if (!ALLOWED_PROFILE_IMAGE_TYPES.includes(file.type)) {
      setProfileImageError("Please choose a JPEG, PNG, or WEBP image.");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setProfileImageError("The profile photo must be 5 MB or smaller.");
      return;
    }

    setProfileFileName(file.name);
    setProfileFileSize(file.size);

    const previewUrl = URL.createObjectURL(file);
    setProfilePreviewUrl(previewUrl);
  }

  function clearProfileImage() {
    setProfileImageError("");
    setProfilePreviewUrl(null);
    setProfileFileName("");
    setProfileFileSize(null);
  }

  function formatFileSize(size: number | null) {
    if (size === null) {
      return "";
    }

    if (size < 1024 * 1024) {
      return `${Math.round(size / 1024)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (isVerifying) {
    return (
      <section className="section-shell">
        <div data-aos="fade-up" className="mx-auto max-w-3xl">
          <div className="glass-card-solid p-8 text-center md:p-12">
            <div className="mx-auto inline-flex rounded-full bg-emerald-400/15 p-4">
              <LoaderCircle
                size={30}
                className="animate-spin text-emerald-400"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              Verifying your email
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-white/70">
              Please wait while we verify your alumni registration link.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (verificationError || !email) {
    return (
      <section className="section-shell">
        <div data-aos="fade-up" className="mx-auto max-w-3xl">
          <div className="glass-card-solid p-8 text-center md:p-12">
            <div className="mx-auto inline-flex rounded-full bg-red-400/10 p-4">
              <AlertCircle size={30} className="text-red-500" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              Registration link unavailable
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-white/70">
              {verificationError}
            </p>

            <a
              href="/alumni#join-alumni"
              className="glass-button mt-7 inline-flex"
            >
              Start Again
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (state.success) {
    return (
      <section className="section-shell">
        <div data-aos="fade-up" className="mx-auto max-w-3xl">
          <div className="glass-card-solid p-8 text-center md:p-12">
            <div className="mx-auto inline-flex rounded-full bg-emerald-400/15 p-4">
              <CheckCircle2 size={34} className="text-emerald-400" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              Welcome to the Mpumudde Alumni Community
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-white/70">
              {state.message}
            </p>

            <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-slate-500 dark:text-white/50">
              You can now remain connected with Mpumudde High School and the
              wider alumni community.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell">
      <div data-aos="fade-up" className="mx-auto max-w-4xl">
        <div className="mb-8 max-w-3xl">
          <span className="section-badge">Email verified</span>

          <h1 className="section-title mt-4">Complete your alumni profile.</h1>

          <p className="section-lead mt-4">
            Tell Mpumudde a little about your journey. Only the information you
            choose to provide will be added to your alumni record.
          </p>
        </div>

        <div className="glass-card-solid overflow-hidden">
          <form
            action={formAction}
            encType="multipart/form-data"
            className="p-8 md:p-10 lg:p-12"
          >
            <input type="hidden" name="token" value={token} />

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-2xl bg-emerald-400/15 p-3">
                      <Mail size={21} className="text-emerald-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">
                        Verified email
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold text-slate-900 dark:text-white">
                        {email}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-white/50">
                        This email has been verified and cannot be changed
                        during this registration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="alumni-full-name"
                  className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="alumni-full-name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={160}
                    required
                    disabled={isPending}
                    className="w-full rounded-2xl border border-slate-300 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="alumni-graduation-year"
                  className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                >
                  Graduation year
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-white/45">
                    Optional
                  </span>
                </label>

                <div className="relative">
                  <GraduationCap
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="alumni-graduation-year"
                    name="graduationYear"
                    type="number"
                    min={1900}
                    max={2100}
                    step={1}
                    placeholder="e.g. 2018"
                    disabled={isPending}
                    className="w-full rounded-2xl border border-slate-300 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="alumni-student-period"
                  className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                >
                  Period at Mpumudde
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-white/45">
                    Optional
                  </span>
                </label>

                <input
                  id="alumni-student-period"
                  name="studentPeriod"
                  type="text"
                  maxLength={50}
                  placeholder="e.g. 2015 - 2019"
                  disabled={isPending}
                  className="w-full rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="alumni-whatsapp"
                  className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                >
                  WhatsApp number
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-white/45">
                    Optional
                  </span>
                </label>

                <input
                  id="alumni-whatsapp"
                  name="whatsappNumber"
                  type="tel"
                  maxLength={30}
                  placeholder="+256 7XX XXX XXX"
                  autoComplete="tel"
                  disabled={isPending}
                  className="w-full rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="alumni-remembered-person"
                  className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                >
                  A person you remember
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-white/45">
                    Optional
                  </span>
                </label>

                <input
                  id="alumni-remembered-person"
                  name="rememberedPerson"
                  type="text"
                  maxLength={200}
                  placeholder="Teacher, classmate, or staff member"
                  disabled={isPending}
                  className="w-full rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="alumni-profile-image"
                  className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                >
                  Profile photo
                  <span className="ml-2 text-xs font-normal text-slate-500 dark:text-white/45">
                    Optional
                  </span>
                </label>

                <div className="rounded-3xl border border-dashed border-slate-300 bg-white/40 p-6 dark:border-white/15 dark:bg-white/5">
                  {profilePreviewUrl ? (
                    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                      <div className="relative shrink-0">
                        <img
                          src={profilePreviewUrl}
                          alt="Selected profile photo preview"
                          className="h-32 w-32 rounded-3xl object-cover ring-2 ring-emerald-400/30"
                        />
                      </div>

                      <div className="min-w-0 flex-1 text-center sm:text-left">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Photo selected
                        </p>

                        <p className="mt-1 break-all text-xs leading-5 text-slate-500 dark:text-white/50">
                          {profileFileName}
                        </p>

                        {profileFileSize !== null && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-white/45">
                            {formatFileSize(profileFileSize)}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                          <label
                            htmlFor="alumni-profile-image"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-400/5 dark:border-white/15 dark:text-white"
                          >
                            <ImagePlus size={15} />
                            Change photo
                          </label>

                          <button
                            type="button"
                            onClick={clearProfileImage}
                            disabled={isPending}
                            className="inline-flex items-center gap-2 rounded-full border border-red-400/20 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-300"
                          >
                            <X size={15} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="alumni-profile-image"
                      className="flex cursor-pointer flex-col items-center justify-center px-2 py-8 text-center transition"
                    >
                      <div className="rounded-2xl bg-emerald-400/15 p-4">
                        <ImagePlus size={26} className="text-emerald-400" />
                      </div>

                      <span className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                        Choose a profile photo
                      </span>

                      <span className="mt-2 text-xs leading-5 text-slate-500 dark:text-white/50">
                        JPEG, PNG, or WEBP. Maximum 5 MB.
                      </span>
                    </label>
                  )}

                  <input
                    id="alumni-profile-image"
                    name="profileImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isPending}
                    className="sr-only"
                    onChange={(event) => {
                      handleProfileImageChange(event.target.files?.[0] ?? null);
                    }}
                  />
                </div>

                {profileImageError && (
                  <div
                    role="alert"
                    className="mt-3 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs leading-5 text-red-700 dark:text-red-300"
                  >
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />

                    <span>{profileImageError}</span>
                  </div>
                )}
              </div>

              {state.error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-700 dark:text-red-300 lg:col-span-2"
                >
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />

                  <span>{state.error}</span>
                </div>
              )}

              <div className="lg:col-span-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="glass-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending
                    ? "Creating your alumni profile..."
                    : "Complete Alumni Registration"}

                  {!isPending && <ArrowRight size={18} />}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500 dark:text-white/45">
                  Registration is automatic after you submit this form. If the
                  school finds a possible match with an existing student record,
                  your registration will still continue.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
