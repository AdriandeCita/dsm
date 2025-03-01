import { useDSM } from "../context/dsmEditor";

export default function MatrixControls() {
  const { isBidirectionalLink, setIsBidirectionalLink, wipeMatrix } = useDSM();

  // Function to reset the entire matrix state
  const resetMatrix = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the entire matrix? This action cannot be undone."
      )
    ) {
      wipeMatrix();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.5em",
      }}
    >
      {/* Reset Matrix Button */}
      <button onClick={resetMatrix} style={{ padding: "5px 10px", cursor: "pointer" }}>
        Reset Matrix
      </button>

      {/* Toggle Bidirectional Links */}
      <label htmlFor="is-bidirectional">
        <input
          style={{
            marginRight: "0.5em",
          }}
          id="is-bidirectional"
          type="checkbox"
          checked={isBidirectionalLink}
          onChange={() => setIsBidirectionalLink(!isBidirectionalLink)}
        />
        Bidirectional Links
      </label>
    </div>
  );
}
