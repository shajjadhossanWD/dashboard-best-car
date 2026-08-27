import { useEffect, useState } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { Dropdown } from './Dropdown'
import { Button } from './Button'
import { cn } from '@/lib/cn'
import { DATE_PRESETS } from '@/lib/date'
import { formatDateRange } from '@/lib/format'

export function DateRangePicker({ value, presetId, onChange, className }) {
  return (
    <Dropdown
      className={className}
      panelClassName="w-[19rem] max-w-[calc(100vw-2rem)] p-0"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'inline-flex h-9 w-full items-center gap-2 rounded-lg border border-line-strong bg-surface px-3 text-xs font-semibold text-ink transition-colors hover:border-brand-400 sm:w-auto',
            open && 'border-brand-500',
          )}
        >
          <CalendarDays size={14} className="shrink-0 text-ink-soft" />
          <span className="truncate">{formatDateRange(value.from, value.to)}</span>
          <ChevronDown
            size={13}
            className={cn('ml-auto shrink-0 text-ink-soft transition-transform', open && 'rotate-180')}
          />
        </button>
      )}
    >
      {({ close }) => <RangePanel value={value} presetId={presetId} onChange={onChange} onDone={close} />}
    </Dropdown>
  )
}

function RangePanel({ value, presetId, onChange, onDone }) {
  const [draft, setDraft] = useState(value)

  useEffect(() => setDraft(value), [value])

  const invalid = draft.from > draft.to

  const applyPreset = (preset) => {
    onChange({ ...preset.resolve(), presetId: preset.id })
    onDone()
  }

  const applyCustom = () => {
    if (invalid) return
    onChange({ ...draft, presetId: null })
    onDone()
  }

  return (
    <div>
      <div className="border-b border-line p-1.5">
        {DATE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            className={cn(
              'flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors',
              preset.id === presetId
                ? 'bg-brand-50 text-brand-700'
                : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 p-3">
        <p className="text-2xs font-semibold uppercase tracking-wide text-ink-soft">Custom range</p>
        <div className="grid grid-cols-2 gap-2">
          <Field
            label="From"
            value={draft.from}
            max={draft.to}
            onChange={(from) => setDraft((d) => ({ ...d, from }))}
          />
          <Field
            label="To"
            value={draft.to}
            min={draft.from}
            onChange={(to) => setDraft((d) => ({ ...d, to }))}
          />
        </div>

        {invalid ? <p className="text-2xs font-medium text-danger">The start date must come first.</p> : null}

        <div className="flex justify-end gap-2 pt-0.5">
          <Button variant="ghost" size="sm" onClick={onDone}>
            Cancel
          </Button>
          <Button size="sm" onClick={applyCustom} disabled={invalid}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, min, max }) {
  return (
    <label className="block">
      <span className="mb-1 block text-2xs font-medium text-ink-muted">{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-full rounded-md border border-line-strong bg-surface px-2 text-xs text-ink focus:border-brand-500"
      />
    </label>
  )
}
