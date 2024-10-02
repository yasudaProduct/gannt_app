"use client"

import { useEffect, useState } from 'react'
import { Wbs } from '@/types/Wbs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { TimeUnitSelector } from './TimeUnitSelector'

type PhaseSummary = {
  phase: string
  yoteiKosu: number
  jissekiKosu: number
}

type TimeUnit = 'hours' | 'personDays' | 'personMonths'

const HOURS_PER_DAY = 7.5
const DAYS_PER_MONTH = 20

export default function WbsSummary({ projectId }: { projectId: string }) {
  const [phaseSummaries, setPhaseSummaries] = useState<PhaseSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('hours')

  useEffect(() => {
    const fetchWbsData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL
              ? process.env.NEXT_PUBLIC_API_URL + `/api/wbs?projectId=${projectId}`
              : "/api/wbs"
          );
        if (!response.ok) {
          throw new Error('Failed to fetch WBS data')
        }
        const wbsData: Wbs[] = await response.json()
        const summaries = aggregateByPhase(wbsData)
        setPhaseSummaries(summaries)
      } catch (err) {
        setError('Error fetching WBS data. Please try again later.')
        console.error('Error fetching WBS data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWbsData()
  }, [projectId])

  const aggregateByPhase = (wbsData: Wbs[]): PhaseSummary[] => {
    const phaseMap = new Map<string, PhaseSummary>()

    wbsData.forEach((wbs) => {
      if (!phaseMap.has(wbs.phase)) {
        phaseMap.set(wbs.phase, { phase: wbs.phase, yoteiKosu: 0, jissekiKosu: 0 })
      }
      const phaseSummary = phaseMap.get(wbs.phase)!
      phaseSummary.yoteiKosu += wbs.yoteiKosu
      phaseSummary.jissekiKosu += wbs.jissekiKosu
    })

    return Array.from(phaseMap.values())
  }

  const convertTime = (hours: number, unit: TimeUnit): number => {
    switch (unit) {
      case 'hours':
        return hours
      case 'personDays':
        return hours / HOURS_PER_DAY
      case 'personMonths':
        return hours / HOURS_PER_DAY / DAYS_PER_MONTH
    }
  }

  const formatTime = (value: number): string => {
    return value.toFixed(2)
  }

  const getUnitLabel = (unit: TimeUnit): string => {
    switch (unit) {
      case 'hours':
        return '時間'
      case 'personDays':
        return '人日'
      case 'personMonths':
        return '人月'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    )
  }

  const totalYoteiKosu = phaseSummaries.reduce((sum, phase) => sum + phase.yoteiKosu, 0)
  const totalJissekiKosu = phaseSummaries.reduce((sum, phase) => sum + phase.jissekiKosu, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{projectId}</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeUnitSelector selectedUnit={timeUnit} onUnitChange={setTimeUnit} />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>工程</TableHead>
                  <TableHead className="text-right">予定 ({getUnitLabel(timeUnit)})</TableHead>
                  <TableHead className="text-right">実績 ({getUnitLabel(timeUnit)})</TableHead>
                  <TableHead className="text-right">予定-実績 ({getUnitLabel(timeUnit)})</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phaseSummaries.map((summary) => (
                  <TableRow key={summary.phase}>
                    <TableCell>{summary.phase}</TableCell>
                    <TableCell className="text-right">{formatTime(convertTime(summary.yoteiKosu, timeUnit))}</TableCell>
                    <TableCell className="text-right">{formatTime(convertTime(summary.jissekiKosu, timeUnit))}</TableCell>
                    <TableCell className="text-right">
                      {formatTime(convertTime(summary.jissekiKosu - summary.yoteiKosu, timeUnit))}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{formatTime(convertTime(totalYoteiKosu, timeUnit))}</TableCell>
                  <TableCell className="text-right">{formatTime(convertTime(totalJissekiKosu, timeUnit))}</TableCell>
                  <TableCell className="text-right">
                    {formatTime(convertTime(totalJissekiKosu - totalYoteiKosu, timeUnit))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}