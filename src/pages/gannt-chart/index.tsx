import GanttChart from "@/components/GanttChart";
import GanttChartV2 from "@/components/GanttChartV2";
import SideMenu from "@/components/SideMenu";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!projectId) {
    return <div>プロジェクトIDが指定されていません。</div>;
  }

  return (
    <div className="">
      <SideMenu
        isOpen={isMenuOpen}
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isMenuOpen ? "ml-64" : "ml-4"
        }`}
      >
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
      </div>
    </div>
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
