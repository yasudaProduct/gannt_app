"use client";

import { Gantt, Task, ViewMode } from "gantt-task-react";
import React, { useEffect, useState } from "react";
import "gantt-task-react/dist/index.css";
import { Wbs } from "@/types/Wbs";

interface CustomTask extends Task { 
  wbsId: string;
}

const fetchTasks = async (): Promise<Wbs[]> => {

  const response = await fetch('/api/wbs')
  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }
  return response.json()
}

const transformTasks = (wbsTasks: Wbs[]): CustomTask[] => {
  return wbsTasks.map(apiTask => ({
    id: apiTask.id.toString(),
    name: apiTask.task,
    start: new Date(apiTask.yoteiStartDate),
    end: new Date(apiTask.yoteiEndDate),
    progress: apiTask.progress_Rate,
    type: 'task',
    isDisabled: false,
    styles: { progressColor: '#0080ff', progressSelectedColor: '#0080ff' },
    wbsId: apiTask.wbsId,
  }))
}

export default function GanttChart() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const apiTasks = await fetchTasks();
        const transformedTasks = transformTasks(apiTasks);
        setTasks(transformedTasks);
        setError(null);
      } catch (error) {
        console.log(error);
        setError("タスクの読み込み中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);
  
  // const tasks: Task[] = [
  //   {
  //     start: new Date(2023, 0, 1),
  //     end: new Date(2023, 0, 15),
  //     name: "企画立案",
  //     id: "Task 1",
  //     type: "task",
  //     progress: 45,
  //     isDisabled: false,
  //   },
  //   {
  //     start: new Date(2023, 0, 10),
  //     end: new Date(2023, 1, 5),
  //     name: "デザイン作成",
  //     id: "Task 2",
  //     type: "task",
  //     progress: 30,
  //     isDisabled: false,
  //   },
  //   {
  //     start: new Date(2023, 1, 1),
  //     end: new Date(2023, 1, 20),
  //     name: "開発",
  //     id: "Task 3",
  //     type: "task",
  //     progress: 0,
  //     isDisabled: false,
  //   },
  // ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }> = ({headerHeight}) => {
    return (
      <div
        className="flex justify-center items-center gap-4 px-4 bg-gray-100 font-semibold text-sm text-gray-700"
        style={{ height: headerHeight }}
      >
        <div style={{ width: "200px" }}>タスク名</div>
        <div style={{ width: "60px" }}>WBSNO</div>
        <div style={{ width: "60px" }}>開始日</div>
        <div style={{ width: "60px" }}>終了日</div>
        <div className="text-right" style={{ width: "30px" }}>
          進捗
        </div>
      </div>
    );
  };

  const TaskListTable: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: CustomTask[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
  }> = ({ tasks, rowHeight }) => {
    return (
      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 px-4 py-2 border-b border-gray-200 text-sm"
            style={{height: rowHeight }}
          >
            <div
              className="truncate"
              style={{ width: "200px"}}
            >
              {task.name}
            </div>
            <div>
              {task.wbsId}
            </div>
            <div style={{ width: "60px" }}>
              {task.start.toLocaleDateString("ja-JP", )}
            </div>
            <div style={{ width: "60px" }}>
              {task.end.toLocaleDateString("ja-JP", )}
            </div>
            <div
              className="text-right"
              style={{ width: "30px"}}
            >
              {task.progress}%
            </div>
          </div>
        ))}
      </div>
    );
  }

  const ViewModeButtons: React.FC = () => {
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
      <div className="flex space-x-2 mb-4">
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="w-full h-screen p-4 bg-gray-100 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        ガントチャート例
      </h1>
      <ViewModeButtons />
      <div className="w-full h-[calc(100vh-100px)] bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          columnWidth={60}
          // rowHeight={}
          locale="ja-JP"
          TaskListHeader={TaskListHeader}
          TaskListTable={TaskListTable}
          TooltipContent={({ task }) => (
            <div className="p-2 bg-white rounded shadow-md">
              <h3 className="font-bold">{task.name}</h3>
              <p>進捗: {task.progress}%</p>
              <p>開始: {formatDate(task.start)}</p>
              <p>終了: {formatDate(task.end)}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}