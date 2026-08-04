import { useEffect, useState } from "react";
import { newsroomService } from "../services/newsroomService";
import type { NewsroomQuery, NewsroomResult } from "./types";

const emptyResult: NewsroomResult = { items: [], total: 0, page: 1, pageSize: 9, totalPages: 1 };

export function useNewsroom(query: NewsroomQuery) {
  const [result, setResult] = useState<NewsroomResult>(emptyResult);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const key = JSON.stringify(query);

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    void newsroomService.list(query).then((next) => { if (active) setResult(next); }).catch(() => { if (active) setError("Newsroom stories could not be loaded."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [key]);

  return { result, loading, error };
}
