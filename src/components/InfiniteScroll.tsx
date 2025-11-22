import React, { useState, useEffect, useRef, useCallback } from 'react'

interface InfiniteScrollProps {
    loadMore: () => Promise<void>
    hasMore: boolean
    loading: boolean
    children: React.ReactNode
    threshold?: number
}

export function InfiniteScroll({
    loadMore,
    hasMore,
    loading,
    children,
    threshold = 100
}: InfiniteScrollProps) {
    const observerTarget = useRef<HTMLDivElement>(null)

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
            loadMore()
        }
    }, [hasMore, loading, loadMore])

    useEffect(() => {
        const element = observerTarget.current
        if (!element) return

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0,
            rootMargin: `${threshold}px`,
        })

        observer.observe(element)

        return () => {
            if (element) {
                observer.unobserve(element)
            }
        }
    }, [handleObserver, threshold])

    return (
        <>
            {children}
            <div ref={observerTarget} className="h-10 flex items-center justify-center">
                {loading && hasMore && (
                    <div className="text-gray-500 text-sm">Loading more...</div>
                )}
            </div>
        </>
    )
}
