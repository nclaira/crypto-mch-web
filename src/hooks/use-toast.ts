// =============================================================
// useToast — Custom Hook
// =============================================================
// A "toast" is a small popup message that appears on screen
// for a few seconds then disappears automatically.
// Example: "Login successful!" or "Error: Wrong password"
//
// HOW TO USE IT in any component:
//   const { toast } = useToast();
//   toast({ title: "Success!", description: "You are logged in." });
//   toast({ title: "Error!", description: "Wrong password.", variant: "destructive" });
//
// This hook is self-contained — it does NOT need any external
// UI library. It manages its own list of toasts in memory.
// =============================================================

import * as React from "react";

// How many toasts can be visible at the same time (1 = only one at a time)
const TOAST_LIMIT = 1;

// How long (in ms) before a dismissed toast is fully removed from memory
// 1,000,000ms = very long — the toast component controls visual removal
const TOAST_REMOVE_DELAY = 1000000;

// The shape of a single toast message
export type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive"; // "destructive" = red error toast
  open?: boolean;
};

// The 4 actions that can happen to our toast list
// Think of these like commands you send to update the list
type Action =
  | { type: "ADD_TOAST";     toast: Toast }           // Add a new toast
  | { type: "UPDATE_TOAST";  toast: Partial<Toast> }  // Change an existing toast
  | { type: "DISMISS_TOAST"; toastId?: string }        // Start closing a toast
  | { type: "REMOVE_TOAST";  toastId?: string };       // Fully remove from memory

// The state = the current list of toasts
interface State {
  toasts: Toast[];
}

// A map that stores the auto-remove timers for each toast
// Key = toast id, Value = the setTimeout reference
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Schedules a toast to be fully removed from memory after TOAST_REMOVE_DELAY
const addToRemoveQueue = (toastId: string) => {
  // Don't add a second timer if one already exists for this toast
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// The reducer — a function that takes the current state + an action
// and returns the NEW state. Think of it like a traffic controller.
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {

    case "ADD_TOAST":
      // Add the new toast to the front of the list
      // .slice(0, TOAST_LIMIT) makes sure we never show more than the limit
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      // Find the toast with the matching id and update its properties
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;
      // Schedule removal from memory after the delay
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        // No id given = dismiss ALL toasts
        state.toasts.forEach((t) => addToRemoveQueue(t.id));
      }
      // Set open: false so the toast starts its close animation
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        ),
      };
    }

    case "REMOVE_TOAST":
      // Fully remove the toast from the list
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }; // Remove all
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// Global listeners — every component using useToast() subscribes here
// When the state changes, ALL subscribed components re-render
const listeners: Array<(state: State) => void> = [];

// Global memory — stores the toast list outside of React
// This means toasts persist even if you navigate between pages
let memoryState: State = { toasts: [] };

// dispatch — sends an action to the reducer and notifies all listeners
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// Counter for generating unique toast IDs (1, 2, 3, ...)
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// toast() — the function you call to show a new toast
// Usage: toast({ title: "Done!", description: "Book downloaded." })
function toast(props: Omit<Toast, "id">) {
  const id = genId(); // Give this toast a unique id

  // update() — lets you change the toast after it's already shown
  const update = (updated: Toast) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...updated, id } });

  // dismiss() — starts closing this specific toast
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Add the toast to the global list
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
    },
  });

  // Return helpers so the caller can control this toast later
  return { id, dismiss, update };
}

// useToast() — the hook you call inside a React component
// It subscribes to the global toast list and returns the current toasts
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    // Subscribe: add setState to the listeners array
    // Now whenever dispatch() is called, this component will re-render
    listeners.push(setState);

    // Cleanup: remove this component from listeners when it unmounts
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, [state]);

  return {
    toasts: state.toasts,  // The current list of toasts
    toast,                 // Function to show a new toast
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
