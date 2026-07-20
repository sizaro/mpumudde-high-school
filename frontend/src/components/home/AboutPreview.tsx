import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  School,
  Target,
  Eye,
} from "lucide-react";

const values = [
  "Academic Excellence",
  "Integrity & Discipline",
  "Leadership Development",
  "Innovation & Technology",
];

export default function AboutPreview() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <div className="relative">

            <img
              src="/images/school_class_school_children.jpg"
              alt="Mpumudde High School"
              className="rounded-3xl shadow-2xl w-full h-[620px] object-cover"
            />

            {/* Floating Card */}

            <div className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-xl p-6 max-w-xs">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">

                  <School className="text-blue-700" size={28} />

                </div>

                <div>

                  <h3 className="font-bold text-xl text-slate-900">
                    Established
                  </h3>

                  <p className="text-slate-600">
                    Over 30 Years of Excellence
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
              ABOUT MPUMUDDE HIGH SCHOOL
            </span>

            <h2 className="mt-6 text-5xl font-extrabold text-slate-900 leading-tight">
              Nurturing Knowledge,
              Character &
              Future Leaders
            </h2>

            <p className="mt-8 text-lg leading-8 text-slate-600">
              Mpumudde High School is committed to providing a holistic education
              that equips learners with academic excellence, leadership skills,
              discipline, innovation, and strong moral values. We strive to
              prepare students for higher education, meaningful careers, and
              responsible citizenship.
            </p>

            {/* Vision */}

            <div className="mt-10 flex gap-5">

              <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">

                <Eye className="text-indigo-700" />

              </div>

              <div>

                <h3 className="font-bold text-2xl text-slate-900">
                  Our Vision
                </h3>

                <p className="mt-2 text-slate-600 leading-7">
                  To be a leading centre of academic excellence,
                  innovation, leadership and character development.
                </p>

              </div>

            </div>

            {/* Mission */}

            <div className="mt-8 flex gap-5">

              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">

                <Target className="text-green-700" />

              </div>

              <div>

                <h3 className="font-bold text-2xl text-slate-900">
                  Our Mission
                </h3>

                <p className="mt-2 text-slate-600 leading-7">
                  To provide quality education through committed teaching,
                  innovation, discipline and a supportive learning environment
                  that enables every learner to reach their full potential.
                </p>

              </div>

            </div>

            {/* Values */}

            <div className="grid sm:grid-cols-2 gap-4 mt-10">

              {values.map((value) => (

                <div
                  key={value}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    className="text-green-600"
                    size={22}
                  />

                  <span className="font-medium text-slate-700">
                    {value}
                  </span>

                </div>

              ))}

            </div>

            {/* Button */}

            <Link
              to="/about"
              className="inline-flex items-center gap-3 mt-12 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Learn More About Us

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}