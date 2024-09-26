"use client";

import { Gantt, Task, ViewMode } from "gantt-task-react";
import React, { useEffect, useState } from "react";
import { Wbs } from "@/types/Wbs";
import { DateType, DateTypeSelector } from "./DateTypeButton";
import { ViewModeButtons } from "./viewModeButton";

interface CustomTask extends Task { 
  wbsId: string;
  tanto: string;
  kosu: number;
}

const fetchTasks = async (): Promise<Wbs[]> => {

  const response = await fetch('/api/wbs')
  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }
  return response.json()
}

const transformTasks = (wbsTasks: Wbs[], dateType: DateType): CustomTask[] => {

  const tasks = wbsTasks.map(wbsTask => {
    let start: Date, end: Date
    let kosu: number
    switch (dateType) {
      case 'kijun':
        start = new Date(wbsTask.kijunStartDate)
        end = new Date(wbsTask.kijunEndDate)
        kosu = wbsTask.kijunKosu
        break
      case 'yotei':
        start = new Date(wbsTask.yoteiStartDate)
        end = new Date(wbsTask.yoteiEndDate)
        kosu = wbsTask.yoteiKosu
        break
      case 'jisseki':
        start = wbsTask.jissekiStartDate ? new Date(wbsTask.jissekiStartDate) : new Date(wbsTask.yoteiStartDate)
        end = wbsTask.jissekiEndDate ? new Date(wbsTask.jissekiEndDate) : new Date(wbsTask.yoteiEndDate)
        kosu = wbsTask.jissekiKosu
        break
    }
    return {
      id: wbsTask.id.toString(),
      name: wbsTask.task,
      start,
      end,
      progress: wbsTask.progress_Rate,
      type: 'task',
      isDisabled: false,
      styles: { progressColor: '#0080ff', progressSelectedColor: '#0080ff' },
      project: wbsTask.phase,
      // phase: wbsTask.phase,
      // activity: wbsTask.activity,
      wbsId: wbsTask.wbsId,
      tanto: wbsTask.tanto,
      kosu: kosu
    } as CustomTask
  })

  // projectを作成
  // interface PhaseData {
  //   phase: string;
  //   kijunStartDate: string | null;
  //   jissekiEndDate: string | null;
  // }

  const projects = wbsTasks.reduce((acc: { [phase: string]: CustomTask }, wbsTask: Wbs) => {

    const phase = wbsTask.phase;

    if (!acc[phase]) {
      acc[phase] = {
        id: wbsTask.phase,
        name: wbsTask.phase,
        wbsId: "",
        tanto: "",
        progress: 0,
        type: "project",
        start: new Date(wbsTask.kijunStartDate),
        end: new Date(wbsTask.kijunEndDate),
        kosu: wbsTask.kijunKosu,
        hideChildren: false,
        isDisabled: false,
      };
    } else {
      if (wbsTask.kijunEndDate) {
        if (
          !acc[phase].end ||
          new Date(wbsTask.kijunEndDate) > acc[phase].end
        ) {
          acc[phase].end = new Date(wbsTask.kijunEndDate);
        }
      }
    }

    return acc;
  }, {});

  console.log(projects);

  return tasks.concat(Object.values(projects));
}

export default function GanttChart({ projectId }: { projectId: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [dateType, setDateType] = useState<DateType>("yotei");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [apiTasks, setApiTasks] = useState<Wbs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const apiTasks = await fetchTasks();
        setApiTasks(apiTasks);
        const transformedTasks = transformTasks(apiTasks, dateType);
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

  useEffect(() => {
    if (apiTasks.length > 0) {
      const transformedTasks = transformTasks(apiTasks, dateType);
      setTasks(transformedTasks);
    }
  }, [dateType, apiTasks]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columnWidths = { 
    task: "200px",
    wbsId: "60px",
    tanto: "60px",
    start: "60px",
    end: "60px",
    progress: "30px",
    kosu: "10px",
  };

  const TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }> = ({ headerHeight }) => {
    return (
      <div
        className="flex justify-center items-center gap-4 px-4 bg-gray-100 font-semibold text-sm text-gray-700"
        style={{ height: headerHeight }}
      >
        <div style={{ width: columnWidths.task }}>タスク名</div>
        <div style={{ width: columnWidths.wbsId }}>WBSNO</div>
        <div style={{ width: columnWidths.tanto }}>担当者</div>
        <div style={{ width: columnWidths.start }}>開始日</div>
        <div style={{ width: columnWidths.end }}>終了日</div>
        <div className="text-right" style={{ width: columnWidths.progress }}>
          進捗
        </div>
        <div style={{ width: columnWidths.kosu }}>工数</div>
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
    onExpanderClick: (task: CustomTask) => void;
  }> = ({ tasks, rowHeight }) => {
    return (
      <div>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 px-4 py-2 border-b border-gray-200 text-sm"
            style={{ height: rowHeight }}
          >
            <div className="truncate" style={{ width: columnWidths.task }}>
            <input type="buttom">▼</input>
              {task.name}
            </div>
            <div style={{ width: columnWidths.wbsId }}>{task.wbsId}</div>
            <div style={{ width: columnWidths.tanto }}>{task.tanto}</div>
            <div style={{ width: columnWidths.start }}>
              {task.start.toLocaleDateString("ja-JP")}
            </div>
            <div style={{ width: columnWidths.end }}>
              {task.end.toLocaleDateString("ja-JP")}
            </div>
            <div className="text-right" style={{ width: columnWidths.progress }}>
              {task.progress}%
            </div>
            <div style={{ width: columnWidths.kosu }}>{task.kosu}</div>
          </div>
        ))}
      </div>
    );
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-4 bg-gray-100 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {projectId}のガントチャート
      </h1>
      <ViewModeButtons viewMode={viewMode} setViewMode={setViewMode} />
      <DateTypeSelector dateType={dateType} setDateType={setDateType} />
      <div className="w-full h-[calc(100vh-100px)] bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          columnWidth={60}
          ganttHeight={0}
          barFill={100}
          preStepsCount={10}
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