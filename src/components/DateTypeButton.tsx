import React from 'react'

export type DateType = 'kijun' | 'yotei' | 'jisseki'

interface DateTypeSelectorProps {
  dateType: DateType;
  setDateType: (type: DateType) => void;
}

export const DateTypeSelector: React.FC<DateTypeSelectorProps> = ({ dateType, setDateType }) => {
  const buttons: {mode : DateType, label: string}[] = [
    { mode: 'kijun', label: '基準' },
    { mode: 'yotei', label: '予定' },
    { mode: 'jisseki', label: '実績' },
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {buttons.map(({ mode, label }) => (
        <button
          key={mode}
          onClick={() => setDateType(mode)}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            dateType === mode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-pressed={dateType === mode}
        >
          {label}
        </button>
      ))}
    </div>
  )
}