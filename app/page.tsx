'use client';

import { useEffect, useState, type CSSProperties } from 'react';


type ProjectStatus = "Not Started" | "In Progress" | "Done" | "Blocked";

type Project = {
  id: number;
  clientName: string;
  projectName: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
};

const statusColor: Record<ProjectStatus, string> = {
  "Not Started": "bg-gray-200 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Done: "bg-green-100 text-green-700",
  Blocked: "bg-red-100 text-red-700",
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [modalErrors, setModalErrors] = useState<string[]>([]);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  
  // Styling
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
    modalHeader:  {
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
    }
  };

  const [form, setForm] = useState({
    clientName: '',
    projectName: '',
    status: 'Not Started'
  });

  //Get Project List
  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    setProjects(await res.json());
  };
  
  // Create new project
  const createProject = async () => {
    if(!form.clientName || !form.projectName)  {
      if(!form.clientName) setErrors(prev => [...prev, "Client Name is required"]);
      if(!form.projectName) setErrors(prev => [...prev, "Project Name is required"]);
      return;
    }

    await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(form)
    });

    setForm({ clientName: '', projectName: '', status: 'Not Started' });
    setErrors([]);
    fetchProjects();
  };

  // Update existing project
  const updateProject = async () => {
    // add check to ensure editingProject is not null before accessing its properties
    if (!editingProject) return;

    if(!editingProject.clientName || !editingProject.projectName)  {
      if(!editingProject.clientName) setModalErrors(prev => [...prev, "Client Name is required"]);
      if(!editingProject.projectName) setModalErrors(prev => [...prev, "Project Name is required"]);
      return;
    }

    await fetch(`/api/projects/${editingProject.id}`, {
      method: 'PUT',
      body: JSON.stringify(editingProject),
    });

    setIsModalOpen(false);
    setEditingProject(null);
    fetchProjects();
  };

  const deleteProject = async (projectDetails: Project) => {
    // Since using third party or custom modal is an overkill to a simple application, we will use the built-in confirm dialog for delete confirmation
    // This is a simple way to prevent accidental deletions without needing to implement a custom modal
    const confirmDelete = window.confirm(`Are you sure you want to delete this ${projectDetails.projectName}?`);
    if (!confirmDelete) return;
    try {
      // Adding a loading state for the delete button to provide feedback to the user that the deletion is in progress. 
      // This may sometimes causes a flicker effect on the button,  but it provides a better user experience by preventing
      // multiple clicks and indicating that the action is being processed.
      setDeletingProjectId(projectDetails.id);
      const response = await fetch(`/api/projects/${projectDetails.id}`, { method: 'DELETE'});
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Error deleting project");
    } finally {
      setDeletingProjectId(null);
    }
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Client Project Status Tracker</h1>

          {/* Add Error message display*/}
          {errors.length > 0 && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
              <ul>
                {errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Form components*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
            <input className="border p-2 rounded" placeholder="Client Name" 
              value={form.clientName}
              onChange={(e) => setForm({...form, clientName: e.target.value})} 
              required/>
            <input className="border p-2 rounded" placeholder="Project Name" 
              value={form.projectName}
              onChange={(e) => setForm({...form, projectName: e.target.value})} 
              required={true}/>
            <select className="border p-2 rounded"
              value={form.status}
              onChange={(e) => setForm({...form, status: e.target.value})}
              required={true}>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Done</option>
              <option>Blocked</option>
            </select>
            <button className="bg-blue-600 text-white px-4 rounded"
              onClick={() => createProject()}>
              Add Project
            </button>
          </div>

          {/* Card grid display*/}
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

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusColor[p.status]}`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Timestamps */}
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <p>
                    Created: {p.createdAt ? new Date(p.createdAt).toLocaleString("en-PH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }) : null }
                  </p>
                  <p>
                    Updated: {p.updatedAt ? new Date(p.updatedAt).toLocaleString("en-PH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }) : null}
                  </p>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button className="bg-orange-500 text-white px-3 py-1 rounded"
                    onClick={() => openEditModal(p)}>
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => {deleteProject(p)} }>
                     { deletingProjectId === p.id ? "Deleting..." : "Delete" }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Start of Modal HTML */}
        {isModalOpen && editingProject && (
          <div style={styles.overlayStyle} onClick={() => setIsModalOpen(false)}>
            
            <div style={styles.modalStyle} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Edit Project</h2>
                <p style={styles.modalSubtitle}>
                  Update project details below
                </p>
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

              {/* Edit form components */}
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
                  <option value="Blocked">Blocked</option>``
                  <option value="Done">Done</option>
                </select>
              </div>

              <div style={styles.modalFooter}>
                <button style={styles.cancelButton} 
                onClick={() => {
                  setIsModalOpen(false); 
                  setModalErrors([]);
                  }
                }>
                  Cancel
                </button>

                <button style={styles.saveButton} onClick={updateProject}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        {/* End of Modal HTML */}
      </div>
  );
}
