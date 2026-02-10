export default function GlassButton({ text, onClick, type }) {
  return (
    <button
      className={`glass-btn ${type === "secondary" ? "secondary" : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
