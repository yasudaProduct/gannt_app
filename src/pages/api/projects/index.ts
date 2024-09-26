import { Project } from "@/types/Project";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  const mockData = [
    {
      projectId: "PROJ001",
      projectName: "ウェブサイトリニューアル",
    },
    {
      projectId: "PROJ002",
      projectName: "社内システム開発",
    },
  ];

  switch (req.method) {
    case "GET":
      res.status(200).json(mockData);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
