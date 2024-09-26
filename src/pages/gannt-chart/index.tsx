import GanttChart from "@/components/GanttChart";
import { useSearchParams } from "next/navigation";

export default function GanntChartPage() {
    // const projectId: string = router.query.id as string;
    // console.log(projectId);

    const searchParams = useSearchParams();
    const projectId: string = searchParams.get("projectId")!;

    return (
        <> 
        <GanttChart projectId={projectId}/>
        </>
    )
}