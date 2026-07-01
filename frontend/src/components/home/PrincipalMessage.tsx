import { Link } from "react-router-dom";
import {
  ArrowRight,
  Quote,
  Mail,
  Phone,
} from "lucide-react";

export default function PrincipalMessage() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Principal Image */}

          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
              alt="School Principal"
              className="w-full h-[650px] object-cover rounded-3xl shadow-xl"
            />

            <div className="absolute -bottom-8 left-8 bg-white rounded-2xl shadow-xl p-6">

              <h3 className="text-xl font-bold text-slate-900">
                Mr. John Doe
              </h3>

              <p className="text-slate-600">
                Head Teacher
              </p>

            </div>

          </div>

          {/* Message */}

          <div>

            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
              A MESSAGE FROM THE HEAD TEACHER
            </span>

            <div className="mt-6">

              <Quote
                size={52}
                className="text-blue-600"
              />

            </div>

            <h2 className="mt-4 text-5xl font-extrabold text-slate-900 leading-tight">
              Welcome to
              <br />
              Mpumudde High School
            </h2>

            <p className="mt-8 text-lg leading-8 text-slate-600">
              At Mpumudde High School, we believe that education extends beyond
              the classroom. Our commitment is to nurture disciplined,
              responsible and innovative learners who are prepared to excel in
              higher education and positively contribute to society.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              We combine academic excellence with character formation,
              leadership development, sports, technology and co-curricular
              activities to ensure every learner receives a balanced education.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              We warmly welcome parents, guardians and prospective students to
              become part of our vibrant learning community.
            </p>

            {/* Contact */}

            <div className="mt-10 flex flex-wrap gap-8">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

                  <Mail
                    className="text-blue-700"
                    size={20}
                  />

                </div>

                <span className="text-slate-700">
                  principal@mpumudde.ac.ug
                </span>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">

                  <Phone
                    className="text-green-700"
                    size={20}
                  />

                </div>

                <span className="text-slate-700">
                  +256 XXX XXX XXX
                </span>

              </div>

            </div>

            {/* Button */}

            <Link
              to="/about"
              className="inline-flex items-center gap-3 mt-12 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300"
            >
              Read Full Message

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}