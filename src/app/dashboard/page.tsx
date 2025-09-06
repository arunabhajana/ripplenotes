"use client"

import { SidebarProvider } from "@/components/ui/sidebar"   // <-- import this
import { AppSidebar } from "../../components/ui/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <SidebarProvider>    {/* <-- wrap everything inside here */}
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Notes list pane */}
          <div className="w-1/3 border-r bg-background p-4 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Notes</h2>
              <Button size="sm">+ New</Button>
            </div>
            <Input placeholder="Search notes..." className="mb-4" />

            {/* Example notes list */}
            <div className="space-y-2">
              <Card className="cursor-pointer hover:bg-muted">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Meeting notes</CardTitle>
                </CardHeader>
              </Card>
              <Card className="cursor-pointer hover:bg-muted">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Shopping list</CardTitle>
                </CardHeader>
              </Card>
              <Card className="cursor-pointer hover:bg-muted">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">Project A ideas</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Preview/editor pane */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="mb-4 text-xl font-semibold">Preview</h2>
            <Card>
              <CardHeader>
                <CardTitle>Selected Note Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Here is where the note content will appear. You can turn this
                  area into a markdown preview, rich text editor, etc.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
