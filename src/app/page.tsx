"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

interface Item {
  created_at: string;
  filename: string;
}

function transformData(data: any[]) {
  return data.map(entry => {
    const createdAt = Object.keys(entry)[0];
    const filenameKey = Object.keys(entry).find(key => key !== createdAt);
    return {
      created_at: createdAt,
      filename: filenameKey ? entry[filenameKey] : ""
    };
  });
}

export default function Home() {
  const [data, setData] = useState<Item[]>([]);
  const [sortType, setSortType] = useState<string>("created_at_asc");

  useEffect(() => {
    fetch("/data.csv")
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse<any>(csv, {
          delimiter: ";",
          header: true,
          complete: (result) => {
            console.log("Here", result.data);
            setData(transformData(result.data));
          }
        });
      });
  }, []);

  const sortedData = [...data].sort((a, b) => {
    if (sortType === "created_at_asc") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortType === "filename_asc") {
      return a.filename.localeCompare(b.filename);
    } else if (sortType === "filename_desc") {
      return b.filename.localeCompare(a.filename);
    }
    return 0;
  });

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-4xl">
        <select
          className="mb-4 p-2 rounded bg-gray-800 text-white"
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="created_at_asc">Sort by Created At</option>
          <option value="filename_asc">Sort by Filename (Asc)</option>
          <option value="filename_desc">Sort by Filename (Desc)</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          {sortedData.map((item, index) => (
            <div key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
              <p className="text-sm text-gray-400">{item.created_at}</p>
              <p className="text-lg font-semibold">{item.filename}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}