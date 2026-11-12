export default function Chip({
  children,
  tone = "plain",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "plain" | "solid";
  className?: string;
}) {
  const tones = {
    plain: "border-desconocido text-pared",
    solid: "border-pared bg-pared text-libre",
  } as const;
  return (
    <span
      className={`label inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] leading-none ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
