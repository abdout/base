export interface MicroItem {
  id: string
  title: string
  description: string
  icon: string
  iconFill?: boolean
  href: string
}

export const micros: MicroItem[] = [
  {
    id: "math",
    title: "Math",
    description: "Automate calculations and formula processing.",
    icon: "MathIcon",
    href: "https://block.databayt.org/math",
  },
  {
    id: "flow",
    title: "Flow",
    description: "Automate workflow and process management.",
    icon: "FlowIcon",
    href: "https://block.databayt.org/flow",
  },
  {
    id: "docs",
    title: "Docs",
    description: "Generate and manage documentation.",
    icon: "DocsIcon",
    href: "https://block.databayt.org/docs",
  },
  {
    id: "report",
    title: "Report",
    description: "Autom generate comprehensive reports.",
    icon: "ReportIcon",
    iconFill: true,
    href: "https://block.databayt.org/report",
  },
  {
    id: "pdf",
    title: "PDF",
    description: "Automate PDF processing, extraction, and manipulation.",
    icon: "PDFIcon",
    iconFill: true,
    href: "https://block.databayt.org/pdf",
  },
  {
    id: "chatbot",
    title: "Chatbot",
    description: "Handle automated customer interactions and support.",
    icon: "ChatbotIcon",
    href: "https://block.databayt.org/chatbot",
  },
  {
    id: "invoice",
    title: "Invoice",
    description: "Automate invoice generation and payment processing.",
    icon: "InvoiceIcon",
    href: "https://block.databayt.org/invoice",
  },
  {
    id: "salary",
    title: "Salary",
    description: "Automate payroll calculations and salary management.",
    icon: "SalaryIcon",
    href: "https://block.databayt.org/salary",
  },
  {
    id: "timesheet",
    title: "Timesheet",
    description: "Automate time tracking and attendance management.",
    icon: "TimesheetIcon",
    href: "https://block.databayt.org/timesheet",
  },
  {
    id: "leads",
    title: "Leads",
    description: "Automate lead tracking and customer relation.",
    icon: "LeadsIcon",
    href: "https://block.databayt.org/leads",
  },
  {
    id: "proposal",
    title: "Proposal",
    description: "Auto generate proposal and document.",
    icon: "ProposalIcon",
    href: "https://block.databayt.org/proposal",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Automate data visualization and monitoring.",
    icon: "DashboardIcon",
    href: "https://block.databayt.org/dashboard",
  },
  {
    id: "logbook",
    title: "Logbook",
    description: "Automate activity logging and record keeping.",
    icon: "LogbookIcon",
    href: "https://block.databayt.org/logbook",
  },
]