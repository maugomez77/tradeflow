import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/app", label: "Dashboard", icon: "\u{1F4CA}", end: true },
  { to: "/app/jobs", label: "Jobs", icon: "\u{1F527}" },
  { to: "/app/equipment", label: "Equipment", icon: "\u{1F69A}" },
  { to: "/app/customers", label: "Customers", icon: "\u{1F465}" },
  { to: "/app/pricing", label: "Pricing", icon: "\u{1F4B0}" },
  { to: "/app/compliance", label: "Compliance", icon: "\u{1F6E1}\uFE0F" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
            TF
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">TradeFlow</h1>
            <p className="text-[11px] text-slate-400">Intelligence Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <span className="text-lg">\u2190</span>
            Back to Home
          </a>
        </div>
      </aside>
    </>
  );
}
