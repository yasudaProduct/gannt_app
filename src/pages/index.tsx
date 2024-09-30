;import { Project } from "@/types/Project";
import Link from "next/link";
import router from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL + `/api/projects` : '/api/projects'
    fetch(url,{
      method: 'GET',
      headers: {
      }
    })
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
                
            <Link href={{ pathname: "/gannt-chartv2", query: {projectId: project.projectId}}}>{project.projectName}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
