import React from 'react'

export type DateType = 'kijun' | 'yotei' | 'jisseki'

interface DateTypeSelectorProps {
  dateType: DateType;
  setDateType: (type: DateType) => void;
}

export const DateTypeSelector: React.FC<DateTypeSelectorProps> = ({ dateType, setDateType }) => {
  const options: { value: DateType; label: string }[] = [
    { value: 'kijun', label: '基準日程' },
    { value: 'yotei', label: '予定日程' },
    { value: 'jisseki', label: '実績日程' },
  ]

  return (
    <div className="mb-4">
      <label htmlFor="date-type-select" className="block text-sm font-medium text-gray-700 mb-1">
        表示する日程:
      </label>
      <select
        id="date-type-select"
        value={dateType}
        onChange={(e) => setDateType(e.target.value as DateType)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}