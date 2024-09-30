"use client";

import { Gantt, Task, ViewMode } from "gantt-task-react";
import React, { useEffect, useState } from "react";
import { Wbs } from "@/types/Wbs";
import { DateType, DateTypeSelector } from "./DateTypeButton";
import { Status } from "@/types/ScheduleMode";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { ViewModeButtons } from "./viewModeButton";
import {
  ColumnVisibility,
  ColumnVisibilityToggle,
} from "./ColumnVisibilityToggle";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CustomTask extends Task {
  wbsId: string;
  rowNo: number;
  tanto: string;
  kosu: number;
  status: Status;
}

const fetchTasks = async (projectId: string): Promise<Wbs[]> => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL + `/api/wbs?projectId=${projectId}`
      : "/api/wbs"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

const transformTasks = (wbsTasks: Wbs[], dateType: DateType): CustomTask[] => {
  const projects = wbsTasks.reduce(
    (acc: { [phase: string]: CustomTask }, wbsTask: Wbs) => {
      let start: Date, end: Date;
      let kosu: number;
      const status: Status =
        wbsTask.status == "" ? "未着手" : (wbsTask.status as Status);

      switch (dateType) {
        case "kijun":
          start = new Date(wbsTask.kijunStartDate);
          end = new Date(wbsTask.kijunEndDate);
          kosu = wbsTask.kijunKosu;
          break;
        case "yotei":
          start = new Date(wbsTask.yoteiStartDate);
          end = new Date(wbsTask.yoteiEndDate);
          kosu = wbsTask.yoteiKosu;
          break;
        case "jisseki":
          start = wbsTask.jissekiStartDate
            ? new Date(wbsTask.jissekiStartDate)
            : new Date(wbsTask.yoteiStartDate);
          end = wbsTask.jissekiEndDate
            ? new Date(wbsTask.jissekiEndDate)
            : new Date(wbsTask.yoteiEndDate);
          kosu = wbsTask.jissekiKosu;
          break;
      }

      const phase = wbsTask.phase;

      if (!acc[phase]) {
        acc[phase] = {
          id: wbsTask.phase,
          name: wbsTask.phase,
          wbsId: wbsTask.wbsId,
          tanto: "",
          progress: 0,
          type: "project",
          hideChildren: false,
          isDisabled: false,
          start: start,
          end: end,
          rowNo: wbsTask.rowNo,
          kosu: kosu,
          status: status,
        };
      } else {
        acc[phase].kosu += kosu;

        // すべて未着手であれば未着手とする
        // すべて完了であれば完了とする
        // それ以外は進行中とする
        if (acc[phase].status === "未着手" && status !== "未着手") {
          acc[phase].status = "着手中";
        }
        if (acc[phase].status === "着手中" && status === "完了") {
          acc[phase].status = "着手中";
        }
        if (acc[phase].status === "完了" && status !== "完了") {
          acc[phase].status = "着手中";
        }

        if (end) {
          if (!acc[phase].end || end > acc[phase].end) {
            acc[phase].end = end;
          }
        }
        if (start) {
          if (!acc[phase].start || start < acc[phase].start) {
            acc[phase].start = start;
          }
        }
      }

      return acc;
    },
    {}
  );

  const tasks = wbsTasks.map((wbsTask) => {
    let start: Date, end: Date;
    let kosu: number;
    const status: Status =
      wbsTask.status == "" ? "未着手" : (wbsTask.status as Status);

    switch (dateType) {
      case "kijun":
        start = new Date(wbsTask.kijunStartDate);
        end = new Date(wbsTask.kijunEndDate);
        kosu = wbsTask.kijunKosu;
        break;
      case "yotei":
        start = new Date(wbsTask.yoteiStartDate);
        end = new Date(wbsTask.yoteiEndDate);
        kosu = wbsTask.yoteiKosu;
        break;
      case "jisseki":
        start = wbsTask.jissekiStartDate
          ? new Date(wbsTask.jissekiStartDate)
          : new Date(wbsTask.yoteiStartDate);
        end = wbsTask.jissekiEndDate
          ? new Date(wbsTask.jissekiEndDate)
          : new Date(wbsTask.yoteiEndDate);
        kosu = wbsTask.jissekiKosu;
        break;
    }

    const progress = (wbsTask.jissekiKosu / kosu) * 100;
    return {
      id: wbsTask.id.toString(),
      name: wbsTask.task,
      start,
      end,
      progress: progress,
      type: "task",
      isDisabled: false,
      styles:
        progress > 100
          ? { progressColor: "#ff2b00", progressSelectedColor: "#ff2b00" }
          : { progressColor: "#0080ff", progressSelectedColor: "#0080ff" },
      project: wbsTask.phase,
      // phase: wbsTask.phase,
      // activity: wbsTask.activity,
      rowNo: wbsTask.rowNo,
      wbsId: wbsTask.wbsId,
      tanto: wbsTask.tanto,
      kosu: kosu,
      status: status,
    } as CustomTask;
  });

  // rowNoの昇順でソート
  return Object.values(projects)
    .concat(Object.values(tasks))
    .sort((a, b) => {
      if (a.rowNo < b.rowNo) {
        return -1;
      }
      if (a.rowNo > b.rowNo) {
        return 1;
      }
      return 0;
    });
};

