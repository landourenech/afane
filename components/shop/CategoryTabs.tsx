"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CategoryTabsProps {
  value?: string
  onValueChange?: (value: string) => void
}

export function CategoryTabs({ value = "tout", onValueChange }: CategoryTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="rounded-none bg-orange-100">
        <TabsTrigger value="tout">Tous</TabsTrigger>
        <TabsTrigger value="nouveaux">Nouveaux</TabsTrigger>
        <TabsTrigger value="equipements">Equipements</TabsTrigger>
        <TabsTrigger value="recoltes">Récoltes</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
