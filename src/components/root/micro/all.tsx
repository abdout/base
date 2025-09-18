import Card from "@/components/atom/card"
import { micros } from "./config"
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

const iconMap = {
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
  LogbookIcon,
}

export default function MicrosPage() {
  return (
    <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {micros.map((micro) => {
        const IconComponent = iconMap[micro.icon as keyof typeof iconMap]
        return (
          <Card
            key={micro.id}
            id={micro.id}
            title={micro.title}
            description={micro.description}
            icon={IconComponent ? <IconComponent className={micro.iconFill ? "fill-current" : ""} /> : null}
            href={micro.href}
          />
        )
      })}
    </div>
  )
}