"use client"

import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function CommandBar() {
  const [open, setOpen] = React.useState(false)

  // Open on ⌘K / Ctrl+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search notes, commands…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Notes">
          <CommandItem onSelect={() => alert("Go to All Notes")}>
            All Notes
          </CommandItem>
          <CommandItem onSelect={() => alert("Go to Starred")}>
            Starred
          </CommandItem>
          <CommandItem onSelect={() => alert("Go to Archive")}>
            Archive
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Projects">
          <CommandItem onSelect={() => alert("Open Project A")}>
            Project A
          </CommandItem>
          <CommandItem onSelect={() => alert("Open Project B")}>
            Project B
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
