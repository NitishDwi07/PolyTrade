import { CirclePlus, Flag, Lock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const actions = [
  { title: "Create market", icon: CirclePlus },
  { title: "Close market", icon: Lock },
  { title: "Resolve outcome", icon: Flag },
];

export default function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Market operations"
        description="Create markets, manage lifecycle states, and resolve outcomes with transparent virtual payouts."
      />
      <section className="section-container grid gap-5 pb-16 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <article key={action.title} className="surface-card p-6">
              <Icon className="h-8 w-8 text-cyan-300" />
              <h2 className="mt-5 text-xl font-semibold text-white">{action.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Manage prediction market state with clear controls and audit-friendly outcomes.
              </p>
            </article>
          );
        })}
      </section>
    </>
  );
}
