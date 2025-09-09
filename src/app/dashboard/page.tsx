"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../../components/ui/app-sidebar"
import { CommandBar } from "@/components/ui/command-bar"
import { NotePreview } from "../../components/ui/note-preview"
import { NotesPane } from "../../components/ui/notes-pane"
import { NewNoteModal } from "../../components/ui/new-note-modal"

interface Note {
  id: number
  title: string
  content: string
  tags?: string[]
  project?: string
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: "Meeting notes", content: "Discuss project timeline and deliverables.", project: "Work", tags: ["meeting", "planning"] },
    { id: 2, title: "Shopping list", content: "Milk, Eggs, Bread, Coffee.", project: "Personal", tags: ["groceries"] },
    { id: 3, title: "Project A ideas", content: "Brainstorm AI-powered note-taking features.", project: "Project A", tags: ["ideas", "AI", "notes-app"] },
  ])

  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Save new note
  const handleSaveNote = (newNote: Note) => {
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
  }

  // Update note
  const updateNote = (updated: Note) => {
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)))
    setSelectedNote(updated)
  }

  // Delete note
  const deleteNote = (id: number) => {
    const filtered = notes.filter((n) => n.id !== id)
    setNotes(filtered)
    setSelectedNote(filtered[0] || null)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Notes pane */}
          <NotesPane
            notes={notes}
            selectedNote={selectedNote}
            onSelectNote={setSelectedNote}
            onAddNote={() => setIsModalOpen(true)}
          />

          {/* Note preview / editor */}
          <div className="flex-1 flex flex-col overflow-hidden p-6">
            <NotePreview
              note={selectedNote}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          </div>
        </div>
      </div>

      <CommandBar />

      {/* New Note Modal */}
      <NewNoteModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
      />
    </SidebarProvider>
  )
}
