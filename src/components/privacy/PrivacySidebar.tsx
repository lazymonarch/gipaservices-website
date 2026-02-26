"use client";

import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

interface PrivacySidebarProps {
  sections: Section[];
  activeId: string;
}

const PrivacySidebar = ({ sections, activeId }: PrivacySidebarProps) => {
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">
        Contents
      </p>
      {sections.map((section) => {
        const isActive = activeId === section.id;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            className={cn(
              "group relative flex w-full items-center px-2.5 py-2.5 text-left text-sm transition-all duration-300",
              isActive
                ? "text-slate-900 font-semibold transform-gpu translate-x-2 scale-[1.03] shadow-[0_10px_18px_rgba(15,23,42,0.16)]"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            {section.label}
          </button>
        );
      })}
    </nav>
  );
};

export default PrivacySidebar;
