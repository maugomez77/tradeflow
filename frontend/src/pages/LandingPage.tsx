import { Link } from "react-router-dom";

const features = [
  {
    icon: "\u{1F4CA}",
    title: "Real-Time Dashboard",
    desc: "Monitor revenue, job status, equipment health, and compliance scores at a glance with live KPIs and interactive charts.",
  },
  {
    icon: "\u{1F527}",
    title: "Smart Job Management",
    desc: "Track work orders from scheduling to invoicing. Assign technicians, manage costs, and never miss a deadline.",
  },
  {
    icon: "\u{1F69A}",
    title: "Fleet & Equipment Tracking",
    desc: "Monitor vehicle and tool health scores, schedule preventive maintenance, and reduce costly breakdowns.",
  },
  {
    icon: "\u{1F4B0}",
    title: "Dynamic Pricing Engine",
    desc: "Optimize rates with peak-hour, emergency, and seasonal multipliers. Calculate accurate quotes instantly.",
  },
  {
    icon: "\u{1F6E1}\uFE0F",
    title: "Compliance Tracker",
    desc: "Stay on top of licenses, permits, insurance, and certifications. Get alerts before anything expires.",
  },
  {
    icon: "\u{1F465}",
    title: "Customer Intelligence",
    desc: "Full customer profiles with job history, spending patterns, and service preferences for better relationships.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$49",
    desc: "For solo operators",
    features: [
      "Up to 5 technicians",
      "Job management",
      "Basic dashboard",
      "Equipment tracking",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: "$129",
    desc: "For growing businesses",
    popular: true,
    features: [
      "Up to 25 technicians",
      "Dynamic pricing engine",
      "Compliance tracking",
      "Customer intelligence",
      "Priority support",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: "$299",
    desc: "For large operations",
    features: [
      "Unlimited technicians",
      "Multi-location support",
      "Custom integrations",
      "AI insights & forecasting",
      "Dedicated account manager",
      "SLA guarantee",
    ],
  },
];

const testimonials = [
  {
    quote:
      "TradeFlow cut our scheduling overhead by 60%. We can now handle twice the jobs with the same team.",
    name: "Mike Rodriguez",
    title: "Owner, Bay Area Plumbing Co.",
  },
  {
    quote:
      "The compliance tracker alone saved us from a $15K fine. Every contractor needs this.",
    name: "Lisa Chang",
    title: "Operations Manager, Pacific HVAC",
  },
  {
    quote:
      "Dynamic pricing helped us increase revenue 23% in the first quarter without losing customers.",
    name: "David Thompson",
    title: "CEO, Thompson Electric",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              TF
            </div>
            <span className="text-xl font-bold text-slate-900">
              TradeFlow
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Testimonials
            </a>
            <Link
              to="/app"
              className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Demo
            </Link>
          </div>
          <Link
            to="/app"
            className="sm:hidden px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg"
          >
            Try Demo
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              AI-Powered Business Intelligence
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Run your trades business{" "}
              <span className="text-blue-400">smarter, not harder</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl">
              TradeFlow Intelligence gives plumbing, HVAC, electrical, and
              construction businesses the real-time data and AI insights they
              need to increase revenue, reduce downtime, and stay compliant.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/app"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
              >
                Try Live Demo
                <span className="ml-2">\u2192</span>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-slate-300 text-base font-semibold rounded-lg hover:border-slate-400 hover:text-white transition-colors"
              >
                See Features
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-slate-400">
              <span>No credit card required</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full" />
              <span>Full demo data included</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
              <span className="hidden sm:block">Setup in 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Everything you need to manage your trades business
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From job scheduling to compliance tracking, TradeFlow gives you
              complete visibility and control.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Trusted by trades professionals
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              See how TradeFlow is helping businesses like yours grow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200"
              >
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="font-semibold text-sm text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-xl p-8 border ${
                  tier.popular
                    ? "border-blue-600 ring-2 ring-blue-600 shadow-lg relative"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold text-slate-900">
                  {tier.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{tier.desc}</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {tier.price}
                  </span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <svg
                        className="w-5 h-5 text-blue-600 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/app"
                  className={`mt-8 block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    tier.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to transform your trades business?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join hundreds of plumbing, HVAC, and electrical businesses already
            using TradeFlow to grow smarter.
          </p>
          <Link
            to="/app"
            className="mt-8 inline-flex items-center px-8 py-4 bg-white text-blue-700 text-base font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Try the Live Demo
            <span className="ml-2">\u2192</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              TF
            </div>
            <span className="font-bold text-white">TradeFlow Intelligence</span>
          </div>
          <p className="text-sm">
            &copy; 2026 TradeFlow Intelligence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
