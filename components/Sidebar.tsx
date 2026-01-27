"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Folder, PlusSquare } from "lucide-react";
import clsx from "clsx";

const files = [
  { name: "abstract.md", path: "/#abstract", label: "Abstract" },
  { name: "linear_rep.ts", path: "/#linear-representation", label: "Linear Representation" },
  { name: "superposition.log", path: "/#superposition", label: "Superposition" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 h-screen border-r border-gray-800 bg-background flex flex-col font-mono text-sm sticky top-0 z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <span className="text-gray-400">EXPLORER</span>
        <PlusSquare className="w-4 h-4 text-gray-600 hover:text-white cursor-pointer" />
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="mb-2">
          <div className="px-2 py-1 flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors">
            <Folder className="w-4 h-4 mr-2 text-oxblood" />
            <span className="font-bold">MECH_INTERP</span>
          </div>
          <div className="pl-4">
            {files.map((file) => (
              <Link
                href={file.path}
                key={file.path}
                className={clsx(
                  "flex items-center px-4 py-2 hover:bg-white/5 transition-colors group",
                  pathname === file.path && "bg-white/10 text-oxblood"
                )}
              >
                <FileText className="w-4 h-4 mr-2 text-gray-500 group-hover:text-oxblood transition-colors" />
                <span className="text-gray-300 group-hover:text-white">
                  {file.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800 text-xs text-gray-600">
        <div>STATUS: ONLINE</div>
        <div>MEM: 43.12 TB</div>
      </div>
    </aside>
  );
}
