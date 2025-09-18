import Card from "@/components/atom/card"
import {
  MathIcon,
  FlowIcon,
  DocsIcon,
  ReportIcon,
  PDFIcon,
  ChatbotIcon,
  InvoiceIcon,
  SalaryIcon,
  TimesheetIcon,
  LeadsIcon,
  ProposalIcon,
  DashboardIcon,
  LogbookIcon
} from "@/components/atom/icons"

const micros = [
  {
    id: "math",
    title: "Math",
    description: "Automate calculations and formula processing.",
    icon: <MathIcon className="size-12" />,
    href: "https://block.databayt.org/math",
  },
  {
    id: "flow",
    title: "Flow",
    description: "Automate workflow and process management.",
    icon: <FlowIcon className="size-12" />,
    href: "https://block.databayt.org/flow",
  },
  {
    id: "docs",
    title: "Docs",
    description: "Generate and manage documentation.",
    icon: <DocsIcon className="size-12" />,
    href: "https://block.databayt.org/docs",
  },
  {
    id: "report",
    title: "Report",
    description: "Autom generate comprehensive reports.",
    icon: <ReportIcon className="size-12 fill-current" />,
    href: "https://block.databayt.org/report",
  },
  {
    id: "pdf",
    title: "PDF",
    description: "Automate PDF processing, extraction, and manipulation.",
    icon: <PDFIcon className="size-12 fill-current" />,
    href: "https://block.databayt.org/pdf",
  },
  {
    id: "chatbot",
    title: "Chatbot",
    description: "Handle automated customer interactions and support.",
    icon: <ChatbotIcon className="size-12" />,
    href: "https://block.databayt.org/chatbot",
  },
  {
    id: "invoice",
    title: "Invoice",
    description: "Automate invoice generation and payment processing.",
    icon: <InvoiceIcon className="size-12" />,
    href: "https://block.databayt.org/invoice",
  },
  {
    id: "salary",
    title: "Salary",
    description: "Automate payroll calculations and salary management.",
    icon: <SalaryIcon className="size-12" />,
    href: "https://block.databayt.org/salary",
  },
  {
    id: "timesheet",
    title: "Timesheet",
    description: "Automate time tracking and attendance management.",
    icon: <TimesheetIcon className="size-12" />,
    href: "https://block.databayt.org/timesheet",
  },
  {
    id: "leads",
    title: "Leads",
    description: "Automate lead tracking and customer relation.",
    icon: <LeadsIcon className="size-12" />,
    href: "https://block.databayt.org/leads",
  },
  {
    id: "proposal",
    title: "Proposal",
    description: "Auto generate proposal and document.",
    icon: <ProposalIcon className="size-12" />,
    href: "https://block.databayt.org/proposal",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Automate data visualization and monitoring.",
    icon: <DashboardIcon className="size-12" />,
    href: "https://block.databayt.org/dashboard",
  },
  {
    id: "logbook",
    title: "Logbook",
    description: "Automate activity logging and record keeping.",
    icon: <LogbookIcon className="size-12" />,
    href: "https://block.databayt.org/logbook",
  },
]

export default function MicrosPage() {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {micros.map((micro) => (
        <Card
          key={micro.id}
          id={micro.id}
          title={micro.title}
          description={micro.description}
          icon={micro.icon}
          href={micro.href}
        />
      ))}
    </div>
  )
}