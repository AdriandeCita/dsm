import { ReactNode, useState } from "react";
import { useDSM } from "../context/dsmEditor";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";

export default function ComponentsList() {
  const { components, addComponent, setState, removeComponent, reorderComponents } = useDSM();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  // Function to copy components to clipboard
  const copyComponentsToClipboard = async () => {
    const text = components.map((entry) => entry.name).join("\n"); // Tab-separated for spreadsheet pasting
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Handle edit mode activation
  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setTempName(name);
  };

  // Save changes and exit edit mode
  const handleSave = (id: string) => {
    if (tempName.trim() === "") return; // Prevent empty names

    // Update component name in context
    setState((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.id === id ? { ...comp, name: tempName } : comp
      ),
    }));
    setEditingId(null);
  };

  // Handle key press (Enter to save)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      handleSave(id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = components.findIndex((entry) => entry.id === active.id);
    const newIndex = components.findIndex((entry) => entry.id === over.id);
    reorderComponents(oldIndex, newIndex);
  };

  return (
    <div style={{ margin: "20px", textAlign: "left", position: "relative" }}>
      <h2>Components List</h2>
      {/* Copy Button */}
      <button
        onClick={copyComponentsToClipboard}
        style={{
          position: "absolute",
          top: "-2em",
          margin: "0 auto",
          left: 0,
          right: 0,
          width: "12em",
        }}
      >
        Copy List to Clipboard
      </button>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={components} strategy={verticalListSortingStrategy}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {components.map((comp) => (
              <SortableComponent key={comp.id} id={comp.id}>
                {/* If editing, show input, otherwise show text */}
                {editingId === comp.id ? (
                  <input
                    type="text"
                    value={tempName}
                    onChange={handleChange}
                    onBlur={() => handleSave(comp.id)}
                    onKeyDown={(e) => handleKeyDown(e, comp.id)}
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => handleEdit(comp.id, comp.name)}
                    style={{ cursor: "pointer" }}
                  >
                    {comp.name}
                  </span>
                )}

                {/* Delete button */}
                <button
                  onClick={() => removeComponent(comp.id)}
                  style={{
                    marginLeft: "10px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </SortableComponent>
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <button onClick={() => addComponent("New Component")} style={{}}>
        Add new component
      </button>
    </div>
  );
}

// Draggable Component
function SortableComponent({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // cursor: "grab",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
    lineHeight: "22px",
    position: "relative" as const,
    paddingLeft: "1.5em",
  };

  return (
    <li ref={setNodeRef} style={style}>
      <div
        {...listeners}
        {...attributes}
        style={{
          cursor: "grab",
          padding: "0 4px",
          position: "absolute",
          left: "0",
        }}
      >
        ⠿
      </div>
      {children}
    </li>
  );
}
