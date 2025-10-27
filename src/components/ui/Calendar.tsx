"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-2 ${className || ""}`}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-[#5a3b2d]",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent hover:bg-[#BC5F36]/10 rounded-md transition",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-[#BC5F36] rounded-md w-9 font-semibold text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm rounded-md w-9 h-9 p-0 relative focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal text-[#2b1b12] aria-selected:opacity-100",
        day_selected:
          "bg-[#BC5F36] text-white hover:bg-[#a14a2b] focus:bg-[#a14a2b]",
        day_today: "bg-[#fff1e8] text-[#BC5F36]",
        day_disabled: "text-gray-300 opacity-40",
        day_outside: "text-gray-400 opacity-40",
        ...classNames,
      }}
      components={{
        // 🚀 Actualización para nuevas versiones de react-day-picker
        Chevron: ({ orientation }: { orientation: "left" | "right" }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
