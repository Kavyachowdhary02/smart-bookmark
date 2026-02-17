'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [bookmarks, setBookmarks] = useState<any[]>([])

  // Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) {
      setBookmarks(data || [])
    }
  }

  // Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    setTitle('')
    setUrl('')
  }

  // Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  useEffect(() => {
  let channel: any

  const init = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
    setLoading(false)

    if (data.user) {
      fetchBookmarks(data.user.id)

      channel = supabase
        .channel('bookmarks-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${data.user.id}`,
          },
          () => {
            fetchBookmarks(data.user.id)
          }
        )
        .subscribe()
    }
  }

  init()

  return () => {
    if (channel) supabase.removeChannel(channel)
  }
}, [])


  if (loading) return <div className="p-10">Loading...</div>
  if (!user) return <div className="p-10">Not logged in</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10">
      <div className="w-full max-w-xl">

        <h1 className="text-2xl font-bold mb-6">
          Logged in as {user.email}
        </h1>

        {/* Add Bookmark Section */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Add Bookmark</h2>

          <input
            className="w-full mb-2 p-2 rounded bg-gray-700"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full mb-2 p-2 rounded bg-gray-700"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={addBookmark}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Bookmark List */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Your Bookmarks</h2>

          {bookmarks.length === 0 && (
            <p className="text-gray-400">No bookmarks yet.</p>
          )}

          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="flex justify-between items-center bg-gray-800 p-3 mb-2 rounded"
            >
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {b.title}
              </a>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
