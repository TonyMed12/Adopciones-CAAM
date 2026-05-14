"use client";
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepState = "completed" | "current" | "upcoming" | "skipped";

export interface Step {
  id: string;
  title: string;
  description?: React.ReactNode;
  state: StepState;
  icon?: React.ReactNode;
}

type Props = {
  steps: Step[];
  className?: string;
  orientation?: "horizontal" | "vertical";
};

/* =================== HORIZONTAL =================== */
function HorizontalStepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative flex items-start justify-between gap-2 sm:gap-4">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isCompleted = step.state === "completed";
        const isCurrent = step.state === "current";

        return (
          <li
            key={step.id}
            className="relative flex-1 flex flex-col items-center text-center"
          >
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-5 left-1/2 w-full h-[3px] rounded-full -z-0",
                  isCompleted ? "bg-[#BC5F36]" : "bg-[#eadacb]"
                )}
                style={{ transform: "translateX(0%)" }}
              />
            )}

            <div
              className={cn(
                "relative z-10 grid place-items-center h-10 w-10 rounded-full text-sm font-bold transition-all shadow-sm",
                isCompleted &&
                  "bg-[#BC5F36] text-white ring-4 ring-[#BC5F36]/15",
                isCurrent &&
                  "bg-white text-[#BC5F36] ring-4 ring-[#BC5F36]/30 border-2 border-[#BC5F36]",
                step.state === "upcoming" &&
                  "bg-white text-[#a78d7b] border-2 border-[#eadacb]",
                step.state === "skipped" &&
                  "bg-slate-100 text-slate-400 border-2 border-slate-200"
              )}
            >
              {isCompleted ? <Check size={18} strokeWidth={3} /> : i + 1}
            </div>

            <div className="mt-2 px-1">
              <p
                className={cn(
                  "text-xs sm:text-sm font-semibold leading-tight",
                  isCurrent || isCompleted
                    ? "text-[#2b1b12]"
                    : "text-[#a78d7b]"
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="hidden sm:block mt-0.5 text-[11px] text-[#7a5c49] leading-tight">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* =================== VERTICAL =================== */
function VerticalStepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative space-y-6">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isCompleted = step.state === "completed";
        const isCurrent = step.state === "current";

        return (
          <li key={step.id} className="relative pl-12">
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-5 top-10 w-[3px] h-[calc(100%+8px)] rounded-full",
                  isCompleted ? "bg-[#BC5F36]" : "bg-[#eadacb]"
                )}
              />
            )}

            <div
              className={cn(
                "absolute left-0 top-0 grid place-items-center h-10 w-10 rounded-full text-sm font-bold shadow-sm",
                isCompleted &&
                  "bg-[#BC5F36] text-white ring-4 ring-[#BC5F36]/15",
                isCurrent &&
                  "bg-white text-[#BC5F36] ring-4 ring-[#BC5F36]/30 border-2 border-[#BC5F36]",
                step.state === "upcoming" &&
                  "bg-white text-[#a78d7b] border-2 border-[#eadacb]",
                step.state === "skipped" &&
                  "bg-slate-100 text-slate-400 border-2 border-slate-200"
              )}
            >
              {isCompleted ? <Check size={18} strokeWidth={3} /> : i + 1}
            </div>

            <div className="pt-1.5 pb-1">
              <p
                className={cn(
                  "text-sm sm:text-base font-extrabold leading-tight",
                  isCurrent || isCompleted
                    ? "text-[#2b1b12]"
                    : "text-[#a78d7b]"
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <div className="mt-1 text-sm text-[#7a5c49] leading-relaxed">
                  {step.description}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Stepper({
  steps,
  orientation = "horizontal",
  className,
}: Props) {
  return (
    <div className={cn("w-full", className)}>
      {orientation === "horizontal" ? (
        <HorizontalStepper steps={steps} />
      ) : (
        <VerticalStepper steps={steps} />
      )}
    </div>
  );
}
