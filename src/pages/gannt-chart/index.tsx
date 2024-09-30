import GanttChart from "@/components/GanttChart";
import GanttChartV2 from "@/components/GanttChartV2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WbsSummary from "@/components/WbsSummary";
import WbsTable from "@/components/WbsTable";
import { GetServerSideProps } from "next";
import { useState } from "react";

interface GanttChartPageProps {
  projectId: string | null;
}

export default function GanttChartPage({ projectId }: GanttChartPageProps) {
  const [activeTab, setActiveTab] = useState("v1");

  if (!projectId) {
    return <div>プロジェクトIDが指定されていません。</div>;
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-10">
        <TabsTrigger value="v1">ガントチャート</TabsTrigger>
        <TabsTrigger value="v2">ガントチャート(予実)</TabsTrigger>
        <TabsTrigger value="summary">行程別サマリ</TabsTrigger>
        <TabsTrigger value="summary-v2">要員別予実集計表</TabsTrigger>
      </TabsList>
      <TabsContent value="v1">
        <GanttChart projectId={projectId} />
      </TabsContent>
      <TabsContent value="v2">
        <GanttChartV2 projectId={projectId} />
      </TabsContent>
      <TabsContent value="summary">
        <WbsSummary projectId={projectId} />
      </TabsContent>
      <TabsContent value="summary-v2">
        <WbsTable projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
}

export const getServerSideProps: GetServerSideProps<
  GanttChartPageProps
> = async ({ query }) => {
  const projectId = query.projectId as string | null;

  return {
    props: {
      projectId,
    },
  };
};
