import GanttChart from "@/components/GanttChart";
import { useSearchParams } from "next/navigation";

export default function GanntChartPage() {
    const searchParams = useSearchParams();
    const projectId: string = searchParams.get("projectId")!;
    console.log(projectId);

    return (
        <> 
        <GanttChart projectId={projectId} />
        </>
    )
}