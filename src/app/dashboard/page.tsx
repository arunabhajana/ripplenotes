"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../../components/ui/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CommandBar } from "@/components/ui/command-bar"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { NotePreview } from "../../components/ui/note-preview"

interface Note {
  id: number
  title: string
  content: string
  tags?: string[]
  project?: string
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([
    { 
      id: 1, 
      title: "Meeting notes", 
      content: "Discuss project timeline and deliverables.", 
      project: "Work", 
      tags: ["meeting", "planning"] 
    },
    { 
      id: 2, 
      title: "Shopping list", 
      content: "Milk, Eggs, Bread, Coffee.", 
      project: "Personal", 
      tags: ["groceries"] 
    },
    { 
      id: 3, 
      title: "Project A ideas", 
      content: "Brainstorm AI-powered note-taking features.", 
      project: "Project A", 
      tags: ["ideas", "AI", "notes-app"] 
    },
  ])

  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0])

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "Untitled Note",
      content: "Start writing here...",
      project: "General",
      tags: ["draft"],
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
  }

  const updateNote = (updated: Note) => {
    setNotes(notes.map((n) => (n.id === updated.id ? updated : n)))
    setSelectedNote(updated)
  }

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

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Notes list pane */}
          <div className="w-1/3 border-r bg-muted/30 flex flex-col">
            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-muted/30 backdrop-blur-sm border-b px-4 py-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">My Notes</h2>
              <Button size="sm" onClick={addNote}>+ New</Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <Input placeholder="Search notes..." />
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {notes.map((note) => (
                <Card
                  key={note.id}
                  className={`cursor-pointer rounded-lg border transition ${
                    selectedNote?.id === note.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium truncate">
                      {note.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview/editor pane */}
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
    </SidebarProvider>
  )
}
