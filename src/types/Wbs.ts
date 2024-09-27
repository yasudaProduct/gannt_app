import { Status } from "./ScheduleMode";

export type Wbs = {
  id: number;
  rowNo: number;
  projectId: string;
  projectName: string;
  wbsId: string;
  phase: string;
  activity: string;
  task: string;
  kinoSbt: string;
  subsystem: string;
  tanto: string;
  tantoRev: string;
  kijunStartDate: string;
  kijunEndDate: string;
  kijunKosu: number;
  kijunKosuBuffer: number;
  yoteiStartDate: string;
  yoteiEndDate: string;
  yoteiKosu: number;
  jissekiStartDate: string | null;
  jissekiEndDate: string | null;
  jissekiKosu: number;
  status: Status;
  progress_Rate: number;
};
