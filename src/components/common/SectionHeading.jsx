export default function SectionHeading({ title, subtitle }) {
  return <div className="reveal mb-8 max-w-3xl md:mb-10"><h2 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{title}</h2><p className="mt-5 text-lg font-medium leading-relaxed text-slate-700 sm:text-xl">{subtitle}</p></div>
}
