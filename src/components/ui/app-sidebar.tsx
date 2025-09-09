"use client"

import * as React from "react"
import {
  Waves,
  NotebookText,
  Star,
  Archive,
  Folder,
  PlusCircle,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { NavUser } from "../ui/nav-user"
import { NewNoteModal } from "../ui/new-note-modal" // <-- import your modal

// --- Define the Note type ---
type Note = {
  title: string
  content: string
  [key: string]: any
}

// --- Menu Config ---
const notesMenu = [
  { title: "All Notes", icon: NotebookText },
  { title: "Starred", icon: Star },
  { title: "Archive", icon: Archive },
]

const projectsMenu = [
  { title: "Project A", icon: Folder },
  { title: "Project B", icon: Folder },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = {
    name: "Arunabha Jana",
    email: "arunabha@example.com",
    avatar: "/avatars/user.png",
  }

  // --- Modal state ---
  const [isNewNoteOpen, setIsNewNoteOpen] = React.useState(false)
  const openNewNoteModal = () => setIsNewNoteOpen(true)
  const closeNewNoteModal = () => setIsNewNoteOpen(false)

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        {/* Brand / Logo */}
        <SidebarHeader>
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
              <Waves className="h-5 w-5" />
            </div>
            <span className="font-semibold">RippleNotes</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          {/* Notes section */}
          <div className="space-y-1">
            {notesMenu.map(({ title, icon: Icon }) => (
              <Button
                key={title}
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <Icon className="h-4 w-4" />
                {title}
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Projects section */}
          <div className="space-y-1">
            <h4 className="px-2 text-xs font-medium text-muted-foreground">
              Projects
            </h4>
            {projectsMenu.map(({ title, icon: Icon }) => (
              <Button
                key={title}
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <Icon className="h-4 w-4" />
                {title}
              </Button>
            ))}

            {/* Buttons to add items */}
            <Button
              variant="outline"
              className="w-full justify-start gap-2 mt-3"
            >
              <Folder className="h-4 w-4" />
              New Project
            </Button>

            <Button
              variant="default"
              className="w-full justify-start gap-2 mt-2"
              onClick={openNewNoteModal} // <-- triggers modal
            >
              <PlusCircle className="h-4 w-4" />
              New Note
            </Button>
          </div>
        </SidebarContent>

        <SidebarFooter className="p-2">
          <NavUser user={user} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* --- New Note Modal --- */}
      <NewNoteModal
        open={isNewNoteOpen}
        onClose={closeNewNoteModal}
        onSave={(note: Note) => {
          console.log("New note saved:", note)
          closeNewNoteModal()
        }}
      />
    </>
  )
}
