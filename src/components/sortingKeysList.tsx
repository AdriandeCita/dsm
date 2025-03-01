import { useState, useEffect } from "react";
import { SortingKey, useDSM } from "../context/dsmEditor";

export default function SortingKeysList() {
  const { components, sortingKeys, setSortingKeys, sortComponentsByKeys } = useDSM();
  const [localKeys, setLocalKeys] = useState<SortingKey[]>([]);

  // Sync local state with context whenever components change
  useEffect(() => {
    setLocalKeys(
      components.map((comp, index) => ({
        id: comp.id,
        key: sortingKeys[index]?.key || "", // Default to empty string
      }))
    );
  }, [components, sortingKeys]);

  // Handle input change locally
  const handleChange = (id: string, value: string) => {
    if (value.length > 2) return; // Restrict to max 2 characters
    setLocalKeys((prev) =>
      prev.map((key) => (key.id === id ? { ...key, key: value.toUpperCase() } : key))
    );
  };

  // Save changes to context on blur
  const handleBlur = () => {
    setSortingKeys(localKeys);
  };

  return (
    <div style={{ margin: "20px", textAlign: "left" }}>
      <h2>Sorting Keys</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {localKeys.map((key) => (
          <li key={key.id} style={{ marginBottom: "8px" }}>
            <input
              type="text"
              value={key.key}
              onChange={(e) => handleChange(key.id, e.target.value)}
              onBlur={handleBlur}
              style={{ width: "50px", textAlign: "center", textTransform: "uppercase" }}
              maxLength={2}
            />
          </li>
        ))}
      </ul>
      <button onClick={sortComponentsByKeys} style={{}}>
        Sort Components
      </button>
    </div>
  );
}
