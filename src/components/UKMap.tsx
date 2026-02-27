"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const cities = [
  { name: "London", coordinates: [-0.1276, 51.5074] },
  { name: "Manchester", coordinates: [-2.2426, 53.4808] },
  { name: "Birmingham", coordinates: [-1.8904, 52.4862] },
  { name: "Edinburgh", coordinates: [-3.1883, 55.9533] },
  { name: "Cardiff", coordinates: [-3.1791, 51.4816] },
];

export default function UKMap() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-3, 54.5],
          scale: 2800,
        }}
        width={300}
        height={400}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties.name === "United Kingdom")
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E8E2D9"
                  stroke="#C8A96E"
                  strokeWidth={1.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
          }
        </Geographies>
        {cities.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates as [number, number]}>
            <circle r={5} fill="#F5C518" opacity={0.9} />
            <circle r={10} fill="#F5C518" opacity={0.3}>
              <animate
                attributeName="r"
                from="5"
                to="14"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.4"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
