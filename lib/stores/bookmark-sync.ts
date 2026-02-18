"use client";

import { Bookmark } from "./bookmark-store";

type SyncEventType = "INSERT" | "UPDATE" | "DELETE" | "REFRESH";

interface SyncMessage {
  type: SyncEventType;
  bookmark?: Bookmark;
  bookmarkId?: string;
  timestamp: number;
}

class BookmarkSyncChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(message: SyncMessage) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("bookmark-sync-channel");
      this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        this.listeners.forEach((listener) => listener(event.data));
      };
    }
  }

  broadcast(message: SyncMessage) {
    if (this.channel) {
      this.channel.postMessage(message);
    }
  }

  subscribe(listener: (message: SyncMessage) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Broadcast that a bookmark was added
  notifyAdd(bookmark: Bookmark) {
    this.broadcast({
      type: "INSERT",
      bookmark,
      timestamp: Date.now(),
    });
  }

  // Broadcast that a bookmark was updated
  notifyUpdate(bookmark: Bookmark) {
    this.broadcast({
      type: "UPDATE",
      bookmark,
      timestamp: Date.now(),
    });
  }

  // Broadcast that a bookmark was deleted
  notifyDelete(bookmarkId: string) {
    this.broadcast({
      type: "DELETE",
      bookmarkId,
      timestamp: Date.now(),
    });
  }

  // Request all tabs to refresh their data
  notifyRefresh() {
    this.broadcast({
      type: "REFRESH",
      timestamp: Date.now(),
    });
  }

  close() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const bookmarkSyncChannel = new BookmarkSyncChannel();
