"use client"

import { useEffect, useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Star, Archive, Trash, Edit } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"

// ---------------------------
// Type definitions
// ---------------------------
interface Note {
  id: number
  title: string
  content: string
  tags?: string[]
  project?: string
  createdAt?: number
}

interface NotesPaneProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onAddNote: () => void
}

// ---------------------------
// NotesPane Component
// ---------------------------
export function NotesPane({
  notes,
  selectedNote,
  onSelectNote,
  onAddNote,
}: NotesPaneProps) {
  // ---------------------------
  // Local State
  // ---------------------------
  const [search, setSearch] = useState("")
  const [isMac, setIsMac] = useState(false)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "title">("newest")

  // Detect platform for search shortcut display
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"))
  }, [])

  // ---------------------------
  // Derived Data
  // ---------------------------
  // Unique projects and tags for filter dropdowns
  const allProjects = useMemo(
    () => Array.from(new Set(notes.map((n) => n.project).filter(Boolean))) as string[],
    [notes]
  )
  const allTags = useMemo(
    () => Array.from(new Set(notes.flatMap((n) => n.tags || []))),
    [notes]
  )

  // Filter & sort notes based on search, filters, and selected sort
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch =
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()) ||
          (note.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
          (note.project || "").toLowerCase().includes(search.toLowerCase())

        const matchesProject = !projectFilter || note.project === projectFilter
        const matchesTag = !tagFilter || (note.tags || []).includes(tagFilter)

        return matchesSearch && matchesProject && matchesTag
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "newest":
            return (b.createdAt || 0) - (a.createdAt || 0)
          case "oldest":
            return (a.createdAt || 0) - (b.createdAt || 0)
          case "title":
            return a.title.localeCompare(b.title)
        }
      })
  }, [notes, search, projectFilter, tagFilter, sortOption])

  // ---------------------------
  // Action Handlers (easy backend integration)
  // ---------------------------
  const handleStar = (note: Note) => {
    console.log("Star note:", note.id)
    // Integrate backend API call here later
  }
  const handleArchive = (note: Note) => {
    console.log("Archive note:", note.id)
    // Integrate backend API call here later
  }
  const handleDelete = (note: Note) => {
    console.log("Delete note:", note.id)
    // Integrate backend API call here later
  }
  const handleEdit = (note: Note) => {
    console.log("Edit note:", note.id)
    // Navigate to edit page or open modal
  }

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="w-1/3 border-r bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-muted/30 backdrop-blur-sm border-b px-4 py-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">My Notes</h2>
        <Button size="sm" onClick={onAddNote}>
          + New
        </Button>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          <span className="absolute right-2 top-2.5 text-xs text-muted-foreground">
            {isMac ? "⌘K" : "Ctrl+K"}
          </span>
        </div>
      </div>

      {/* Filters + Sort */}
      <div className="p-4 border-b flex gap-2">
        <div className="flex-1 flex gap-2">
          {/* Project Filter */}
          <Select
            value={projectFilter || "all"}
            onValueChange={(val) => setProjectFilter(val === "all" ? null : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {allProjects.map((proj) => (
                <SelectItem key={proj} value={proj}>
                  {proj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tag Filter */}
          <Select
            value={tagFilter || "all"}
            onValueChange={(val) => setTagFilter(val === "all" ? null : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select value={sortOption} onValueChange={(val) => setSortOption(val as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredNotes.length === 0 && (
          <p className="text-sm text-muted-foreground">No notes found</p>
        )}

        {filteredNotes.map((note) => (
          <ContextMenu key={note.id}>
            <ContextMenuTrigger asChild>
              <Card
                className={`cursor-pointer rounded-lg border transition p-3 ${
                  selectedNote?.id === note.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => onSelectNote(note)}
              >
                <CardHeader className="p-0 flex items-center justify-between">
                  {/* Title */}
                  <CardTitle className="text-sm font-medium truncate">
                    {note.title}
                  </CardTitle>

                  {/* Action buttons (optional, can be removed if using context menu only) */}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Star note"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStar(note)
                      }}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Archive note"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleArchive(note)
                      }}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete note"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(note)
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Tags & Project */}
                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
                  {note.project && (
                    <Badge variant="outline" className="text-[10px]">
                      {note.project}
                    </Badge>
                  )}
                  {(note.tags || []).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </ContextMenuTrigger>

            {/* Right-click context menu */}
            <ContextMenuContent>
              <ContextMenuItem onSelect={() => handleStar(note)}>
                <Star className="mr-2 h-4 w-4" /> Star
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => handleArchive(note)}>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => handleEdit(note)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onSelect={() => handleDelete(note)}>
                <Trash className="mr-2 h-4 w-4 text-red-500" /> Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </div>
  )
}
