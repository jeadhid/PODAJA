"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { ModelType, ModelResult } from "@/types";
import { getModelValue, avgUncertainty } from "@/lib/data";
import { 
  getPM10Category, 
  getUncertaintyCategory,
  PM10_BG_CLASSES, 
  UNCERTAINTY_BG_CLASSES 
} from "@/lib/pm10";
import { Search, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingTableProps {
  data: ModelResult[];
  model: ModelType;
  mode?: "prediction" | "uncertainty";
}

interface TableRowData {
  rank: number;
  kecamatan_name: string;
  value: number;
  category: string;
}

export default function RankingTable({ data, model, mode = "prediction" }: RankingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "value", desc: true }, // Default sort by value descending
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const isUncertainty = model === "hbstm" && mode === "uncertainty";

  // Process data for the table
  const tableData = useMemo<TableRowData[]>(() => {
    // Determine the value to sort/rank on
    const sorted = [...data].sort((a, b) => {
      const valA = isUncertainty ? a.pm10_hbstm_uncertainty : getModelValue(a, model);
      const valB = isUncertainty ? b.pm10_hbstm_uncertainty : getModelValue(b, model);
      return valB - valA;
    });

    return sorted.map((row, index) => {
      const val = isUncertainty ? row.pm10_hbstm_uncertainty : getModelValue(row, model);
      const cat = isUncertainty 
        ? getUncertaintyCategory(val, avgUncertainty)
        : getPM10Category(val);

      return {
        rank: index + 1,
        kecamatan_name: row.kecamatan_name,
        value: val,
        category: cat,
      };
    });
  }, [data, model, isUncertainty]);

  // Define columns
  const columns = useMemo<ColumnDef<TableRowData>[]>(
    () => [
      {
        accessorKey: "rank",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center space-x-1 hover:text-slate-900"
          >
            <span>Rank</span>
            <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
          </button>
        ),
        cell: (info) => <span className="font-bold text-slate-500">{info.getValue() as number}</span>,
      },
      {
        accessorKey: "kecamatan_name",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center space-x-1 hover:text-slate-900"
          >
            <span>Kecamatan</span>
            <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
          </button>
        ),
        cell: (info) => <span className="font-semibold text-slate-700">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "value",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center space-x-1 hover:text-slate-900"
          >
            <span>{isUncertainty ? "Uncertainty (SD)" : "PM10 (µg/m³)"}</span>
            <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
          </button>
        ),
        cell: (info) => {
          const val = info.getValue() as number;
          return <span className="font-extrabold text-slate-800">{val.toFixed(isUncertainty ? 2 : 1)}</span>;
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center space-x-1 hover:text-slate-900"
          >
            <span>{isUncertainty ? "Confidence Level" : "Kategori"}</span>
            <ChevronsUpDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
          </button>
        ),
        cell: (info) => {
          const cat = info.getValue() as string;
          const bgClass = isUncertainty
            ? UNCERTAINTY_BG_CLASSES[cat as import("@/lib/pm10").UncertaintyCategory]
            : PM10_BG_CLASSES[cat as import("@/lib/pm10").PM10Category];

          return (
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-bold border shadow-2xs",
                bgClass || "bg-slate-100 text-slate-800 border-slate-200"
              )}
            >
              {cat}
            </span>
          );
        },
      },
    ],
    [isUncertainty]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-all duration-300">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase flex items-center space-x-2">
            <span>Ranking Kecamatan</span>
            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-semibold px-2 py-0.5 rounded-md">
              {tableData.length} Kecamatan
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isUncertainty
              ? "Daftar tingkat ketidakpastian (standard deviation) estimasi HBSTM"
              : "Daftar wilayah berdasarkan nilai estimasi polusi udara PM10"}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 focus:bg-white text-slate-800 placeholder-slate-400 transition-all duration-200"
            placeholder="Cari kecamatan..."
          />
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-100 text-slate-500 font-bold uppercase">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="pb-3 px-4 font-semibold text-slate-500 select-none">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-55">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/70 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-3.5 px-4 text-slate-600 align-middle"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-slate-400 font-medium">
                  Tidak ada kecamatan ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {table.getPageCount() > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 mt-4 border-t border-slate-100 gap-3">
          <span className="text-xs text-slate-400 font-medium">
            Halaman <span className="font-bold text-slate-700">{table.getState().pagination.pageIndex + 1}</span> dari <span className="font-bold text-slate-700">{table.getPageCount()}</span>
          </span>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-600 transition-all duration-200"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-600 transition-all duration-200"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
