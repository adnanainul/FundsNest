import React, { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import axios from 'axios'

interface BookmarkButtonProps {
    itemId: string
    itemType: 'idea' | 'startup' | 'investor'
    userId?: string
    onToggle?: (bookmarked: boolean) => void
}

const API_URL = 'http://localhost:5001/api/bookmarks';

export function BookmarkButton({ itemId, itemType, userId = 'demo-user', onToggle }: BookmarkButtonProps) {
    const [bookmarked, setBookmarked] = useState(false)
    const [bookmarkId, setBookmarkId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Check if item is bookmarked
    useEffect(() => {
        const checkBookmark = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/check`, {
                    params: { user_id: userId, item_id: itemId }
                })
                setBookmarked(data.bookmarked)
                if (data.bookmark) {
                    setBookmarkId(data.bookmark._id || data.bookmark.id)
                }
            } catch (err) {
                console.error('Failed to check bookmark', err)
            }
        }
        checkBookmark()
    }, [itemId, userId])

    // Toggle bookmark
    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent parent click events
        setLoading(true)

        try {
            if (bookmarked && bookmarkId) {
                // Remove bookmark
                await axios.delete(`${API_URL}/${bookmarkId}`)
                setBookmarked(false)
                setBookmarkId(null)
                onToggle?.(false)
            } else {
                // Add bookmark
                const { data } = await axios.post(API_URL, {
                    user_id: userId,
                    item_type: itemType,
                    item_id: itemId
                })
                setBookmarked(true)
                setBookmarkId(data.bookmark._id || data.bookmark.id)
                onToggle?.(true)
            }
        } catch (err) {
            console.error('Failed to toggle bookmark', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-lg transition-all duration-200 ${bookmarked
                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            <Bookmark
                className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`}
            />
        </button>
    )
}
