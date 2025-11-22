// Saved Filter Preferences using localStorage

export interface FilterPreferences {
    ideas: {
        category?: string[]
        stage?: string[]
        searchTerm?: string
    }
    startups: {
        industry?: string[]
        stage?: string[]
        searchTerm?: string
    }
    requests: {
        status?: string
        priority?: string
    }
    transactions: {
        type?: string
        dateFilter?: string
    }
}

const STORAGE_KEY = 'fundnest_filter_preferences'

export const saveFilterPreferences = (preferences: Partial<FilterPreferences>) => {
    try {
        const existing = getFilterPreferences()
        const updated = { ...existing, ...preferences }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (err) {
        console.error('Failed to save filter preferences', err)
    }
}

export const getFilterPreferences = (): FilterPreferences => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (err) {
        console.error('Failed to load filter preferences', err)
    }

    return {
        ideas: {},
        startups: {},
        requests: {},
        transactions: {}
    }
}

export const clearFilterPreferences = () => {
    localStorage.removeItem(STORAGE_KEY)
}

// Hook to use filter preferences
export const useFilterPreferences = (page: keyof FilterPreferences) => {
    const preferences = getFilterPreferences()

    const savePreference = (key: string, value: any) => {
        const updated = {
            ...preferences,
            [page]: {
                ...preferences[page],
                [key]: value
            }
        }
        saveFilterPreferences(updated)
    }

    return {
        preferences: preferences[page],
        savePreference
    }
}
