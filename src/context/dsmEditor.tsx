import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface SystemComponent {
  id: string;
  name: string;
}
export interface SortingKey {
  id: string;
  key: string;
}
export type SystemComponentLinks = Record<string, string[]>;
interface Data {
  components: SystemComponent[];
  links: SystemComponentLinks;
  isBidirectionalLink: boolean;
}

interface DsmContext extends Data {
  setState: Dispatch<SetStateAction<Data>>;
  setLinks: (_: SystemComponentLinks) => void;
  addComponent: (_: string) => void;
  removeComponent: (_: string) => void;
  setIsBidirectionalLink: (_: boolean) => void;
  wipeMatrix: () => void;
  reorderComponents: (_: number, __: number) => void;
}

const STORAGE_KEY = "dsm-editor-data"; // LocalStorage key

// Create the context
const DSMContext = createContext<DsmContext>({
  components: [],
  links: {},
  isBidirectionalLink: false,
  setLinks: () => {},
  addComponent: () => {},
  removeComponent: () => {},
  setState: () => {},
  setIsBidirectionalLink: () => {},
  wipeMatrix: () => {},
  reorderComponents: () => {},
});

// Custom hook for consuming the context
export const useDSM = () => useContext(DSMContext);

// Context Provider Component
export const DSMProvider = ({ children }: { children: ReactNode }) => {
  // Load state from localStorage or initialize empty
  const loadState = () => {
    try {
      const persistedData = localStorage.getItem(STORAGE_KEY);
      const data = persistedData ? JSON.parse(persistedData) : {};
      if (data) {
        return {
          components: data.components || [],
          sortingKeys: data.sortingKeys || [],
          links: data.links || {},
          isBidirectionalLink: data.isBidirectionalLink || false,
        };
      }
    } catch (error) {
      console.error("Error loading DSM data:", error);
    }
    return { components: [], sortingKeys: [], links: {}, isBidirectionalLink: false };
  };

  const [state, setState] = useState<Data>(loadState);

  useEffect(() => {
    const hasUserBeenTherePreviously = localStorage.getItem(STORAGE_KEY) !== null;

    if (!hasUserBeenTherePreviously) {
      addComponent("Tail");
      addComponent("Wings");
      addComponent("Fuselage");
      addComponent("Canopy");
    }
  }, []);

  // Auto-save to localStorage on any state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Add a component
  const addComponent = (name: string) => {
    const id = uuidv4();
    setState((prev) => ({
      ...prev,
      components: [...prev.components, { id, name }],
      links: { ...prev.links, [id]: [] }, // Initialize empty links
    }));
  };

  // Remove a component and its links
  const removeComponent = (id: string) => {
    setState((prev) => {
      const newLinks = { ...prev.links };
      delete newLinks[id];
      Object.keys(newLinks).forEach((key) => {
        newLinks[key] = newLinks[key].filter((linkedId) => linkedId !== id);
      });

      return {
        ...prev,
        components: prev.components.filter((comp) => comp.id !== id),
        links: newLinks,
      };
    });
  };

  // Update links
  const setLinks = (newLinks: SystemComponentLinks) => {
    setState((prev) => ({ ...prev, links: newLinks }));
  };

  const setIsBidirectionalLink = useCallback(
    (flag: boolean) => {
      setState({ ...state, isBidirectionalLink: flag });
    },
    [state]
  );

  const wipeMatrix = () => {
    setState((prev) => ({
      ...prev,
      components: [],
      sortingKeys: [],
      links: {},
    }));
  };

  // Function to reorder components after drag and drop
  const reorderComponents = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;

    const { components } = state;

    const updatedList = [...components];
    const [movedItem] = updatedList.splice(oldIndex, 1);
    updatedList.splice(newIndex, 0, movedItem);

    setState({ ...state, components: updatedList });
  };

  return (
    <DSMContext.Provider
      value={{
        ...state,
        addComponent,
        removeComponent,
        setLinks,
        setState,
        setIsBidirectionalLink,
        wipeMatrix,
        reorderComponents,
      }}
    >
      {children}
    </DSMContext.Provider>
  );
};
