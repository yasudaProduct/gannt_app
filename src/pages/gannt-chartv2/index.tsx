import GanttChartV2 from "@/components/GanttChartV2";
import { GetServerSideProps } from "next";

interface GanttChartPageProps {
    projectId: string | null;
}

export default function GanttChartPage({ projectId }: GanttChartPageProps) {
    if (!projectId) {
        return <div>プロジェクトIDが指定されていません。</div>;
    }

    return (
        <> 
        <GanttChartV2 projectId={projectId} />
        </>
    )
}

export const getServerSideProps: GetServerSideProps<GanttChartPageProps> = async ({ query }) => {
    const projectId = query.projectId as string | null;
  
    return {
      props: {
        projectId,
      },
    };
  };