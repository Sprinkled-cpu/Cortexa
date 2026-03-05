export default function GradientHeading({ text, subtitle }) {
  return (
    <div className="mb-10">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight 
        bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
        bg-clip-text text-transparent animate-gradient">
        {text}
      </h1>

      {subtitle && (
        <p className="mt-4 text-gray-400 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
