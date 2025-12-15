import React from "react";

interface Props {
    icon: React.ReactNode;
    title: string;
    desc: string;
    action?: React.ReactNode;
}

export default function StepCard({ icon, title, desc, action }: Props) {
    return (
        <div className="rounded-xl border bg-[#fffaf4] p-4">
            <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full">
                    {icon}
                </span>
                <p className="text-sm font-extrabold">{title}</p>
            </div>
            <p className="mt-1 text-sm">{desc}</p>
            {action && <div className="mt-3">{action}</div>}
        </div>
    );
}