export default function GanttChart({ projectId }: { projectId: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [dateType, setDateType] = useState<DateType>("yotei");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [apiTasks, setApiTasks] = useState<Wbs[]>([]);
  const [isTalebeHide, setIsTalebeHide] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTanto, setSelectedTanto] = useState<string>("all");
  const [tantos, setTantos] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [statuss, setStatus] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    tanto: true,
    start: true,
    end: true,
    kosu: true,
    status: true,
  });
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);

        // タスクを取得
        const apiTasks = await fetchTasks(projectId);
        setApiTasks(apiTasks);

        // タスクを取得gantt-task-reactの形式に変換
        const transformedTasks = transformTasks(apiTasks, dateType);
        setTasks(transformedTasks);

        // 担当者のリストを作成
        const tantoSet = new Set(apiTasks.map((task) => task.tanto));
        setTantos(Array.from(tantoSet));

        // 状況のリストを作成
        const statusSet = new Set(transformedTasks.map((task) => task.status));
        setStatus(Array.from(statusSet));

        setError(null);
      } catch (error) {
        console.log(error);
        setError("タスクの読み込み中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [dateType, projectId]);

  useEffect(() => {
    if (apiTasks.length > 0) {
      const transformedTasks = transformTasks(apiTasks, dateType);
      const filteredTasks = transformedTasks.filter(
        (task) =>
          (selectedTanto === "all" || task.tanto === selectedTanto) &&
          (selectedStatus === "all" || task.status === selectedStatus)
      );
      setTasks(filteredTasks);
    }
  }, [dateType, apiTasks, selectedTanto, selectedStatus]);

  const handleExpanderClick = (task: CustomTask) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  };

  const handleColumnToggle = (column: keyof ColumnVisibility) => {
    setColumnVisibility((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columnWidths = {
    task: "150px",
    wbsId: "61px",
    tanto: "42px",
    start: "5rem",
    end: "5rem",
    progress: "20px",
    kosu: "3rem",
    status: "3rem",
  };

  const TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }> = ({ headerHeight }) => {
    return (
      <div
        className="flex items-center gap-4 px-4 bg-gray-100 font-semibold text-sm text-gray-700"
        style={{ height: headerHeight }}
      >
        <div style={{ width: columnWidths.task }}>タスク名</div>
        <div style={{ width: columnWidths.wbsId }}>WBSNO</div>
        {columnVisibility.tanto && (
          <div
            className="flex items-center justify-center h-full"
            style={{ width: columnWidths.tanto }}
          >
            担当
          </div>
        )}
        {columnVisibility.start && (
          <div
            className="flex items-center justify-center h-full"
            style={{ width: columnWidths.start }}
          >
            開始日
          </div>
        )}
        {columnVisibility.end && (
          <div
            className="flex items-center justify-center h-full"
            style={{ width: columnWidths.end }}
          >
            終了日
          </div>
        )}
        {columnVisibility.kosu && (
          <div
            className="flex items-center justify-center h-full"
            style={{ width: columnWidths.kosu }}
          >
            工数
          </div>
        )}
        {columnVisibility.status && (
          <div
            className="flex items-center justify-center h-full"
            style={{ width: columnWidths.status }}
          >
            状況
          </div>
        )}
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
    expanderFlg: boolean;
  }> = ({ tasks, rowHeight, fontSize, onExpanderClick }) => {

    return (
      <div className="text-xs">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 px-4 border-b border-gray-200 text-sm"
            style={{ height: rowHeight, fontSize: fontSize, backgroundColor: task.type === "project" ? "#f0f0f0" : "" }}
          >
            <div
              className="truncate _nI1Xw"
              style={{ width: columnWidths.task }}
            >
              {task.type === "project" ? (
                <button
                  className="_2QjE6"
                  onClick={() => onExpanderClick(task)}
                >
                  ⚪︎
                </button>
              ) : (
                <div>　</div>
              )}
              <div>{task.name}</div>
            </div>

            {task.type !== "project" ? (
              <div style={{ width: columnWidths.wbsId }}>{task.wbsId}</div>
            ) : (
              <div style={{ width: columnWidths.wbsId }}></div>
            )}

            {columnVisibility.tanto && (
              <div
                className="flex items-center justify-center h-full"
                style={{ width: columnWidths.tanto }}
              >
                {task.tanto}
              </div>
            )}
            {columnVisibility.start && (
              <div
                className="flex items-center justify-center h-full border-l"
                style={{ width: columnWidths.start }}
              >
                {task.start.toLocaleDateString("ja-JP")}
              </div>
            )}
            {columnVisibility.end && (
              <div
                className="flex items-center justify-center h-full border-l"
                style={{ width: columnWidths.end }}
              >
                {task.end.toLocaleDateString("ja-JP")}
              </div>
            )}
            {columnVisibility.kosu && (
              <div
                className="flex items-center justify-center h-full border-l"
                style={{ width: columnWidths.kosu }}
              >
                {task.kosu.toFixed(2)}
              </div>
            )}
            {columnVisibility.status && (
              <div
                className="flex items-center justify-center h-full border-l"
                style={{ width: columnWidths.status }}
              >
                {task.status}
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{projectId}</h1>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowControls(!showControls)}
        className="mb-4 flex items-center"
      >
        {showControls ? (
          <>
            コントロールを隠す
            <ChevronUp className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            コントロールを表示
            <ChevronDown className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      {showControls && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow">
          <div className="flex space-x-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="tanto-select">担当者</Label>
              <Select value={selectedTanto} onValueChange={setSelectedTanto}>
                <SelectTrigger id="tanto-select">
                  <SelectValue placeholder="担当者を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {tantos.map((tanto) => (
                    <SelectItem key={tanto} value={tanto}>
                      {tanto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-select">状況</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="状況を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {statuss.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <ViewModeButtons viewMode={viewMode} setViewMode={setViewMode} />
          <DateTypeSelector dateType={dateType} setDateType={setDateType} />
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="table-hide"
              checked={isTalebeHide}
              onCheckedChange={setIsTalebeHide}
            />
            <Label htmlFor="table-hide">テーブル表示切り替え</Label>
          </div>
          <ColumnVisibilityToggle
            columnVisibility={columnVisibility}
            onToggle={handleColumnToggle}
          />
        </div>
      )}
      <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          viewDate={new Date()}
          listCellWidth={isTalebeHide ? "100" : ""}
          fontSize="12px"
          rowHeight={30}
          barFill={95}
          preStepsCount={100}
          locale="ja-JP"
          TaskListHeader={TaskListHeader}
          TaskListTable={TaskListTable}
          TooltipContent={({ task }: { task: CustomTask }) => (
            <div className="p-2 bg-white rounded shadow-md">
              <h3 className="font-bold">{task.name}</h3>
              <p>開始: {formatDate(task.start)}</p>
              <p>終了: {formatDate(task.end)}</p>
              <p>担当: {task.tanto}</p>
              <p>状況: {task.status}</p>
              <p>工数: {task.kosu}</p>
              <p>進捗: {task.progress}%</p>
            </div>
          )}
          onExpanderClick={handleExpanderClick}
        />
      </div>
    </div>
  );
}
