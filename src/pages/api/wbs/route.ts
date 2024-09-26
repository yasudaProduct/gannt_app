import { NextResponse } from 'next/server'

export async function GET() {
  const tasks = [
    {
      "id": 9006778,
      "projectId": "API開発",
      "projectName": "API開発",
      "wbsId": "D3-0001",
      "phase": "詳細設計",
      "activity": "詳細設計書作成",
      "task": "関数一覧",
      "kinoSbt": "バッチ",
      "subsystem": "共通",
      "tanto": "安田",
      "tantoRev": "田中",
      "kijunStartDate": "2024-10-01T00:00:00",
      "kijunEndDate": "2024-10-02T00:00:00",
      "kijunKosu": 7.5,
      "kijunKosuBuffer": 0,
      "yoteiStartDate": "2024-10-01T00:00:00",
      "yoteiEndDate": "2024-10-02T00:00:00",
      "yoteiKosu": 7.5,
      "jissekiStartDate": null,
      "jissekiEndDate": null,
      "jissekiKosu": 0,
      "status": "",
      "progress_Rate": 0
    },
  ]

  return NextResponse.json(tasks)
}