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
        width: `${size}px`,
        height: `${size}px`,
        border: `${borderWidth}px solid rgba(${
          color === "white" ? "255, 255, 255" : "0, 0, 0"
        }, 0.3)`,
        borderTop: `${borderWidth}px solid ${color}`,
      }}
    />
  );
}

export default Spinner;
