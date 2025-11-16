"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";

export default function GlobeCAAM() {
  const ref = useRef<HTMLDivElement | null>(null);
  const effect = useRef<any>(null);

  useEffect(() => {
    if (!effect.current && ref.current) {
      effect.current = GLOBE({
        el: ref.current,
        THREE,
        color: 0xffa552,
        backgroundColor: 0xffffff,
        size: 1.1,
        points: 12.0,
        maxDistance: 22.0,
      });
    }
    return () => {
      effect.current?.destroy();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="w-full h-[350px] md:h-[450px] rounded-2xl shadow-lg"
    />
  );
}
