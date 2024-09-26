;import { Project } from "@/types/Project";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => setProjects(data));
  }, []);

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold">Gantt Chart</h1>
      <p className="text-gray-500">Select a project to view its Gantt chart</p>
      <ul>
        {projects.map((project) => (
          <li key={project.projectId}>
            <Link href={{ pathname: "/gannt-chart", query: {projectId: project.projectId}}}>{project.projectName}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
