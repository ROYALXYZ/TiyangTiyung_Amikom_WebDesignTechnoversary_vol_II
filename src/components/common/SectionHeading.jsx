export default function SectionHeading({ title, subtitle, as: Tag = 'h2' }) {
  return <div className="reveal mb-8 max-w-3xl md:mb-10"><Tag className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{title}</Tag><p className="mt-5 text-lg font-medium leading-relaxed text-slate-700 sm:text-xl">{subtitle}</p></div>
}
