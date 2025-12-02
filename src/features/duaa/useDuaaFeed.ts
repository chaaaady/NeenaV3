"use client";

import { useEffect, useMemo, useState } from "react";
import { DUAA_STORAGE_KEY, DUAA_PAGE_SIZE } from "./constants";
import type { Request } from "@/types/duaa";

function loadFeed(): Request[] {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }
    const raw = localStorage.getItem(DUAA_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFeed(feed: Request[]) {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    localStorage.setItem(DUAA_STORAGE_KEY, JSON.stringify(feed));
  } catch {
    // Silent fail
  }
}

export function useDuaaFeed(initialPageSize: number = DUAA_PAGE_SIZE) {
  const [feed, setFeed] = useState<Request[]>([]);
  const [visibleCount, setVisibleCount] = useState(initialPageSize);

  useEffect(() => {
    setFeed(loadFeed());
  }, []);

  const sortedFeed = useMemo(() => {
    return [...feed].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [feed]);

  const showMore = () => setVisibleCount((v) => v + initialPageSize);

  const addRequest = (context_text: string, category_id: string, author: string = "Anonyme") => {
    const trimmed = context_text.trim();
    if (!trimmed) return;
    const request: Request = {
      id: `${Date.now()}`,
      context_text: trimmed,
      category_id: category_id || "other",
      author,
      created_at: new Date().toISOString(),
      counters: {
        duaa_done: 0,
      },
    };
    setFeed((prev) => {
      const next = [request, ...prev];
      saveFeed(next);
      return next;
    });
  };

  const incrementDuaaDone = (id: string) => {
    setFeed((prev) => {
      const next = prev.map((r) =>
        r.id === id
          ? { ...r, counters: { ...r.counters, duaa_done: r.counters.duaa_done + 1 } }
          : r
      );
      saveFeed(next);
      return next;
    });
  };

  return { feed, sortedFeed, visibleCount, showMore, addRequest, incrementDuaaDone };
}

