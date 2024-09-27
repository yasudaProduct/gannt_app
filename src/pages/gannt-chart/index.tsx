import GanttChart from "@/components/GanttChart";
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
        <GanttChart projectId={projectId} />
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