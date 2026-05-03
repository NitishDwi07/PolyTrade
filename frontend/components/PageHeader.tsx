type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="section-container pb-8 pt-12">
      <div className="glass-panel p-6 sm:p-8">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="max-w-3xl text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{description}</p>
      </div>
    </section>
  );
}
