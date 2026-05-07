'use client';

import { useTransition, useState, type CSSProperties } from 'react';
import { createProject, updateProject, deleteProject } from '@/app/actions';

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Done' | 'Blocked';

export type Project = {
  id: number;
  clientName: string;
  projectName: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

const statusColor: Record<ProjectStatus, string> = {
  'Not Started': 'bg-gray-200 text-gray-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Done: 'bg-green-100 text-green-700',
  Blocked: 'bg-red-100 text-red-700',
};

const styles = {
  page: {
    fontFamily: 'Arial',
    background: '#f4f6f8',
    minHeight: '100vh',
    padding: 20,
  },

  container: {
    maxWidth: 800,
    margin: '0 auto',
  },

  title: {
    textAlign: 'center' as const,
    marginBottom: 20,
  } as CSSProperties,

  form: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
  },

  primaryButton: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: 6,
    cursor: 'pointer',
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  } as CSSProperties,

  card: {
    background: 'white',
    padding: 15,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },

  cardTitle: {
    margin: 0,
  },

  cardSub: {
    margin: 0,
    fontSize: 12,
    color: '#666',
  },

  actions: {
    display: 'flex',
    gap: 8,
  },

  editButton: {
    background: '#f59e0b',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
  },

  deleteButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
  },

  modalStyle: {
    background: '#ffffff',
    borderRadius: 16,
    width: 420,
    padding: 24,
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    transform: 'scale(1)',
    transition: 'all 0.2s ease-in-out',
  },
  overlayStyle: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  } as CSSProperties,
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
  },
  modalSubtitle: {
    margin: '4px 0 0',
    fontSize: 13,
    color: '#64748b',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 16,
  } as CSSProperties,
  modalInput: {
    padding: 12,
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: 14,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    background: 'white',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 14px',
    borderRadius: 10,
    border: 'none',
    background: '#2563eb',
    color: 'white',
    cursor: 'pointer',
  },
};

interface ProjectsClientProps {
  initialProjects: Project[];
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [form, setForm] = useState({
    clientName: '',
    projectName: '',
    status: 'Not Started' as ProjectStatus,
  });

  const isPending = useTransition()[0];

  const handleCreateProject = async () => {
    setErrors([]);

    if (!form.clientName || !form.projectName) {
      if (!form.clientName) setErrors((prev) => [...prev, 'Client Name is required']);
      if (!form.projectName) setErrors((prev) => [...prev, 'Project Name is required']);
      return;
    }

    setIsCreating(true);
    try {
      const result = await createProject(form.clientName, form.projectName, form.status);

      if (result.success) {
        setProjects((prev) => [result.data, ...prev]);
        setForm({ clientName: '', projectName: '', status: 'Not Started' });
        setErrors([]);
      } else {
        setErrors([result.error]);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    setModalErrors([]);

    if (!editingProject.clientName || !editingProject.projectName) {
      if (!editingProject.clientName) setModalErrors((prev) => [...prev, 'Client Name is required']);
      if (!editingProject.projectName) setModalErrors((prev) => [...prev, 'Project Name is required']);
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateProject(
        editingProject.id,
        editingProject.clientName,
        editingProject.projectName,
        editingProject.status
      );

      if (result.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? result.data : p))
        );
        setIsModalOpen(false);
        setEditingProject(null);
        setModalErrors([]);
      } else {
        setModalErrors([result.error]);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async (projectDetails: Project) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${projectDetails.projectName}?`
    );
    if (!confirmDelete) return;

    setDeletingProjectId(projectDetails.id);
    try {
      const result = await deleteProject(projectDetails.id);

      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectDetails.id));
      } else {
        alert(`Error deleting project: ${result.error}`);
      }
    } finally {
      setDeletingProjectId(null);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
    setModalErrors([]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Client Project Status Tracker</h1>

        {errors.length > 0 && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
            <ul>
              {errors.map((err, i) => (
                <li key={i}>• {err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
          <input
            className="border p-2 rounded"
            placeholder="Client Name"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Project Name"
            value={form.projectName}
            onChange={(e) => setForm({ ...form, projectName: e.target.value })}
            required
          />
          <select
            className="border p-2 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
            required
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Done</option>
            <option>Blocked</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
            onClick={handleCreateProject}
            disabled={isCreating || isPending}
          >
            {isCreating ? 'Adding...' : 'Add Project'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{p.projectName}</h2>
                  <p className="text-sm text-gray-600">{p.clientName}</p>
                </div>

                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[p.status]}`}>
                  {p.status}
                </span>
              </div>

              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>
                  Created:{' '}
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleString('en-PH', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : null}
                </p>
                <p>
                  Updated:{' '}
                  {p.updatedAt
                    ? new Date(p.updatedAt).toLocaleString('en-PH', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : null}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="bg-orange-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  onClick={() => openEditModal(p)}
                  disabled={isUpdating || deletingProjectId !== null}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  onClick={() => handleDeleteProject(p)}
                  disabled={deletingProjectId !== null && deletingProjectId !== p.id}
                >
                  {deletingProjectId === p.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && editingProject && (
        <div
          style={styles.overlayStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => {
            setIsModalOpen(false);
            setModalErrors([]);
          }}
        >
          <div style={styles.modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 id="modal-title" style={styles.modalTitle}>
                Edit Project
              </h2>
              <p style={styles.modalSubtitle}>Update project details below</p>
            </div>

            {modalErrors.length > 0 && (
              <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
                <ul>
                  {modalErrors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={styles.modalBody}>
              <input
                style={styles.modalInput}
                placeholder="Client Name"
                value={editingProject.clientName}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    clientName: e.target.value,
                  })
                }
              />

              <input
                style={styles.modalInput}
                placeholder="Project Name"
                value={editingProject.projectName}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    projectName: e.target.value,
                  })
                }
              />

              <select
                style={styles.modalInput}
                value={editingProject.status}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    status: e.target.value as ProjectStatus,
                  })
                }
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelButton}
                onClick={() => {
                  setIsModalOpen(false);
                  setModalErrors([]);
                }}
                disabled={isUpdating}
              >
                Cancel
              </button>

              <button
                style={styles.saveButton}
                onClick={handleUpdateProject}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
