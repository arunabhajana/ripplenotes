"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../../components/ui/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CommandBar } from "@/components/ui/command-bar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DashboardPage() {
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
              <Button size="sm">+ New</Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <Input placeholder="Search notes..." />
            </div>

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {["Meeting notes", "Shopping list", "Project A ideas"].map(
                (title, idx) => (
                  <Card
                    key={idx}
                    className="cursor-pointer rounded-lg border hover:bg-accent hover:text-accent-foreground transition"
                  >
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm font-medium">
                        {title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )
              )}
            </div>
          </div>

          {/* Preview/editor pane */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background backdrop-blur-sm border-b px-6 py-4">
              <h2 className="text-xl font-semibold">Preview</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <Card className="border rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Selected Note Title
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Here is where the note content will appear. You can turn
                    this area into a markdown preview, rich text editor, or any
                    editor of your choice. This pane stretches to fill the
                    viewport height and scrolls independently from the notes
                    list.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <CommandBar />
    </SidebarProvider>
  )
}
