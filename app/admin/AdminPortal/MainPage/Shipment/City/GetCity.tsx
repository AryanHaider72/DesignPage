import { useState } from "react";

export default function GetCity() {
  const [cities, setCities] = useState<string[]>([
    "Karachi",
    "Lahore",
    "Islamabad",
  ]);
  return (
    <>
      <div className="space-y-4">
        {cities.length === 0 ? (
          <p className="text-neutral-500">No cities added yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {cities.map((city, index) => (
              <li
                key={index}
                className="py-2 px-4 hover:bg-neutral-100/50 rounded transition"
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
