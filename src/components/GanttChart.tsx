'use client'

import React, { useState, useEffect } from 'react'
import { Gantt, Task, ViewMode, StylingOption, DisplayOption } from 'gantt-task-react'
import { TaskListColumn } from 'gantt-task-react/dist/components/task-list/task-list-table'
import "gantt-task-react/dist/index.css"
import { format } from 'date-fns'

interface ProjectTask {
  id: number
  projectId: string
  projectName: string
  wbsId: string
  phase: string
  activity: string
  task: string
  kinoSbt: string
  subsystem: string
  tanto: string
  tantoRev: string
  kijunStartDate: string
  kijunEndDate: string
  kijunKosu: number
  kijunKosuBuffer: number
  yoteiStartDate: string
  yoteiEndDate: string
  yoteiKosu: number
  jissekiStartDate: string | null
  jissekiEndDate: string | null
  jissekiKosu: number
  status: string
  progress_Rate: number
}

const convertToGanttTask = (projectTask: ProjectTask): Task => {
  return {
    id: projectTask.id.toString(),
    name: projectTask.task,
    start: new Date(projectTask.yoteiStartDate),
    end: new Date(projectTask.yoteiEndDate),
    progress: projectTask.progress_Rate,
    type: 'task',
    project: projectTask.projectName,
    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  }
}

export default function GanttChart() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks')
        const data: ProjectTask[] = await response.json()
        const ganttTasks = data.map(convertToGanttTask)
        setTasks(ganttTasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchTasks()
  }, [])

  const handleExpanderClick = (task: Task) => {
    console.log('Expander clicked for task:', task)
  }

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task)
  }

  const handleProgressChange = (task: Task) => {
    console.log('Task progress changed:', task)
  }

  const handleTaskChange = (task: Task) => {
    console.log('Task changed:', task)
  }

  const handleDblClick = (task: Task) => {
    console.log('Task double clicked:', task)
  }

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log('Task selected:', task, isSelected)
  }

  const calculateDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays * 8 // Assuming 8 working hours per day
  }

  const ganttStyles: StylingOption = {
    headerHeight: 50,
    rowHeight: 50,
    barCornerRadius: 5,
    barFill: 45,
    barProgressColor: '#ff9e0d',
    barProgressSelectedColor: '#ff9e0d',
    barBackgroundColor: '#e0e0e0',
    barBackgroundSelectedColor: '#e0e0e0',
    arrowColor: '#ccc',
    arrowIndent: 20,
    todayColor: 'rgba(252, 248, 227, 0.5)',
    TooltipContent: ({ task }: { task: Task }) => (
      <div className="custom-tooltip">
        <h4>{task.name}</h4>
        <p>予定: {format(task.start, 'yyyy/MM/dd')} - {format(task.end, 'yyyy/MM/dd')}</p>
        <p>工数: {calculateDuration(task.start, task.end)}h</p>
      </div>
    ),
  }

  const displayOptions: DisplayOption = {
    viewMode: ViewMode.Week,
    viewDate: new Date(),
    preStepsCount: 1,
  }

  const columns: TaskListColumn[] = [
    {
      id: 'name',
      label: 'タスク名',
      width: 200,
      renderer: (props) => <div>{props.task.name}</div>,
    },
    {
      id: 'period',
      label: '予定期間',
      width: 200,
      renderer: (props) => (
        <div>
          {format(props.task.start, 'yyyy/MM/dd')} - {format(props.task.end, 'yyyy/MM/dd')}
        </div>
      ),
    },
    {
      id: 'duration',
      label: '予定工数',
      width: 100,
      renderer: (props) => <div>{calculateDuration(props.task.start, props.task.end)}h</div>,
    },
  ]

  return (
    <div className="gantt-container">
      <Gantt
        tasks={tasks}
        onExpanderClick={handleExpanderClick}
        onClick={handleTaskClick}
        onDateChange={handleTaskChange}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onSelect={handleSelect}
        listCellWidth=""
        ganttHeight={400}
        columnWidth={60}
        columns={columns}
        styles={ganttStyles}
        {...displayOptions}
      />
    </div>
  )
}