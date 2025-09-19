"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SwipeableDrawer,
} from "@/components/ui/drawer";
import {
  Mail,
  Phone,
  Building,
  MoreVertical,
  ChevronRight,
  Edit,
  Archive,
  Trash,
  Copy,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Lead } from "./leads-table";
import { format } from "date-fns";

interface MobileLeadCardProps {
  lead: Lead;
  onView?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  onStatusChange?: (leadId: string, status: Lead["status"]) => void;
  className?: string;
}

const statusConfig = {
  new: { label: "New", color: "bg-blue-500" },
  contacted: { label: "Contacted", color: "bg-yellow-500" },
  qualified: { label: "Qualified", color: "bg-green-500" },
  converted: { label: "Converted", color: "bg-purple-500" },
  lost: { label: "Lost", color: "bg-red-500" },
};

export function MobileLeadCard({
  lead,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  className,
}: MobileLeadCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const initials = `${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase();
  const fullName = `${lead.firstName} ${lead.lastName}`;
  const status = statusConfig[lead.status];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "email":
        window.location.href = `mailto:${lead.email}`;
        break;
      case "phone":
        if (lead.phone) window.location.href = `tel:${lead.phone}`;
        break;
      case "view":
        onView?.(lead);
        break;
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all",
        isPressed && "scale-[0.98]",
        "hover:shadow-lg dark:hover:shadow-primary/5",
        className
      )}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={() => onView?.(lead)}
    >
      {/* Status Indicator Bar */}
      <div className={cn("h-1 w-full", status.color)} />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{fullName}</h3>
                {lead.score && lead.score >= 80 && (
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                )}
              </div>
              {lead.jobTitle && (
                <p className="text-xs text-muted-foreground">{lead.jobTitle}</p>
              )}
              {lead.company && (
                <div className="flex items-center gap-1 mt-1">
                  <Building className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{lead.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit?.(lead)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(lead.email)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(lead.id)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Contact Info */}
        <div className="space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAction("email");
            }}
            className="flex items-center gap-2 text-sm hover:underline"
          >
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{lead.email}</span>
          </button>
          {lead.phone && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("phone");
              }}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{lead.phone}</span>
            </button>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1 text-xs">
              <span className={cn("h-1.5 w-1.5 rounded-full", status.color)} />
              {status.label}
            </Badge>
            {lead.score && (
              <div className={cn("flex items-center gap-1", getScoreColor(lead.score))}>
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">{lead.score}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {format(lead.createdAt, "MMM d")}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAction("email");
            }}
          >
            <Mail className="h-4 w-4" />
          </Button>
          {lead.phone && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAction("phone");
              }}
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(lead);
            }}
          >
            View
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile Lead List Component
interface MobileLeadListProps {
  leads: Lead[];
  onView?: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
  className?: string;
}

export function MobileLeadList({
  leads,
  onView,
  onEdit,
  onDelete,
  className,
}: MobileLeadListProps) {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      {leads.map((lead) => (
        <MobileLeadCard
          key={lead.id}
          lead={lead}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}