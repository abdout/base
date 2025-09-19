"use client";

import { useState, useEffect, useCallback } from "react";
import { LeadsDataTable, Lead } from "@/components/leads/leads-table";
import { LeadDetailSheet } from "@/components/leads/lead-detail-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, TrendingUp, Users, Target, DollarSign } from "lucide-react";
import { PasteImport } from "@/components/leads/paste-import";
import { format } from "date-fns";

interface LeadsClientProps {
  lang: string;
}

export default function LeadsClient({ lang }: LeadsClientProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasteImportOpen, setIsPasteImportOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    qualified: 0,
    converted: 0,
  });
  const { toast } = useToast();

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    description: "",
    notes: "",
    linkedinUrl: "",
    companySize: "",
    industry: "",
    status: "NEW",
    source: "MANUAL",
    priority: "MEDIUM",
    tags: [] as string[],
  });

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/leads");
      if (!response.ok) throw new Error("Failed to fetch leads");

      const data = await response.json();

      // Transform the data to match the component interface
      const transformedLeads = data.leads.map((lead: any) => ({
        id: lead.id,
        firstName: lead.name.split(" ")[0] || "",
        lastName: lead.name.split(" ").slice(1).join(" ") || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        jobTitle: lead.companySize ? `${lead.industry || ""}` : "",
        status: lead.status.toLowerCase() as any,
        source: lead.source.toLowerCase().replace("_", "") as any,
        score: lead.score || 0,
        createdAt: new Date(lead.createdAt),
        updatedAt: new Date(lead.updatedAt),
        lastContactedAt: lead.lastContactedAt ? new Date(lead.lastContactedAt) : undefined,
        assignedTo: lead.assignedTo || "",
        tags: lead.tags || [],
        notes: lead.notes || "",
      }));

      setLeads(transformedLeads);

      // Calculate stats
      setStats({
        total: data.total,
        new: data.leads.filter((l: any) => l.status === "NEW").length,
        qualified: data.leads.filter((l: any) => l.status === "QUALIFIED").length,
        converted: data.leads.filter((l: any) => l.status === "CLOSED_WON").length,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle create lead
  const handleCreateLead = async () => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create lead");

      toast({
        title: "Success",
        description: "Lead created successfully",
      });

      setIsCreateOpen(false);
      resetForm();
      fetchLeads();
    } catch (error) {
      console.error("Error creating lead:", error);
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    }
  };

  // Handle update lead
  const handleUpdateLead = async () => {
    if (!editingLead) return;

    try {
      const response = await fetch(`/api/leads/${editingLead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update lead");

      toast({
        title: "Success",
        description: "Lead updated successfully",
      });

      setIsEditOpen(false);
      setEditingLead(null);
      resetForm();
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    }
  };

  // Handle delete leads
  const handleDeleteLeads = async (leadIds: string[]) => {
    try {
      const response = await fetch("/api/leads", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: leadIds }),
      });

      if (!response.ok) throw new Error("Failed to delete leads");

      toast({
        title: "Success",
        description: `${leadIds.length} lead(s) deleted successfully`,
      });

      fetchLeads();
    } catch (error) {
      console.error("Error deleting leads:", error);
      toast({
        title: "Error",
        description: "Failed to delete leads",
        variant: "destructive",
      });
    }
  };

  // Handle view lead
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  // Handle edit lead
  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      website: "",
      description: "",
      notes: lead.notes || "",
      linkedinUrl: "",
      companySize: "",
      industry: lead.jobTitle || "",
      status: lead.status.toUpperCase() as any,
      source: lead.source.toUpperCase() as any,
      priority: "MEDIUM",
      tags: lead.tags || [],
    });
    setIsEditOpen(true);
  };

  // Handle bulk action
  const handleBulkAction = async (action: string, leadIds: string[]) => {
    toast({
      title: "Bulk Action",
      description: `Performing ${action} on ${leadIds.length} leads`,
    });
    // Implement bulk actions here
  };

  // Handle paste import
  const handlePasteImport = async (extractedData: any[]) => {
    try {
      const promises = extractedData.map((data) =>
        fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name || "Unknown",
            email: data.email,
            phone: data.phone,
            company: data.company,
            linkedinUrl: data.linkedin,
            source: "IMPORT",
            notes: `Imported from paste: ${JSON.stringify(data.metadata || {})}`,
          }),
        })
      );

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `${extractedData.length} leads imported successfully`,
      });

      setIsPasteImportOpen(false);
      fetchLeads();
    } catch (error) {
      console.error("Error importing leads:", error);
      toast({
        title: "Error",
        description: "Failed to import leads",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      website: "",
      description: "",
      notes: "",
      linkedinUrl: "",
      companySize: "",
      industry: "",
      status: "NEW",
      source: "MANUAL",
      priority: "MEDIUM",
      tags: [],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">
            Track and manage your sales leads
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPasteImportOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Import from Paste
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time leads in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for first contact
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualified}</div>
            <p className="text-xs text-muted-foreground">
              Ready for proposal
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.converted}</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed deals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-6">
          <LeadsDataTable
            data={leads}
            onEdit={handleEditLead}
            onDelete={handleDeleteLeads}
            onView={handleViewLead}
            onBulkAction={handleBulkAction}
          />
        </CardContent>
      </Card>

      {/* Lead Detail Sheet */}
      {selectedLead && (
        <LeadDetailSheet
          lead={selectedLead}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          onEdit={handleEditLead}
          onDelete={(id) => handleDeleteLeads([id])}
        />
      )}

      {/* Create Lead Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
            <DialogDescription>
              Add a new lead to your pipeline
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="PROPOSAL">Proposal</SelectItem>
                  <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                  <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                  <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLead}>Create Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>
              Update lead information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-company" className="text-right">
                Company
              </Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                Phone
              </Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="PROPOSAL">Proposal</SelectItem>
                  <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                  <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                  <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLead}>Update Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Paste Import Dialog */}
      <PasteImport
        open={isPasteImportOpen}
        onOpenChange={setIsPasteImportOpen}
        onImport={handlePasteImport}
      />
    </div>
  );
}