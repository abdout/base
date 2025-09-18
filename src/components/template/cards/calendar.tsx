"use client"

import { addDays } from "date-fns"
import type { getDictionary } from "@/components/internationalization/dictionaries"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"

const start = new Date(2023, 5, 5)

interface CardsCalendarProps {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
}

export function CardsCalendar({ dictionary }: CardsCalendarProps) {
  return (
    <Card className="w-[255px] shadow-none border rtl:text-right">
      <CardContent className="p-0">
        <Calendar
          numberOfMonths={1}
          mode="range"
          defaultMonth={start}
          selected={{
            from: start,
            to: addDays(start, 8),
          }}
          className="w-fit mx-auto [&_.rdp]:w-auto [&_.rdp-caption]:py-0.5 [&_.rdp-head_th]:text-[10px] [&_.rdp-head_th]:font-normal [&_.rdp-head_th]:h-5 [&_.rdp-head_th]:p-0 [&_.rdp-head_th]:w-7 [&_.rdp-head_row]:h-5 [&_.rdp-day]:h-7 [&_.rdp-day]:w-7 [&_.rdp-day]:text-xs [&_.rdp-months]:space-y-0 [&_.rdp-month]:space-y-0 [&_hr]:hidden [&_.rdp-caption_label]:text-[13px] [&_.rdp-nav]:space-x-0 [&_.rdp-nav_button]:h-6 [&_.rdp-nav_button]:w-6 [&_.rdp-dropdown]:text-xs [&_.rdp-dropdown_month]:text-xs [&_.rdp-dropdown_year]:text-xs [&_.rdp-vhidden]:hidden [&_.rdp-tbody]:space-y-0 [&_.rdp-table]:w-auto [&_.rdp-cell]:p-0 [&_.rdp-cell]:text-center [&_td]:p-0 [&_th]:p-0 [&_tr]:border-0 [&_.rdp-row]:border-0"
        />
      </CardContent>
    </Card>
  )
}
