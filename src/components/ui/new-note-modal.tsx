"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus, Bold, Italic, List, Heading, Eye, Link, Code } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Note {
  id: number
  title: string
  content: string
  tags?: string[]
  project?: string
}

interface NewNoteModalProps {
  open: boolean
  onClose: () => void
  onSave: (note: Note) => void
}

const templates: Record<string, string> = {
  "Shopping List": "- Milk\n- Eggs\n- Bread\n- Coffee",
  "Meeting Notes": "## Meeting Agenda\n- Discuss project timeline\n- Assign tasks\n\n### Action Items\n- [ ] Follow up with team\n- [ ] Send summary email",
  Brainstorm: "# Ideas\n- AI-powered note-taking\n- Collaboration features\n- Mobile app integration",
}

export function NewNoteModal({ open, onClose, onSave }: NewNoteModalProps) {
  const [note, setNote] = useState<Note>({
    id: Date.now(),
    title: "",
    content: "",
    project: "",
    tags: [],
  })

  const [tagInput, setTagInput] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleSave()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  // handle selection for floating toolbar
  const handleSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setToolbarPos({ x: rect.left + rect.width / 2, y: rect.top - 8 })
    } else {
      setToolbarPos(null)
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection)
    return () => document.removeEventListener("mouseup", handleSelection)
  }, [])

  const handleAddTag = () => {
    if (tagInput.trim() && !note.tags?.includes(tagInput.trim())) {
      setNote({ ...note, tags: [...(note.tags || []), tagInput.trim()] })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNote({ ...note, tags: note.tags?.filter((t) => t !== tag) })
  }

  const handleSave = () => {
    if (!note.title.trim() && !note.content.trim()) return
    onSave({ ...note, id: Date.now() })
    setNote({ id: Date.now(), title: "", content: "", project: "", tags: [] })
    onClose()
  }

  // apply formatting from toolbar
  const insertMarkdown = (syntax: string) => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const selected = text.substring(start, end)
    const after = text.substring(end)
    let newText = ""

    switch (syntax) {
      case "bold":
        newText = `${before}**${selected || "bold"}**${after}`
        break
      case "italic":
        newText = `${before}*${selected || "italic"}*${after}`
        break
      case "list":
        newText = `${before}- ${selected || "list item"}\n${after}`
        break
      case "heading":
        newText = `${before}# ${selected || "Heading"}\n${after}`
        break
      case "link":
        newText = `${before}[${selected || "link text"}](url)${after}`
        break
      case "code":
        newText = `${before}\`${selected || "code"}\`${after}`
        break
    }

    setNote({ ...note, content: newText })
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + 2
    }, 0)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[95vw] sm:w-[90vw] lg:w-[85vw] !max-w-[1200px] h-[75vh] 
                   flex flex-col rounded-xl shadow-2xl p-0 bg-background"
      >
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-2xl font-semibold">
            Create a New Note
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-y-auto p-6 relative">
          {/* Floating Toolbar */}
          {toolbarPos && (
            <div
              className="absolute z-50 flex gap-2 bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1"
              style={{
                top: toolbarPos.y,
                left: toolbarPos.x,
                transform: "translate(-50%, -100%)",
              }}
            >
              <Button variant="ghost" size="icon" onClick={() => insertMarkdown("bold")}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => insertMarkdown("italic")}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => insertMarkdown("link")}>
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => insertMarkdown("code")}>
                <Code className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Title</label>
            <Input
              placeholder="Enter note title..."
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="text-lg"
            />
          </div>

          {/* Project + Templates */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Project</label>
              <Select
                value={note.project}
                onValueChange={(val) => setNote({ ...note, project: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Project A">Project A</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Templates</label>
              <Select
                onValueChange={(val) =>
                  setNote({ ...note, content: templates[val] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(templates).map((tpl) => (
                    <SelectItem key={tpl} value={tpl}>
                      {tpl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">Tags</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                className="w-[300px]"
              />
              <Button variant="secondary" size="icon" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {note.tags?.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Content with toolbar + preview */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">Content</label>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => insertMarkdown("bold")}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => insertMarkdown("italic")}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => insertMarkdown("list")}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => insertMarkdown("heading")}>
                  <Heading className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => insertMarkdown("link")}>
                  <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => insertMarkdown("code")}>
                  <Code className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <Textarea
                ref={textareaRef}
                placeholder="Start writing your note in Markdown..."
                className="flex-1 resize-none text-base leading-relaxed min-h-[45vh]"
                value={note.content}
                onChange={(e) => setNote({ ...note, content: e.target.value })}
              />
              {showPreview && (
                <div className="prose dark:prose-invert p-4 border rounded-md overflow-y-auto min-h-[45vh]">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Word & Character Count */}
            <div className="flex justify-end text-xs text-muted-foreground mt-2">
              {note.content.trim().split(/\s+/).filter(Boolean).length} words • {note.content.length} characters
            </div>
          </div>
        </div>

        <DialogFooter className="border-t p-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-gray-800 dark:text-gray-200"
          >
            Cancel (Esc)
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Note (Ctrl+Enter)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
