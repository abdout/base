import * as React from "react"
import { cn } from "@/lib/utils"

export interface FacetedFilterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FacetedFilter({ className, ...props }: FacetedFilterProps) {
  return <div className={cn("", className)} {...props} />
}

export interface FacetedListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FacetedList({ className, ...props }: FacetedListProps) {
  return <div className={cn("", className)} {...props} />
}

export interface FacetedItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FacetedItem({ className, ...props }: FacetedItemProps) {
  return <div className={cn("", className)} {...props} />
}

export interface FacetedContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FacetedContent({ className, ...props }: FacetedContentProps) {
  return <div className={cn("", className)} {...props} />
}

export interface FacetedTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FacetedTrigger({ className, ...props }: FacetedTriggerProps) {
  return <div className={cn("", className)} {...props} />
}