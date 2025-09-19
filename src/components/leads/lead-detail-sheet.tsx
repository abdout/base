"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Clock,
  User,
  Edit2,
  Save,
  X,
  MessageSquare,
  Activity,
  FileText,
  Link,
  Globe,
  Briefcase,
  Tag,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Send,
  PhoneCall,
  Video,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Lead } from "./leads-table";
import { useForm } from "react-hook-form";

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
}

interface Activity {
  id: string;
  type: "email" | "call" | "meeting" | "note" | "status_change";
  title: string;
  description?: string;
  timestamp: Date;
  user: string;
}

const statusOptions = [
  { value: "new", label: "New", color: "bg-blue-500" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-500" },
  { value: "qualified", label: "Qualified", color: "bg-green-500" },
  { value: "converted", label: "Converted", color: "bg-purple-500" },
  { value: "lost", label: "Lost", color: "bg-red-500" },
];

const activityIcons = {
  email: Mail,
  call: PhoneCall,
  meeting: Video,
  note: MessageSquare,
  status_change: Activity,
};

export function LeadDetailSheet({
  lead,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: LeadDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newNote, setNewNote] = useState("");

  const form = useForm<Lead>({
    defaultValues: lead || undefined,
  });

  // Mock activity data
  const activities: Activity[] = [
    {
      id: "1",
      type: "email",
      title: "Welcome email sent",
      description: "Sent introduction email with company overview",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      user: "John Smith",
    },
    {
      id: "2",
      type: "call",
      title: "Initial discovery call",
      description: "Discussed requirements and timeline",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      user: "Jane Doe",
    },
    {
      id: "3",
      type: "status_change",
      title: "Status updated",
      description: "Changed from New to Contacted",
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
      user: "System",
    },
  ];

  const handleEdit = () => {
    if (lead) {
      onEdit?.(lead);
      onOpenChange(false);
    }
  };

  if (!lead) return null;

  const initials = `${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase();
  const fullName = `${lead.firstName} ${lead.lastName}`;
  const currentStatus = statusOptions.find(s => s.value === lead.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-xl">{fullName}</SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  {lead.jobTitle && (
                    <>
                      <span>{lead.jobTitle}</span>
                      {lead.company && <span className="text-muted-foreground">at</span>}
                    </>
                  )}
                  {lead.company && <span>{lead.company}</span>}
                </SheetDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-6 pr-4">
                  {/* Status and Score */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Lead Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Status</Label>
                          {isEditing ? (
                            <Select defaultValue={lead.status}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={cn(
                                          "h-2 w-2 rounded-full",
                                          option.color
                                        )}
                                      />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  currentStatus?.color
                                )}
                              />
                              {currentStatus?.label}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Lead Score</Label>
                          {isEditing ? (
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={lead.score}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{lead.score || "—"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Source</Label>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lead.source}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Created</Label>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(lead.createdAt, "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        {isEditing ? (
                          <Input type="email" defaultValue={lead.email} />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-sm hover:underline"
                            >
                              {lead.email}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        {isEditing ? (
                          <Input type="tel" defaultValue={lead.phone} />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-sm hover:underline"
                            >
                              {lead.phone || "—"}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Information */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        {isEditing ? (
                          <Input defaultValue={lead.company} />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lead.company || "—"}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        {isEditing ? (
                          <Input defaultValue={lead.jobTitle} />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lead.jobTitle || "—"}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {lead.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        )) || <span className="text-sm text-muted-foreground">No tags</span>}
                        {isEditing && (
                          <Button variant="outline" size="sm">
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-4 pr-4">
                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                    <Button size="sm" variant="outline">
                      <PhoneCall className="mr-2 h-4 w-4" />
                      Log Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>

                  <Separator />

                  {/* Activity Timeline */}
                  <div className="relative space-y-4">
                    {activities.map((activity, index) => {
                      const Icon = activityIcons[activity.type];
                      return (
                        <div key={activity.id} className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                              <Icon className="h-4 w-4" />
                            </div>
                            {index < activities.length - 1 && (
                              <div className="absolute top-10 h-full w-px bg-border" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1 pb-8">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{activity.title}</p>
                              <time className="text-xs text-muted-foreground">
                                {formatDistanceToNow(activity.timestamp, {
                                  addSuffix: true,
                                })}
                              </time>
                            </div>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground">
                                {activity.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              by {activity.user}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-4 pr-4">
                  {/* Add Note */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Add Note</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        placeholder="Type your note here..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button size="sm" disabled={!newNote.trim()}>
                        <Send className="mr-2 h-4 w-4" />
                        Add Note
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Existing Notes */}
                  <div className="space-y-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm">Initial Contact</CardTitle>
                            <CardDescription className="text-xs">
                              2 days ago by John Smith
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Reached out via website contact form. Interested in enterprise
                          pricing. Scheduled follow-up call for next week.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm">Requirements Discussion</CardTitle>
                            <CardDescription className="text-xs">
                              1 week ago by Jane Doe
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Looking for a solution to manage 500+ employees. Key requirements:
                          API integration, custom reporting, SSO support.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}