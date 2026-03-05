export default function GlowButton({
  children,
  variant = "primary",
  onClick,
}) {
  const base =
    "relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-white text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]",
    outline:
      "border border-gray-700 text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.35)]",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
