import React, { useState } from 'react'
import { X } from 'lucide-react'

interface MultiSelectProps {
    options: string[]
    selected: string[]
    onChange: (selected: string[]) => void
    label: string
    placeholder?: string
}

export function MultiSelect({ options, selected, onChange, label, placeholder = 'Select options...' }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option))
        } else {
            onChange([...selected, option])
        }
    }

    const removeOption = (option: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(selected.filter(item => item !== option))
    }

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="min-h-[42px] px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:border-gray-400 transition-colors"
            >
                {selected.length === 0 ? (
                    <span className="text-gray-400">{placeholder}</span>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {selected.map(item => (
                            <span
                                key={item}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                            >
                                {item}
                                <button
                                    onClick={(e) => removeOption(item, e)}
                                    className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <div
                            key={option}
                            onClick={() => toggleOption(option)}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selected.includes(option) ? 'bg-blue-50 text-blue-700' : ''
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => { }}
                                className="mr-2"
                            />
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
