import { Button } from "@/components/ui/button"

type TimeUnit = 'hours' | 'personDays' | 'personMonths'

interface TimeUnitSelectorProps {
  selectedUnit: TimeUnit
  onUnitChange: (unit: TimeUnit) => void
}

export function TimeUnitSelector({ selectedUnit, onUnitChange }: TimeUnitSelectorProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={selectedUnit === 'hours' ? 'default' : 'outline'}
        onClick={() => onUnitChange('hours')}
      >
        時間
      </Button>
      <Button
        variant={selectedUnit === 'personDays' ? 'default' : 'outline'}
        onClick={() => onUnitChange('personDays')}
      >
        人日
      </Button>
      <Button
        variant={selectedUnit === 'personMonths' ? 'default' : 'outline'}
        onClick={() => onUnitChange('personMonths')}
      >
        人月
      </Button>
    </div>
  )
}