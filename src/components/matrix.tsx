import { useDSM } from "@/context/dsmEditor";

export default function Matrix() {
  const { components, links, setLinks, isBidirectionalLink } = useDSM();

  // Function to copy matrix to clipboard
  const copyMatrixToClipboard = () => {
    if (components.length === 0) {
      alert("No components to copy!");
      return;
    }

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const headers = ["", ...components.map((_, index) => alphabet[index])].join("\t"); // Top header row
    const rows: string[] = [];

    components.forEach((_, rowIndex) => {
      const rowLabel = alphabet[rowIndex] || rowIndex; // Row identifier (A, B, C...)
      const rowData = [rowLabel];

      components.forEach((_, colIndex) => {
        const isDiagonal = rowIndex === colIndex;
        rowData.push(isDiagonal ? rowLabel : isCellMarked(rowIndex, colIndex) ? "X" : ""); // Use existing function
      });

      rows.push(rowData.join("\t"));
    });

    const matrixText = [headers, ...rows].join("\n");
    navigator.clipboard.writeText(matrixText);
    alert("Matrix copied to clipboard!");
  };

  // Determines if a cell should be marked
  const isCellMarked = (rowIndex: number, colIndex: number) => {
    const rowComponent = components[rowIndex]?.id;
    const colComponent = components[colIndex]?.id;

    if (!rowComponent || !colComponent) return false;

    if (isBidirectionalLink) {
      // Bidirectional mode: check both directions
      return (
        links[rowComponent]?.includes(colComponent) || links[colComponent]?.includes(rowComponent)
      );
    } else {
      // Unidirectional mode: check only row → col
      return links[rowComponent]?.includes(colComponent);
    }
  };

  // Toggle links based on matrix position
  const toggleLink = (rowIdx: number, colIdx: number) => {
    if (rowIdx === colIdx) return; // Ignore diagonal

    const rowComp = components[rowIdx];
    const rowComponentId = rowComp.id;
    const colComp = components[colIdx];
    const colComponentId = colComp.id;

    if (!rowComp || !colComp) return;

    const newLinks = { ...links };

    if (newLinks[rowComponentId]?.includes(colComponentId)) {
      // Remove the link
      newLinks[rowComponentId] = newLinks[rowComponentId].filter((id) => id !== colComponentId);
    } else {
      // Add the link
      newLinks[rowComponentId] = [...(newLinks[rowComponentId] || []), colComponentId];
    }

    setLinks(newLinks);
  };

  return (
    <div style={{ margin: "20px", textAlign: "center", position: "relative" }}>
      {/* Copy Button */}
      <button
        onClick={copyMatrixToClipboard}
        style={{
          position: "absolute",
          top: "-2em",
          width: "13em",
          margin: "0 auto",
          left: 0,
          right: 0,
        }}
      >
        Copy Matrix to Clipboard
      </button>
      <table border={1} cellPadding="5" style={{ borderCollapse: "collapse", margin: "auto" }}>
        <tbody>
          {/* Header Row */}
          <tr>
            <th>#</th>
            {components.map((_, col) => (
              <th style={{ height: "30px" }} key={col}>
                {String.fromCharCode(65 + col)}
              </th> // Convert to A, B, C...
            ))}
          </tr>
          {/* Matrix Rows */}
          {components.map((_, row) => (
            <tr key={row}>
              <th style={{ width: "30px" }}>{String.fromCharCode(65 + row)}</th>
              {components.map((_, col) => {
                const rowComp = components[row];
                const colComp = components[col];

                if (!rowComp || !colComp) return null;

                const isDiagonal = row === col;
                const marked = isCellMarked(row, col);

                return (
                  <td
                    key={col}
                    onClick={() => toggleLink(row, col)}
                    style={{
                      width: "30px",
                      height: "30px",
                      textAlign: "center",
                      cursor: isDiagonal ? "default" : "pointer",
                      backgroundColor: isDiagonal ? "#ddd" : "white",
                      color: "black",
                    }}
                  >
                    {isDiagonal ? String.fromCharCode(65 + row) : marked ? "X" : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
