'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/lib/types'
import { toast } from 'sonner'

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(!!userId)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) {
      return
    }

    // Fetch initial bookmarks
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookmarks:', error)
        toast.error('Failed to load bookmarks')
      } else {
        setBookmarks(data || [])
      }
      setLoading(false)
    }

    fetchBookmarks()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((current) => [payload.new as Bookmark, ...current])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((current) =>
              current.map((bookmark) =>
                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  const addBookmark = async (title: string, url: string) => {
    if (!userId) return

    // Optimistic update
    const tempId = `temp-${Date.now()}`
    const newBookmark: Bookmark = {
      id: tempId,
      user_id: userId,
      title,
      url,
      created_at: new Date().toISOString(),
    }
    setBookmarks((current) => [newBookmark, ...current])

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, title, url }])
      .select()
      .single()

    if (error) {
      console.error('Error adding bookmark:', error)
      toast.error('Failed to add bookmark')
      // Revert optimistic update
      setBookmarks((current) => current.filter((b) => b.id !== tempId))
    } else {
      // Replace temp bookmark with real one
      setBookmarks((current) =>
        current.map((b) => (b.id === tempId ? data : b))
      )
      toast.success('Bookmark added successfully')
    }
  }

  const deleteBookmark = async (id: string) => {
    // Optimistic update
    const bookmarkToDelete = bookmarks.find((b) => b.id === id)
    setBookmarks((current) => current.filter((b) => b.id !== id))

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting bookmark:', error)
      toast.error('Failed to delete bookmark')
      // Revert optimistic update
      if (bookmarkToDelete) {
        setBookmarks((current) => [...current, bookmarkToDelete])
      }
    } else {
      toast.success('Bookmark deleted successfully')
    }
  }

  return { bookmarks, loading, addBookmark, deleteBookmark }
}
