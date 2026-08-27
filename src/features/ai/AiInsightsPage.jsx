import { useCallback, useEffect, useState } from 'react'
import {
  Activity,
  Brain,
  Flame,
  RefreshCw,
  Snowflake,
  Sparkles,
  ThermometerSun,
} from 'lucide-react'

import { fetchAutomation, fetchInsights, fetchLeads, triggerRetrain } from '@/api/aiApi'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ErrorState } from '@/components/ui/StateBlock'

const BAND_TONE = { Hot: 'danger', Warm: 'warning', Cold: 'info' }
const BAND_ICON = { Hot: Flame, Warm: ThermometerSun, Cold: Snowflake }

function percent(value) {
  return `${((value ?? 0) * 100).toFixed(1)}%`
}

function Metric({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-line bg-surface-sunken px-4 py-3">
      <p className="text-2xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
      {hint ? <p className="mt-0.5 text-2xs text-ink-muted">{hint}</p> : null}
    </div>
  )
}

/** Horizontal bar list — enough for a share-of-total read without a chart lib. */
function BarList({ rows, labelKey, valueKey, empty = 'No data yet' }) {
  if (!rows?.length) return <p className="text-xs text-ink-muted">{empty}</p>

  const max = Math.max(...rows.map((row) => row[valueKey] || 0), 1)

  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row[labelKey]}>
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="truncate font-medium text-ink">{row[labelKey]}</span>
            <span className="shrink-0 tabular-nums text-ink-muted">{row[valueKey]}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${((row[valueKey] || 0) / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function AiInsightsPage() {
  const [insights, setInsights] = useState(null)
  const [leads, setLeads] = useState(null)
  const [automation, setAutomation] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [retraining, setRetraining] = useState(false)
  const [bandFilter, setBandFilter] = useState('Hot')

  const load = useCallback(async (band) => {
    setStatus('loading')
    try {
      const [insightsData, leadsData, automationData] = await Promise.all([
        fetchInsights(90),
        fetchLeads({ band, limit: 8 }),
        fetchAutomation(6),
      ])
      setInsights(insightsData)
      setLeads(leadsData)
      setAutomation(automationData)
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load(bandFilter)
  }, [load, bandFilter])

  const onRetrain = async () => {
    setRetraining(true)
    try {
      await triggerRetrain()
      // Training runs in the background; give it a moment before re-reading.
      setTimeout(() => load(bandFilter), 4000)
    } finally {
      setRetraining(false)
    }
  }

  if (status === 'error') {
    return (
      <>
        <PageHeader title="AI Insights" description="Recommendation, assistant and lead-scoring analytics" />
        <ErrorState
          message={`${error?.message ?? 'Unknown error'}. Start the service with "uvicorn app.main:app --port 8000" in the ai_service folder.`}
          onRetry={() => load(bandFilter)}
        />
      </>
    )
  }

  if (status === 'loading' && !insights) {
    return (
      <>
        <PageHeader title="AI Insights" description="Recommendation, assistant and lead-scoring analytics" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-card border border-line bg-surface" />
          ))}
        </div>
      </>
    )
  }

  const funnel = insights?.funnel ?? {}
  const models = insights?.models ?? {}
  const leadStats = insights?.leads ?? {}

  return (
    <>
      <PageHeader
        title="AI Insights"
        description="Recommendation, assistant and lead-scoring analytics"
        actions={
          <Button onClick={onRetrain} disabled={retraining} variant="outline">
            <RefreshCw className={`h-4 w-4 ${retraining ? 'animate-spin' : ''}`} />
            {retraining ? 'Retraining…' : 'Retrain models'}
          </Button>
        }
      />

      {/* Model health -------------------------------------------------- */}
      <Card className="mb-4">
        <CardHeader
          title="Model health"
          subtitle={`Version ${models.leadModelVersion ?? 'n/a'}`}
          actions={
            <Badge tone={models.recommenderReady ? 'success' : 'danger'}>
              {models.recommenderReady ? 'Models loaded' : 'Not trained'}
            </Badge>
          }
        />
        <CardBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Recommender"
            value={models.recommenderReady ? 'Ready' : 'Offline'}
            hint={models.recommenderTrainedAt ? `Trained ${models.recommenderTrainedAt}` : undefined}
          />
          <Metric
            label="Lead model ROC-AUC"
            value={models.leadModelAuc ? models.leadModelAuc.toFixed(3) : '—'}
            hint="Holdout, higher is better"
          />
          <Metric label="Intent classifier" value={models.intentTrained ? 'Trained' : 'Rules only'} />
          <Metric
            label="Scheduler"
            value={automation?.scheduler?.running ? 'Running' : 'Stopped'}
            hint={`${automation?.scheduler?.jobs?.length ?? 0} jobs`}
          />
        </CardBody>
      </Card>

      {/* Funnel -------------------------------------------------------- */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Sessions" value={funnel.sessions ?? 0} hint="Last 90 days" />
        <Metric label="Car views" value={funnel.views ?? 0} />
        <Metric label="Assistant chats" value={funnel.chats ?? 0} />
        <Metric
          label="View to booking"
          value={percent(funnel.viewToBooking)}
          hint={`${funnel.bookings ?? 0} bookings`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Lead queue ------------------------------------------------- */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Qualified leads"
            subtitle={`${leadStats.total ?? 0} leads · ${percent(leadStats.conversionRate)} convert`}
            actions={
              <div className="flex gap-1">
                {['Hot', 'Warm', 'Cold'].map((band) => (
                  <button
                    key={band}
                    type="button"
                    onClick={() => setBandFilter(band)}
                    className={`rounded-md px-2.5 py-1 text-2xs font-semibold transition-colors ${
                      bandFilter === band
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-sunken text-ink-muted hover:text-ink'
                    }`}
                  >
                    {band}
                    {leadStats.bands?.[band]?.count ? ` (${leadStats.bands[band].count})` : ''}
                  </button>
                ))}
              </div>
            }
          />
          <CardBody className="space-y-3">
            {!leads?.items?.length ? (
              <p className="text-xs text-ink-muted">No {bandFilter.toLowerCase()} leads.</p>
            ) : (
              leads.items.map((lead) => {
                const Icon = BAND_ICON[lead.score?.band] ?? Sparkles
                return (
                  <div key={lead.leadId} className="rounded-lg border border-line p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{lead.fullName}</p>
                        <p className="truncate text-2xs text-ink-muted">
                          {lead.email} · {lead.source} · {lead.rentalDays ?? '?'} days
                        </p>
                      </div>
                      <Badge tone={BAND_TONE[lead.score?.band] ?? 'neutral'} dot={false}>
                        <Icon className="h-3 w-3" />
                        {lead.score?.band ?? 'Unscored'} · {lead.score?.points ?? 0}
                      </Badge>
                    </div>

                    {/* Why the model scored it this way — a band with no
                        reasoning is not actionable for whoever calls them. */}
                    {lead.score?.reasons?.length ? (
                      <ul className="mt-2 space-y-1">
                        {lead.score.reasons.slice(0, 3).map((reason) => (
                          <li key={reason} className="flex gap-1.5 text-2xs text-ink-muted">
                            <span aria-hidden className="text-brand-500">
                              •
                            </span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )
              })
            )}
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Demand by category" subtitle="Views, last 90 days" />
            <CardBody>
              <BarList rows={insights?.demandByCategory} labelKey="category" valueKey="views" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Assistant intents" subtitle="What people ask for" />
            <CardBody>
              <BarList
                rows={insights?.assistantIntents}
                labelKey="intent"
                valueKey="count"
                empty="No chats yet"
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="Most viewed cars" subtitle="Ranked by demand" />
          <CardBody>
            {!insights?.topCars?.length ? (
              <p className="text-xs text-ink-muted">No views recorded.</p>
            ) : (
              <ul className="space-y-2">
                {insights.topCars.slice(0, 6).map((car) => (
                  <li
                    key={car.carId}
                    className="flex items-center justify-between gap-3 border-b border-line pb-2 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{car.name}</p>
                      <p className="text-2xs text-ink-muted">
                        {car.category} · £{car.pricePerDay}/day
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums text-ink">{car.views}</p>
                      <p className="text-2xs text-ink-muted">{percent(car.conversion)} booked</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Automation"
            subtitle="Scheduled jobs and recent runs"
            actions={<Activity className="h-4 w-4 text-ink-muted" />}
          />
          <CardBody className="space-y-3">
            {automation?.scheduler?.jobs?.map((job) => (
              <div key={job.id} className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-ink">{job.id}</span>
                <span className="text-2xs tabular-nums text-ink-muted">
                  {job.nextRun ? new Date(job.nextRun).toLocaleString() : 'idle'}
                </span>
              </div>
            ))}

            <div className="border-t border-line pt-3">
              <p className="mb-2 text-2xs font-semibold uppercase tracking-wide text-ink-muted">
                Recent runs
              </p>
              {!automation?.recentRuns?.length ? (
                <p className="text-xs text-ink-muted">Nothing has run yet.</p>
              ) : (
                <ul className="space-y-1.5">
                  {automation.recentRuns.slice(0, 5).map((run, index) => (
                    <li key={`${run.job}-${index}`} className="flex items-center gap-2 text-2xs">
                      <Badge tone={run.status === 'ok' ? 'success' : 'danger'} dot={false}>
                        {run.status}
                      </Badge>
                      <span className="font-medium text-ink">{run.job}</span>
                      <span className="ml-auto text-ink-muted">
                        {run.createdAt ? new Date(run.createdAt).toLocaleTimeString() : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-2xs text-ink-muted">
        <Brain className="h-3 w-3" />
        Served by the Python AI service. Recommendations, intent routing and lead scores are
        computed locally — no third-party AI API is involved.
      </p>
    </>
  )
}
