'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // 🔐 Check session
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoadingAuth(false)

      if (data.session) {
        fetchBookmarks(data.session.user.id)
      }
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session?.user) {
          fetchBookmarks(session.user.id)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🔄 Realtime subscription (USER SCOPED)
  useEffect(() => {
    if (!session?.user) return

    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          fetchBookmarks(session.user.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  // 📥 Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: false })

    if (error) {
      setErrorMsg('Failed to load bookmarks.')
      return
    }

    setBookmarks(data || [])
  }

  const validateUrl = (value: string) => {
    return value.startsWith('http://') || value.startsWith('https://')
  }

  const addBookmark = async () => {
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!title.trim() || !url.trim()) {
      return setErrorMsg('Both fields are required.')
    }

    if (!validateUrl(url.trim())) {
      return setErrorMsg('URL must start with http:// or https://')
    }

    setLoading(true)

    const { error } = await supabase.from('bookmarks').insert([
      {
        title: title.trim(),
        url: url.trim(),
        user_id: session.user.id,
      },
    ])

    setLoading(false)

    if (error) {
      setErrorMsg('Failed to add bookmark.')
      return
    }

    setTitle('')
    setUrl('')
    setSuccessMsg('Bookmark added.')
  }

  const updateBookmark = async (id: number) => {
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!title.trim() || !url.trim()) {
      return setErrorMsg('Both fields are required.')
    }

    if (!validateUrl(url.trim())) {
      return setErrorMsg('URL must start with http:// or https://')
    }

    setLoading(true)

    const { error } = await supabase
      .from('bookmarks')
      .update({
        title: title.trim(),
        url: url.trim(),
      })
      .eq('id', id)

    setLoading(false)

    if (error) {
      setErrorMsg('Failed to update bookmark.')
      return
    }

    setEditingId(null)
    setTitle('')
    setUrl('')
    setSuccessMsg('Bookmark updated.')
  }

  const deleteBookmark = async (id: number) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      setErrorMsg('Failed to delete bookmark.')
      return
    }

    setSuccessMsg('Bookmark deleted.')
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    )
  }

  // 🔐 Landing Page
  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-semibold text-gray-800 text-center">
            Bookmark Manager
          </h1>

          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin },
              })
            }
            className="w-full rounded-lg bg-black py-3 text-white font-medium hover:opacity-90 transition"
          >
            Continue with Google
          </button>
        </div>
      </div>
    )
  }

  // 📊 Dashboard
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Your Bookmarks
          </h1>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Logout
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {successMsg}
          </div>
        )}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-700">
            {editingId ? 'Edit Bookmark' : 'Add Bookmark'}
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={() =>
                editingId ? updateBookmark(editingId) : addBookmark()
              }
              disabled={loading}
              className="w-full rounded-lg bg-black py-2 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : editingId
                ? 'Update Bookmark'
                : 'Add Bookmark'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <a
                href={b.url}
                target="_blank"
                className="text-gray-800 font-medium hover:underline"
              >
                {b.title}
              </a>

              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => {
                    setEditingId(b.id)
                    setTitle(b.title)
                    setUrl(b.url)
                  }}
                  className="text-gray-500 hover:text-black transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {bookmarks.length === 0 && (
            <p className="text-center text-gray-400 mt-6">
              No bookmarks yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
