import "./css/Spinner.css";

type SpinnerProps = {
  size?: number;
  color?: string;
  borderWidth?: number;
};

function Spinner({
  size = 16,
  color = "white",
  borderWidth = 2,
}: SpinnerProps) {
  return (
    <span
      className="spinner"
      style={{
        "--spinner-size": `${size}px`,
        "--spinner-border-width": `${borderWidth}px`,
        "--spinner-color": color,
        "--spinner-track": color === "white" ? "var(--spinner-border-light)" : "var(--spinner-border-dark)",
      } as React.CSSProperties}
    />
  );
}

export default Spinner;
