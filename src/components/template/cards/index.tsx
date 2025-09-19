import { CardsActivityGoal } from "@/components/template/cards/activity-goal"
import { CardsCalendar } from "@/components/template/cards/calendar"
import { CardsChat } from "@/components/template/cards/chat"
import { CardsCookieSettings } from "@/components/template/cards/cookie-settings"
import { CardsCreateAccount } from "@/components/template/cards/create-account"
import { CardsDataTable } from "@/components/template/cards/data-table"
import { CardsMetric } from "@/components/template/cards/metric"
import { CardsPaymentMethod } from "@/components/template/cards/payment-method"
import { CardsReportIssue } from "@/components/template/cards/report-issue"
import { CardsShare } from "@/components/template/cards/share"
import { CardsStats } from "@/components/template/cards/stats"
import { CardsTeamMembers } from "@/components/template/cards/team-members"
import type { getDictionary } from "@/components/local/dictionaries"

interface CardsDemoProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function CardsDemo({ dictionary }: CardsDemoProps) {
  return (
    <div className="mt-10 md:grids-col-2 grid md:gap-4 lg:grid-cols-10 xl:grid-cols-11 xl:gap-4 rtl:space-x-reverse">
      <div className="space-y-4 lg:col-span-4 xl:col-span-6 xl:space-y-4">
        <CardsStats dictionary={dictionary} />
        <div className="grid gap-1 sm:grid-cols-[260px_1fr] md:hidden">
          <CardsCalendar dictionary={dictionary} />
          <div className="pt-3 sm:pl-2 sm:pt-0 xl:pl-4">
            <CardsActivityGoal dictionary={dictionary} />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-4">
            <CardsMetric dictionary={dictionary} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="space-y-4 xl:space-y-4">
            <CardsTeamMembers dictionary={dictionary} />
            <CardsCookieSettings dictionary={dictionary} />
            <CardsPaymentMethod dictionary={dictionary} />
          </div>
          <div className="space-y-4 xl:space-y-4">
            <CardsChat dictionary={dictionary} />
            <CardsCreateAccount dictionary={dictionary} />
            <div className="hidden xl:block">
              <CardsReportIssue dictionary={dictionary} />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 lg:col-span-6 xl:col-span-5 xl:space-y-4">
        <div className="hidden gap-1 sm:grid-cols-[260px_1fr] md:grid">
          <CardsCalendar dictionary={dictionary} />
          <div className="pt-3 sm:pl-2 sm:pt-0 xl:pl-3">
            <CardsActivityGoal dictionary={dictionary} />
          </div>
          <div className="pt-3 sm:col-span-2 xl:pt-3">
            <CardsMetric dictionary={dictionary} />
          </div>
        </div>
        <div className="hidden md:block">
          <CardsDataTable dictionary={dictionary} />
        </div>
        <CardsShare dictionary={dictionary} />
        <div className="xl:hidden">
          <CardsReportIssue dictionary={dictionary} />
        </div>
      </div>
    </div>
  )
}
