export default function MusicBarDivider() {
  const bars = [96, 92, 100, 88, 94]; // percentages for consistent sizing
  return (
    <div className="w-full min-w-0 flex-1 h-10 my-8 flex flex-col gap-2" aria-hidden>
      {bars.map((pct, idx) => (
        <span
          key={pct + idx}
          style={{ width: `${pct}%` }}
          className="block h-1 rounded-full bg-[var(--text-primary)] transition-colors"
        />
      ))}
    </div>
  );
}
