"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Wbs } from '@/types/Wbs'

export default function WbsTable({ projectId }: { projectId: string }) {
  const [wbsData, setWbsData] = useState<Wbs[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL
              ? process.env.NEXT_PUBLIC_API_URL + `/api/wbs?projectId=${projectId}`
              : "/api/wbs"
          );
          console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data: Wbs[] = await response.json()
        setWbsData(data)
      } catch (err) {
        setError('Error fetching data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  const phases = Array.from(new Set(wbsData.map(item => item.phase)))
  const teamMembers = Array.from(new Set(wbsData.map(item => item.tanto)))

  const calculateSums = (phase: string, member: string) => {
    const filteredData = wbsData.filter(item => item.phase === phase && item.tanto === member)
    const yoteiSum = filteredData.reduce((sum, item) => sum + item.yoteiKosu, 0)
    const jissekiSum = filteredData.reduce((sum, item) => sum + item.jissekiKosu, 0)
    const isOvertime = jissekiSum > yoteiSum

    return (
      <span>
        {yoteiSum.toFixed(1)} [
        <span className={isOvertime ? "text-red-500" : ""}>
          {jissekiSum.toFixed(1)}
        </span>
        ]
      </span>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{projectId}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>担当者 \ Phase</TableHead>
            {phases.map(phase => (
              <TableHead key={phase}>{phase}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamMembers.map(member => (
            <TableRow key={member}>
              <TableCell className="font-medium">{member}</TableCell>
              {phases.map(phase => (
                <TableCell key={`${member}-${phase}`}>{calculateSums(phase, member)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}