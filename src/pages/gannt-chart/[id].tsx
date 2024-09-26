import GanttChart from "@/components/GanttChart";
import router from "next/router";

export default function GanntChartPage() {
    const projectId: string = router.query.id as string;

    return (
        <> 
        <GanttChart projectId={projectId}/>
        </>
    )
}