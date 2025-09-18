import * as React from "react"
import { cn } from "@/lib/utils"

export interface SortableContextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SortableContext({ children, className, ...props }: SortableContextProps) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

export interface SortableListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SortableList({ className, ...props }: SortableListProps) {
  return <div className={cn("", className)} {...props} />
}

export interface SortableItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
}

export function SortableItem({ className, ...props }: SortableItemProps) {
  return <div className={cn("", className)} {...props} />
}

export interface SortableHandleProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SortableHandle({ className, ...props }: SortableHandleProps) {
  return <div className={cn("cursor-move", className)} {...props} />
}

export interface SortableDragOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SortableDragOverlay({ className, ...props }: SortableDragOverlayProps) {
  return <div className={cn("", className)} {...props} />
}

export const useSortable = (args?: any) => {
  return {
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }
}