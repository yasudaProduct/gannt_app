import { Wbs } from "@/types/Wbs";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Wbs[]>
) {
  const mockData = [
    {
      id: 1,
      projectId: "PROJ001",
      projectName: "ウェブサイトリニューアル",
      wbsId: "D3-0001",
      phase: "計画",
      activity: "要件定義",
      task: "顧客ヒアリング",
      kinoSbt: "機能A",
      subsystem: "フロントエンド",
      tanto: "山田太郎",
      tantoRev: "鈴木花子",
      kijunStartDate: "2023-06-01",
      kijunEndDate: "2023-06-07",
      kijunKosu: 40,
      kijunKosuBuffer: 8,
      yoteiStartDate: "2023-06-01",
      yoteiEndDate: "2023-06-07",
      yoteiKosu: 40,
      jissekiStartDate: "2023-06-01",
      jissekiEndDate: null,
      jissekiKosu: 20,
      status: "進行中",
      progress_Rate: 50,
    },
    {
      id: 2,
      projectId: "D3-0001",
      projectName: "ウェブサイトリニューアル",
      wbsId: "D3-0002",
      phase: "設計",
      activity: "基本設計",
      task: "画面設計",
      kinoSbt: "機能B",
      subsystem: "フロントエンド",
      tanto: "佐藤次郎",
      tantoRev: "高橋美咲",
      kijunStartDate: "2023-06-08",
      kijunEndDate: "2023-06-21",
      kijunKosu: 80,
      kijunKosuBuffer: 16,
      yoteiStartDate: "2023-06-08",
      yoteiEndDate: "2023-06-21",
      yoteiKosu: 80,
      jissekiStartDate: null,
      jissekiEndDate: null,
      jissekiKosu: 0,
      status: "未着手",
      progress_Rate: 0,
    },
    {
      id: 3,
      projectId: "PROJ001",
      projectName: "ウェブサイトリニューアル",
      wbsId: "D3-0003",
      phase: "開発",
      activity: "コーディング",
      task: "ログイン機能実装",
      kinoSbt: "機能C",
      subsystem: "バックエンド",
      tanto: "田中三郎",
      tantoRev: "伊藤恵子",
      kijunStartDate: "2023-06-22",
      kijunEndDate: "2023-07-05",
      kijunKosu: 100,
      kijunKosuBuffer: 20,
      yoteiStartDate: "2023-06-22",
      yoteiEndDate: "2023-07-05",
      yoteiKosu: 100,
      jissekiStartDate: null,
      jissekiEndDate: null,
      jissekiKosu: 0,
      status: "未着手",
      progress_Rate: 0,
    },
  ];

  switch (req.method) {
    case "GET":
      res.status(200).json(mockData)
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
