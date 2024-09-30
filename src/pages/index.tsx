import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/Project";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL
          ? process.env.NEXT_PUBLIC_API_URL + `/api/projects`
          : "/api/projects";

        const response = await fetch(url, {
          method: "GET",
          headers: {},
        });

        if (!response.ok) {
          const data = await response.json();
          setProjects(data);
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6">プロジェクトを選択</p>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : projects.length > 0 ? (
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li key={project.projectId}>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-between hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                      <Link href={{ pathname: "/gannt-chart", query: { projectId: project.projectId } }}>
                        <span>{project.projectName}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">No projects found.</p>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
