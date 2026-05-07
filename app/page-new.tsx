import { ProjectsClient, type Project } from '@/lib/projects-client';

async function fetchProjects(): Promise<Project[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/projects`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error('Failed to fetch projects:', res.status);
      return [];
    }
    
    const projects = await res.json();
    return projects.map((p: any) => ({
      ...p,
      createdAt: typeof p.createdAt === 'string' ? p.createdAt : new Date(p.createdAt).toISOString(),
      updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : new Date(p.updatedAt).toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function Home() {
  const initialProjects = await fetchProjects();
  
  return <ProjectsClient initialProjects={initialProjects} />;
}
