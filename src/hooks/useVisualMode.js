import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);

    const newHistory = [...history];
    if (replace) {
      newHistory.pop();
    }
    newHistory.push(newMode);
    setHistory(prev => [...prev, ...newHistory]);
  }

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2]);

      const newHistory = [...history];
      newHistory.pop();
      setHistory(prev => [...prev, ...newHistory]);
    }
  }

  return { mode, transition, back };
}