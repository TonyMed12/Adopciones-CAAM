"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Import dinámico porque usa WebGL/THREE
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function GlobeMinimal() {
  const [globeConfig, setGlobeConfig] = useState<any>(null);

  useEffect(() => {
    setGlobeConfig({
      pointOfView: { lat: 19.7008, lng: -101.186 }, // Morelia exacta
      globeImageUrl:
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      backgroundColor: "#ffffff00",
      showAtmosphere: true,
      atmosphereColor: "#f97316",
      atmosphereAltitude: 0.08,
      markers: [
        {
          lat: 19.7008,
          lng: -101.186,
          size: 0.12,
          color: "#D97706",
        },
      ],
    });
  }, []);

  if (!globeConfig) return null;

  return (
    <div className="w-full h-[260px] flex justify-center items-center">
      <Globe
        width={300}
        height={260}
        showGlobe={true}
        showGraticules={false}
        {...globeConfig}
        markerAltitude={0.08}
        markerResolution={12}
      />
    </div>
  );
}
