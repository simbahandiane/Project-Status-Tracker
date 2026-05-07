'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createProject(
  clientName: string,
  projectName: string,
  status: string
): Promise<ActionResult<{ id: number; clientName: string; projectName: string; status: string; createdAt: string; updatedAt: string }>> {
  try {
    if (!clientName || !projectName) {
      return { success: false, error: 'Client Name and Project Name are required' };
    }

    const project = await prisma.project.create({
      data: {
        clientName,
        projectName,
        status,
      },
    });

    revalidatePath('/');
    return {
      success: true,
      data: {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    console.error('Create project error:', message);
    return { success: false, error: message };
  }
}

export async function updateProject(
  id: number,
  clientName: string,
  projectName: string,
  status: string
): Promise<ActionResult<{ id: number; clientName: string; projectName: string; status: string; createdAt: string; updatedAt: string }>> {
  try {
    if (!clientName || !projectName) {
      return { success: false, error: 'Client Name and Project Name are required' };
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        clientName,
        projectName,
        status,
      },
    });

    revalidatePath('/');
    return {
      success: true,
      data: {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    console.error('Update project error:', message);
    return { success: false, error: message };
  }
}

export async function deleteProject(id: number): Promise<ActionResult<null>> {
  try {
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath('/');
    return { success: true, data: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    console.error('Delete project error:', message);
    return { success: false, error: message };
  }
}
