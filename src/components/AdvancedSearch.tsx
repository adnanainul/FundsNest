import React, { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { MultiSelect } from './MultiSelect'

interface AdvancedSearchProps {
    onSearch: (criteria: SearchCriteria) => void
    type: 'ideas' | 'startups' | 'investors'
}

export interface SearchCriteria {
    keywords: string
    categories?: string[]
    stages?: string[]
    industries?: string[]
    minFunding?: number
    maxFunding?: number
    location?: string
}

export function AdvancedSearch({ onSearch, type }: AdvancedSearchProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [criteria, setCriteria] = useState<SearchCriteria>({
        keywords: '',
    })

    const categoryOptions = ['Technology', 'Healthcare', 'Education', 'Environmental', 'FinTech', 'Social Impact']
    const stageOptions = ['Concept', 'Research', 'Prototype', 'MVP', 'Testing']
    const industryOptions = ['FinTech', 'HealthTech', 'CleanTech', 'EdTech', 'Enterprise']

    const handleSearch = () => {
        onSearch(criteria)
        setIsOpen(false)
    }

    const clearFilters = () => {
        setCriteria({ keywords: '' })
        onSearch({ keywords: '' })
    }

    return (
        <div className="relative">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={criteria.keywords}
                        onChange={(e) => setCriteria({ ...criteria, keywords: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    <SlidersHorizontal className="h-5 w-5" />
                    Advanced
                </button>
            </div>

            {isOpen && (
                <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Advanced Search</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {type === 'ideas' && (
                        <>
                            <MultiSelect
                                label="Categories"
                                options={categoryOptions}
                                selected={criteria.categories || []}
                                onChange={(categories) => setCriteria({ ...criteria, categories })}
                            />
                            <MultiSelect
                                label="Stages"
                                options={stageOptions}
                                selected={criteria.stages || []}
                                onChange={(stages) => setCriteria({ ...criteria, stages })}
                            />
                        </>
                    )}

                    {type === 'startups' && (
                        <>
                            <MultiSelect
                                label="Industries"
                                options={industryOptions}
                                selected={criteria.industries || []}
                                onChange={(industries) => setCriteria({ ...criteria, industries })}
                            />
                            <MultiSelect
                                label="Stages"
                                options={stageOptions}
                                selected={criteria.stages || []}
                                onChange={(stages) => setCriteria({ ...criteria, stages })}
                            />
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Min Funding</label>
                            <input
                                type="number"
                                value={criteria.minFunding || ''}
                                onChange={(e) => setCriteria({ ...criteria, minFunding: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="$0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Funding</label>
                            <input
                                type="number"
                                value={criteria.maxFunding || ''}
                                onChange={(e) => setCriteria({ ...criteria, maxFunding: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="$1,000,000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            value={criteria.location || ''}
                            onChange={(e) => setCriteria({ ...criteria, location: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. San Francisco, CA"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSearch}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
