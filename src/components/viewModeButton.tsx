import React from 'react'
import { ViewMode } from 'gantt-task-react'

interface ViewModeButtonsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ViewModeButtons: React.FC<ViewModeButtonsProps> = ({ viewMode, setViewMode }) => {
  const buttons = [
    { mode: ViewMode.Hour, label: '時間' },
    { mode: ViewMode.QuarterDay, label: '6時間' },
    { mode: ViewMode.HalfDay, label: '12時間' },
    { mode: ViewMode.Day, label: '日' },
    { mode: ViewMode.Week, label: '週' },
    { mode: ViewMode.Month, label: '月' },
    { mode: ViewMode.Year, label: '年' },
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {buttons.map(({ mode, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            viewMode === mode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-pressed={viewMode === mode}
        >
          {label}
        </button>
      ))}
    </div>
  )
}