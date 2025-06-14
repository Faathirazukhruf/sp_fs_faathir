"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProjectSettingsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [project, setProject] = useState<{ id: string; title: string } | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      setProject(data);
      setEditTitle(data.title);
    };
    fetchProject();
  }, [id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/projects/${id}/members`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(data.message || "Something happened");
    setEmail("");
  };

  const handleUpdateTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: editTitle }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      setProject(data);
      setIsEditing(false);
      setMessage("Project updated successfully");
    } else {
      const error = await res.json();
      setMessage(error.message || "Failed to update project");
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Settings</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Project Information</h2>
        {isEditing ? (
          <form onSubmit={handleUpdateTitle} className="flex gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 border p-2 rounded"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(false);
                setEditTitle(project.title);
              }}
              className="border px-4 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-gray-800">{project.title}</span>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Invite Team Members</h2>
        <form className="flex gap-2" onSubmit={handleInvite}>
          <input
            type="email"
            placeholder="User email"
            className="flex-1 border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Invite
          </button>
        </form>
      </div>
      
      {message && (
        <div className={`p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
