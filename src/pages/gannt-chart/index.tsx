import GanttChart from "@/components/GanttChart";
import GanttChartV2 from "@/components/GanttChartV2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="v1">Gantt Chart V1</TabsTrigger>
        <TabsTrigger value="v2">Gantt Chart V2</TabsTrigger>
      </TabsList>
      <TabsContent value="v1">
        <GanttChart projectId={projectId} />
      </TabsContent>
      <TabsContent value="v2">
        <GanttChartV2 projectId={projectId} />
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
