"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./api";

/** Loads a list from the backend; falls back to sample data when the backend is offline. */
export function useList<T>(path: string, fallback: T[]) {
  const fb = useRef(fallback);
  const [data, setData] = useState<T[]>(fallback);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    setLoading(true);
    api<T[]>(path)
      .then((d) => { setData(d); setLive(true); })
      .catch(() => { setData(fb.current); setLive(false); })
      .finally(() => setLoading(false));
  }, [path]);
  useEffect(() => { reload(); }, [reload]);
  return { data, live, loading, reload };
}
