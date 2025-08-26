"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppBar, SideMenu } from "@/components/ui";
import { useRouter } from "next/navigation";

type DuaaPost = {
  id: string;
  text: string;
  author?: string;
  likes: number;
  reposts: number;
  createdAt: number;
  comments?: Array<{ id: string; author: string; text: string; createdAt: number }>;
};

const STORAGE_KEY = "neena.duaa.feed.v1";

function loadFeed(): DuaaPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DuaaPost[]) : [];
  } catch {
    return [];
  }
}

function saveFeed(feed: DuaaPost[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feed));
  } catch {}
}

function DuaaContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [feed, setFeed] = useState<DuaaPost[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState("");
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setFeed(loadFeed());
  }, []);

  useEffect(() => {
    const text = params.get("text");
    const name = params.get("name");
    if (text && text.trim().length > 0) {
      const post: DuaaPost = {
        id: `${Date.now()}`,
        text,
        author: name || "Anonymous",
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
    }
  }, [params]);

  const sortedFeed = useMemo(() => {
    return [...feed].sort((a, b) => b.createdAt - a.createdAt);
  }, [feed]);

  const handleLike = (id: string) => {
    setFeed((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p));
      saveFeed(next);
      return next;
    });
  };

  const handleRepost = (id: string) => {
    setFeed((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, reposts: p.reposts + 1 } : p));
      saveFeed(next);
      return next;
    });
  };

  const handleAddComment = (id: string, text: string, author: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setFeed((prev) => {
      const next = prev.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...(p.comments || []),
                { id: `${Date.now()}`, author: author || "Anonymous", text: trimmed, createdAt: Date.now() },
              ],
            }
          : p
      );
      saveFeed(next);
      return next;
    });
  };

  return (
    <>
      <AppBar title="Neena" onMenu={() => setIsMenuOpen(true)} onTitleClick={() => router.push("/")} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="app-container">
        <div className="app-card">
          <div className="space-y-2">
            <div className="app-title">Du’a</div>
            <div className="text-[13px] text-[var(--text-muted)]">
              A kind, anonymous space for prayers. Please keep a gentle, non‑judgmental tone and avoid personal details or promotions. Du’as are not conditioned by donations or any other action.
            </div>
          </div>
          {/* Write a du’a section */}
          <div className="app-card mt-3">
            <div className="space-y-2">
              <div className="text-[15px] text-[var(--text)] font-[700]">Write a du’a</div>
              <div className="text-[13px] text-[var(--text-muted)]">Every du’a is anonymous.</div>
              {!isComposerOpen ? (
                <button onClick={() => setIsComposerOpen(true)} className="btn-primary text-[14px] w-full md:w-auto px-4">
                  Write a du’a
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    rows={4}
                    placeholder="Write your du’a (anonymous)"
                    className="app-input w-full"
                    style={{ height: 120 }}
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsComposerOpen(false)} className="btn-secondary px-4 text-[14px]">Cancel</button>
                    <button
                      onClick={() => {
                        const text = composerText.trim();
                        if (!text) return;
                        const post: DuaaPost = {
                          id: `${Date.now()}`,
                          text,
                          author: undefined,
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
                        setComposerText("");
                        setIsComposerOpen(false);
                      }}
                      disabled={!composerText.trim()}
                      className="btn-primary px-4 text-[14px]"
                    >
                      Post du’a
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 space-y-3">
            <div className="text-[14px] font-[700]">Latest du’as</div>
            {sortedFeed.length === 0 && (
              <div className="text-[14px] text-[var(--text-muted)]">No du’a yet. Share one from the thank-you screen after donating.</div>
            )}
            {sortedFeed.slice(0, visibleCount).map((post) => {
              return (
                <div key={post.id} className="app-card">
                  <div className="flex-1">
                    <div className="text-[12px] text-[var(--text-muted)]">{new Date(post.createdAt).toLocaleDateString()}</div>
                    <div className="text-[15px] mt-1">{post.text}</div>
                    <div className="flex items-center gap-4 mt-2 text-[13px] text-[var(--text-muted)]">
                      <button onClick={() => handleLike(post.id)} className="hover:underline">Amine ({post.likes})</button>
                      <button onClick={() => handleRepost(post.id)} className="hover:underline">Repost ({post.reposts})</button>
                      <button onClick={() => setOpenCommentId((id) => id === post.id ? null : post.id)} className="hover:underline ml-auto">Comment ({(post.comments || []).length})</button>
                    </div>
                    {openCommentId === post.id && (
                      <div className="mt-2 space-y-2">
                        <div className="text-[12px] text-[var(--text-muted)]">
                          Comments are for du’a only. Please keep a kind, non‑judgmental spirit and avoid personal details or conversations.
                        </div>
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={3}
                          placeholder="Write your comment"
                          className="app-input w-full"
                          style={{ height: 96 }}
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => { setOpenCommentId(null); setCommentText(""); }}
                            className="btn-secondary px-3 text-[13px]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              const text = commentText.trim();
                              if (!text) return;
                              handleAddComment(post.id, text, "Anonymous");
                              setCommentText("");
                              setOpenCommentId(null);
                            }}
                            disabled={!commentText.trim()}
                            className="btn-primary px-3 text-[13px]"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                    {(post.comments || []).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {(post.comments || []).map((c) => (
                          <div key={c.id} className="compact-summary-row">
                            <span className="text-[13px] font-[700]">{c.author}</span>
                            <span className="text-[13px] text-[var(--text-muted)]">{c.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {visibleCount < sortedFeed.length && (
              <div className="flex justify-center">
                <button onClick={() => setVisibleCount((v) => v + 10)} className="btn-secondary text-[14px] px-4">
                  View more
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Simple footer */}
        <div className="mt-4 text-[13px] text-[var(--text-muted)] text-center">© {new Date().getFullYear()} Neena — Du’a community</div>
      </div>
    </>
  );
}

export default function DuaaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DuaaContent />
    </Suspense>
  );
}

