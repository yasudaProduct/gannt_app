import { Wbs } from "@/types/Wbs";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Wbs[]>
) {
  const wbsMockData: Wbs[] = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    rowNo: 100 + index,
    projectId: `P${String(index % 5 + 1).padStart(3, '0')}`, // P001 ~ P005のプロジェクトID
    projectName: `Project ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'][index % 5]}`, 
    wbsId: `D3-${String(index + 1).padStart(4, '0')}`,
    phase: ['基本設計', '詳細設計', '単体開発', '単体テスト', '結合テスト'][index % 5],
    activity: ['Requirements Gathering', 'System Design', 'Development', 'Integration Testing', 'Release'][index % 5],
    task: `Task ${index + 1}`,
    kinoSbt: ['Software', 'Hardware'][index % 2],
    subsystem: `Subsystem ${String.fromCharCode(65 + (index % 5))}`, // Subsystem A ~ Subsystem E
    tanto: ['山田', '斎藤', '本木', '西村', '堀江'][index % 5],
    tantoRev: `Rev ${String.fromCharCode(65 + (index % 3))}`, // Rev A ~ Rev C
    kijunStartDate: `2024-0${index % 12 + 1}-01`,
    kijunEndDate: `2024-0${index % 12 + 1}-10`,
    kijunKosu: 40 + index % 10,
    kijunKosuBuffer: 5,
    yoteiStartDate: `2024-0${index % 12 + 1}-01`,
    yoteiEndDate: `2024-0${index % 12 + 1}-10`,
    yoteiKosu: 40 + index % 10,
    jissekiStartDate: index % 2 === 0 ? `2024-0${index % 12 + 1}-02` : null,
    jissekiEndDate: index % 2 === 0 ? `2024-0${index % 12 + 1}-09` : null,
    jissekiKosu: 100,//index % 2 === 0 ? 30 + index % 10 : 0,
    status: ['未着手', '着手中', '完了'][index % 3],
    progress_Rate: [0, 50, 100][index % 3]
  }));

  switch (req.method) {
    case "GET":
      res.status(200).json(wbsMockData)
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
