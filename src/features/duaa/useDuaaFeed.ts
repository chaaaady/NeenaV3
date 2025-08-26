"use client";

import { useEffect, useMemo, useState } from "react";
import { DUAA_STORAGE_KEY, DUAA_PAGE_SIZE } from "./constants";

export type DuaaComment = { id: string; author: string; text: string; createdAt: number };
export type DuaaPost = { id: string; text: string; author?: string; likes: number; reposts: number; createdAt: number; comments?: DuaaComment[] };

function loadFeed(): DuaaPost[] {
  try {
    const raw = localStorage.getItem(DUAA_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DuaaPost[]) : [];
  } catch {
    return [];
  }
}

function saveFeed(feed: DuaaPost[]) {
  try {
    localStorage.setItem(DUAA_STORAGE_KEY, JSON.stringify(feed));
  } catch {}
}

export function useDuaaFeed(initialPageSize: number = DUAA_PAGE_SIZE) {
  const [feed, setFeed] = useState<DuaaPost[]>([]);
  const [visibleCount, setVisibleCount] = useState(initialPageSize);

  useEffect(() => {
    setFeed(loadFeed());
  }, []);

  const sortedFeed = useMemo(() => {
    return [...feed].sort((a, b) => b.createdAt - a.createdAt);
  }, [feed]);

  const showMore = () => setVisibleCount((v) => v + initialPageSize);

  const addPost = (text: string, author: string = "Anonymous") => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const post: DuaaPost = {
      id: `${Date.now()}`,
      text: trimmed,
      author,
      likes: 0,
      reposts: 0,
      createdAt: Date.now(),
      comments: [],
    };
    setFeed((prev) => {
      const next = [post, ...prev];
      saveFeed(next);
      return next;
    });
  };

  const like = (id: string) => {
    setFeed((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p));
      saveFeed(next);
      return next;
    });
  };

  const repost = (id: string) => {
    setFeed((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, reposts: p.reposts + 1 } : p));
      saveFeed(next);
      return next;
    });
  };

  const addComment = (id: string, text: string, author: string = "Anonymous") => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setFeed((prev) => {
      const next = prev.map((p) =>
        p.id === id
          ? { ...p, comments: [ ...(p.comments || []), { id: `${Date.now()}`, author, text: trimmed, createdAt: Date.now() } ] }
          : p
      );
      saveFeed(next);
      return next;
    });
  };

  return { feed, sortedFeed, visibleCount, showMore, addPost, like, repost, addComment };
}

