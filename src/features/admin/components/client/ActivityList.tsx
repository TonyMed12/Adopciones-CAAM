"use client";

import React from "react";
import { ActivityItem } from "./ActivityItem";
import type { ActividadItemType } from "../../types/dashboard";

export function ActividadList({ actividad }: { actividad: ActividadItemType[] }) {
    return (
        <ul className="space-y-3">
            {actividad.map((a, i) => (
                <ActivityItem key={i} tipo={a.tipo} mensaje={a.mensaje} fecha={a.fecha} />
            ))}
        </ul>
    );
}
