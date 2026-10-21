import { useActionState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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

const illustrativeAlumniImage = "/images/alumni/alumni-join-illustrative.png";

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
      <div data-aos="fade-up" className="overflow-hidden rounded-2xl bg-[#071d3a] shadow-xl">
        <div className="grid lg:grid-cols-[.82fr_1.18fr]">
          <div className="relative hidden min-h-[29rem] lg:block">
            <img
              src={illustrativeAlumniImage}
              alt="Illustrative alumni community placeholder"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071d3a]/10 via-[#071d3a]/20 to-[#071d3a]/70" />
            <span className="absolute bottom-5 left-5 rounded bg-[#071d3a]/75 px-3 py-2 text-xs font-semibold text-white/90">
              Illustrative image
            </span>
          </div>

          <div className="relative overflow-hidden px-7 py-12 text-white md:px-12 lg:py-16">
            <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#1261d0]/30 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[.24em] text-[#f2c64c]">
                Join the community
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight md:text-4xl">
                Your Mpumudde journey still has a place here.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/85">
                Register your email to join the Mpumudde Alumni Community. We will
                send you a verification link before you complete your alumni profile.
              </p>

              <p className="mt-6 text-sm font-semibold text-white">
                Start your registration
              </p>

              <p className="mt-1 text-sm leading-6 text-white/70">
                Enter the email address the school should use for official alumni communication.
              </p>

              <div
                data-aos="fade-left"
                data-aos-delay={120}
                className="mt-6"
              >
            {state.success ? (
              <div className="rounded-xl border border-emerald-300/25 bg-white/10 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto inline-flex rounded-full bg-emerald-400/15 p-3">
                  <CheckCircle2 size={28} className="text-emerald-300" />
                </div>
                <h3 className="mt-4 text-xl font-bold">Check your email</h3>
                <p className="mt-3 text-sm leading-7 text-white/80">{state.message}</p>
                <p className="mt-4 text-xs leading-6 text-white/65">
                  If you do not see the message, check your spam or junk folder.
                </p>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                  <label htmlFor="alumni-email" className="sr-only">Email address</label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="alumni-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      disabled={isPending}
                      className="min-w-0 flex-1 rounded-lg border border-white/40 bg-white px-4 py-3 text-sm text-[#081a2b] outline-none transition placeholder:text-slate-500 focus:border-[#f2c64c] focus:ring-2 focus:ring-[#f2c64c]/45 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1261d0] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0e52b2] focus:outline-none focus:ring-2 focus:ring-[#f2c64c] focus:ring-offset-2 focus:ring-offset-[#071d3a] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPending ? "Sending…" : "Continue with Email"}
                      {!isPending && <ArrowRight size={17} />}
                    </button>
                  </div>
                  {state.error && (
                    <div
                      role="alert"
                      className="rounded-lg border border-red-300/35 bg-red-500/15 px-4 py-3 text-sm leading-6 text-red-100"
                    >
                      {state.error}
                    </div>
                  )}
              </form>
            )}
              </div>
              {!state.success && <p className="mt-4 text-xs leading-5 text-white/65">Your email must be verified before you can complete your alumni registration.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

