import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-black text-white">Market not found</h1>
      <p className="mt-4 text-base leading-7 text-slate-300">
        This market is not available. Head back to the market feed to explore active
        YES/NO opportunities.
      </p>
      <Link
        href="/markets"
        className="premium-button mt-6"
      >
        Back to markets
      </Link>
    </section>
  );
}
