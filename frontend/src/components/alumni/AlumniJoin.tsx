import { useActionState } from "react";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import alumniService from "../../services/alumniService";

type AlumniJoinState = {
  success: boolean;
  message: string;
  error: string;
};

const initialState: AlumniJoinState = {
  success: false,
  message: "",
  error: "",
};

async function submitAlumniRegistration(
  _previousState: AlumniJoinState,
  formData: FormData,
): Promise<AlumniJoinState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return {
      success: false,
      message: "",
      error: "Please enter your email address.",
    };
  }

  try {
    const response = await alumniService.startRegistration(email);

    return {
      success: true,
      message: response.message,
      error: "",
    };
  } catch (submissionError: any) {
    const backendMessage = submissionError?.response?.data?.message;

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
      error: "We could not start your alumni registration. Please try again.",
    };
  }
}

export default function AlumniJoin() {
  const [state, formAction, isPending] = useActionState(
    submitAlumniRegistration,
    initialState,
  );

  return (
    <section id="join-alumni" className="section-shell scroll-mt-24">
      <div data-aos="fade-up" className="glass-card-solid overflow-hidden">
        <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:p-14">
          <div>
            <span className="section-badge">Join the community</span>

            <h2 className="section-title mt-5">
              Your Mpumudde journey still has a place here.
            </h2>

            <p className="section-lead mt-5 max-w-2xl">
              Register your email to join the Mpumudde Alumni Community. We will
              send you a verification link before you complete your alumni
              profile.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-5">
                <div className="inline-flex rounded-2xl bg-emerald-400/15 p-3">
                  <Mail size={21} className="text-emerald-400" />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Verify your email
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/65">
                  A secure verification link will be sent to the email address
                  you provide.
                </p>
              </div>

              <div className="rounded-3xl bg-white/5 p-5">
                <div className="inline-flex rounded-2xl bg-emerald-400/15 p-3">
                  <ShieldCheck size={21} className="text-emerald-400" />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Complete your profile
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/65">
                  After verification, provide the details you want the school to
                  keep in your alumni record.
                </p>
              </div>
            </div>
          </div>

          <div
            data-aos="fade-left"
            data-aos-delay={120}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8"
          >
            {state.success ? (
              <div className="py-6 text-center">
                <div className="mx-auto inline-flex rounded-full bg-emerald-400/15 p-4">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                  Check your email
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-white/70">
                  {state.message}
                </p>

                <p className="mt-4 text-xs leading-6 text-slate-500 dark:text-white/50">
                  If you do not see the message, check your spam or junk folder.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Start your registration
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/65">
                  Enter the email address you want the school to use for
                  official alumni communication.
                </p>

                <form action={formAction} className="mt-7 space-y-5">
                  <div>
                    <label
                      htmlFor="alumni-email"
                      className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white"
                    >
                      Email address
                    </label>

                    <input
                      id="alumni-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      disabled={isPending}
                      className="w-full rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>

                  {state.error && (
                    <div
                      role="alert"
                      className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-700 dark:text-red-300"
                    >
                      {state.error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="glass-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending
                      ? "Sending verification link..."
                      : "Continue with Email"}

                    {!isPending && <ArrowRight size={18} />}
                  </button>
                </form>

                <p className="mt-5 text-center text-xs leading-5 text-slate-500 dark:text-white/45">
                  Your email must be verified before you can complete your
                  alumni registration.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
