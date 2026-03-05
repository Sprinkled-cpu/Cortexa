export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="h-5 w-5 rounded-full border-2 border-gray-500 border-t-white animate-spin" />
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  );
}
