"use client"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Save,
  Edit,
  Trash,
  Tag,
  Folder,
  X,
} from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

interface Note {
  id: number
  title: string
  content: string
  tags?: string[]
  project?: string
}

interface NotePreviewProps {
  note: Note | null
  onUpdate: (updatedNote: Note) => void
  onDelete: (id: number) => void
}

export function NotePreview({ note, onUpdate, onDelete }: NotePreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<Note | null>(note)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // keep local draft in sync when the selected note changes
  useEffect(() => {
    setDraft(note ? { ...note } : null)
  }, [note])

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a note to view
      </div>
    )
  }

  const handleSave = () => {
    if (!draft) return
    // 🔗 Later: await api.notes.update(draft)
    onUpdate(draft)
    setIsEditing(false)
  }

  // Insert markdown at the current cursor position (keeps cursor between tokens)
  const insertMarkdown = (before: string, after: string = "") => {
    const ta = textareaRef.current
    if (!ta || !draft) return

    const start = ta.selectionStart ?? 0
    const end = ta.selectionEnd ?? 0
    const value = draft.content

    const selected = value.slice(start, end)
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end)

    setDraft(prev => (prev ? { ...prev, content: next } : prev))

    requestAnimationFrame(() => {
      ta.focus()
      // place cursor inside the markers when nothing selected
      const cursorStart = start + before.length
      const cursorEnd = selected ? cursorStart + selected.length : cursorStart
      ta.setSelectionRange(cursorStart, cursorEnd)
    })
  }

  const handleAddTag = (raw: string) => {
    const tag = raw.trim()
    if (!tag) return
    setDraft(prev => {
      if (!prev) return prev
      const existing = new Set(prev.tags ?? [])
      if (existing.has(tag)) return prev
      const updated = { ...prev, tags: [...(prev.tags ?? []), tag] }
      return updated
    })
    // If you want instant persistence:
    // setTimeout(() => draft && onUpdate({ ...draft, tags: [...(draft.tags ?? []), tag] }), 0)
  }

  const handleRemoveTag = (idx: number) => {
    // Use functional update + stop any parent handlers from interfering
    setDraft(prev => {
      if (!prev) return prev
      const nextTags = (prev.tags ?? []).filter((_, i) => i !== idx)
      const updated = { ...prev, tags: nextTags }
      return updated
    })
    // If you want instant persistence:
    // setTimeout(() => {
    //   const next = draft ? { ...draft, tags: (draft.tags ?? []).filter((_, i) => i !== idx) } : null
    //   if (next) onUpdate(next)
    // }, 0)
  }

  // Keyboard shortcuts scoped to the editor only
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMod = e.ctrlKey || e.metaKey
    if (!isMod) return
    const key = e.key.toLowerCase()

    if (key === "b") {
      e.preventDefault()
      insertMarkdown("**", "**")
    } else if (key === "i") {
      e.preventDefault()
      insertMarkdown("_", "_")
    }
  }

  return (
    <Card className="border rounded-lg h-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row justify-between items-center">
        {isEditing ? (
          <Input
            value={draft?.title ?? ""}
            onChange={(e) =>
              setDraft(prev => (prev ? { ...prev, title: e.target.value } : prev))
            }
            className="text-3xl font-bold"
          />
        ) : (
          <CardTitle className="text-3xl font-bold">{note.title}</CardTitle>
        )}

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => insertMarkdown("**", "**")}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => insertMarkdown("_", "_")}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => insertMarkdown("# ", "")}>
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => insertMarkdown("## ", "")}>
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(note.id)}>
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      {/* Metadata */}
      <div className="px-6 pb-2 flex flex-col gap-2 text-sm text-muted-foreground">
        {/* Project */}
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4" />
          {isEditing ? (
            <Select
              value={draft?.project || ""}
              onValueChange={(val) =>
                setDraft(prev => (prev ? { ...prev, project: val } : prev))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {/* 🔗 Later: populate from backend */}
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Project A">Project A</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span>{note.project || "No project"}</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          {isEditing ? (
            <div className="flex flex-wrap gap-2 items-center">
              {(draft?.tags ?? []).map((tag, idx) => (
                <Badge
                  key={`${tag}-${idx}`}
                  variant="secondary"
                  className="px-2 py-0 inline-flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    aria-label={`Remove ${tag}`}
                    className="ml-1 rounded-sm p-0.5 hover:bg-muted"
                    onMouseDown={(e) => {
                      // prevent focus/blur issues
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemoveTag(idx)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                placeholder="Add tag..."
                className="w-[140px] h-7"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag(e.currentTarget.value)
                    e.currentTarget.value = ""
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex gap-1 flex-wrap">
              {(note.tags ?? []).map((tag, idx) => (
                <Badge key={`${tag}-${idx}`} variant="secondary" className="px-2 py-0">
                  {tag}
                </Badge>
              ))}
              {(!note.tags || note.tags.length === 0) && <span>No tags</span>}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex-1 overflow-y-auto">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={draft?.content ?? ""}
            onKeyDown={handleKeyDown} // shortcuts scoped to editor
            onChange={(e) =>
              setDraft(prev => (prev ? { ...prev, content: e.target.value } : prev))
            }
            className="min-h-[300px]"
          />
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
