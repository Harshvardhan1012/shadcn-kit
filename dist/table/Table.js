import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Skeleton } from '../ui/skeleton';
import { flexRender, getCoreRowModel, useReactTable, } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, FileType, Settings2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '../ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '../ui/table';
import { cn } from '../lib/utils';
import React from 'react';
import { DataTablePagination } from './Pagination';
export function DataTable({ columns, data, page, pageCount, pageIndex = 0, pageSize = 10, onPageChange, onPageSizeChange, isLoading = false, rowSelection = {}, onRowSelectionChange, rowId, classNameCell, exportData, fileName = 'table-export', heading, classNameTable = '', errorMessage = 'An error occurred while fetching data', hasNextPage, isFetchingNextPage, onLoadMore, havePagination = true, // Default to true for backward compatibility
 }) {
    var _a, _b, _c, _d;
    const [pagination, setPagination] = React.useState({
        pageIndex,
        pageSize,
    });
    const [columnVisibility, setColumnVisibility] = React.useState({});
    // Add checkbox column if row selection is enabled
    const columnsWithSelection = React.useMemo(() => {
        if (!onRowSelectionChange)
            return columns; // Create a selection column with checkboxes
        const selectionColumn = {
            id: 'select',
            header: ({ table }) => (_jsx(Checkbox, { checked: table.getIsAllPageRowsSelected(), onCheckedChange: (checked) => {
                    table.toggleAllPageRowsSelected(!!checked);
                }, "aria-label": "Select all rows" })),
            cell: ({ row }) => (_jsx(Checkbox, { checked: row.getIsSelected(), onCheckedChange: (checked) => {
                    row.toggleSelected(!!checked);
                }, "aria-label": "Select row" })),
            enableHiding: false, // Don't allow hiding the selection column
        };
        // Return new array with selection column first
        return [selectionColumn, ...columns];
    }, [columns, onRowSelectionChange]);
    const handleExportExcel = () => {
        if (!exportData)
            return;
        // Get visible columns for export (exclude selection column)
        const visibleColumns = columnsWithSelection.filter((col) => col.id !== 'select' &&
            (col.id ? columnVisibility[col.id] !== false : true));
        // Filter out just the data we want to export (only visible columns)
        const exportable = exportData.map((row) => {
            const result = {};
            visibleColumns.forEach((col) => {
                const accessorKey = col
                    .accessorKey;
                if (accessorKey) {
                    result[accessorKey] = row[accessorKey];
                }
            });
            return result;
        });
        const ws = XLSX.utils.json_to_sheet(exportable);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };
    const handleExportPDF = () => {
        if (!exportData)
            return;
        const doc = new jsPDF();
        // Get visible columns for export (exclude selection column)
        const visibleColumns = columnsWithSelection.filter((col) => col.id !== 'select' &&
            (col.id ? columnVisibility[col.id] !== false : true));
        // Extend jsPDF instance with autoTable plugin
        autoTable(doc, {
            head: [
                visibleColumns
                    .filter((col) => typeof col
                    .accessorKey === 'string')
                    .map((col) => typeof col.header === 'string'
                    ? col.header
                    : col.accessorKey),
            ],
            body: exportData.map((item) => visibleColumns
                .filter((col) => typeof col
                .accessorKey === 'string')
                .map((col) => {
                var _a;
                return String((_a = item[col
                    .accessorKey]) !== null && _a !== void 0 ? _a : '');
            })),
        });
        doc.save(`${fileName}.pdf`);
    };
    const table = useReactTable({
        data,
        columns: columnsWithSelection,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        debugTable: true,
        manualPagination: true,
        pageCount,
        state: {
            pagination,
            rowSelection,
            columnVisibility,
        },
        enableRowSelection: !!onRowSelectionChange,
        enableMultiRowSelection: !!onRowSelectionChange,
        enableSubRowSelection: !!onRowSelectionChange,
        onRowSelectionChange: onRowSelectionChange,
        onColumnVisibilityChange: setColumnVisibility,
        getRowId: rowId,
    });
    return (_jsxs("div", { className: cn('rounded-md border w-full flex gap-2 flex-col', classNameTable), children: [_jsxs("div", { className: "flex gap-2 justify-end items-end w-full p-1", children: [heading && (_jsx("div", { className: "flex-1 text-center font-medium text-xl", children: heading })), exportData && ((_a = table.getRowModel().rows) === null || _a === void 0 ? void 0 : _a.length) > 0 && (_jsxs(_Fragment, { children: [_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs(Button, { onClick: handleExportExcel, variant: "outline", size: "icon", className: "h-8 w-8", children: [_jsx(FileType, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Export Excel" })] }) }), _jsx(TooltipContent, { children: "Export to Excel" })] }) }), _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs(Button, { onClick: handleExportPDF, variant: "outline", size: "icon", className: "h-8 w-8", children: [_jsx(FileText, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Export PDF" })] }) }), _jsx(TooltipContent, { children: "Export to PDF" })] }) })] })), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: "icon", className: "h-8 w-8", children: [_jsx(Settings2, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Toggle columns" })] }) }), _jsx(DropdownMenuContent, { align: "end", className: "w-48", children: table
                                    .getAllColumns()
                                    .filter((column) => typeof column.accessorFn !== 'undefined' &&
                                    column.getCanHide())
                                    .map((column) => {
                                    return (_jsx(DropdownMenuCheckboxItem, { className: "capitalize", checked: column.getIsVisible(), onCheckedChange: (value) => column.toggleVisibility(!!value), children: column.id }, column.id));
                                }) })] })] }), _jsxs(Table, { children: [((_b = table.getRowModel().rows) === null || _b === void 0 ? void 0 : _b.length) > 0 && (_jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => (_jsx(TableRow, { children: headerGroup.headers.map((header) => {
                                return (_jsx(TableHead, { className: "text-center", children: header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext()) }, header.id));
                            }) }, headerGroup.id))) })), _jsx(TableBody, { children: isLoading ? (Array.from({ length: pageSize }).map((_, idx) => (_jsx(TableRow, { className: "h-5", children: columnsWithSelection.map((_, colIdx) => (_jsx(TableCell, { children: _jsx(Skeleton, { className: cn('h-5 w-full rounded', classNameCell) }) }, `skeleton-cell-${colIdx}`))) }, `skeleton-row-${idx}`)))) : ((_c = table.getRowModel().rows) === null || _c === void 0 ? void 0 : _c.length) ? (table.getRowModel().rows.map((row) => (_jsx(TableRow, { className: "text-center hover:bg-muted/50 cursor-pointer", "data-state": row.getIsSelected() && 'selected', children: row.getVisibleCells().map((cell) => (_jsx(TableCell, { className: cn(classNameCell), children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columnsWithSelection.length, className: "h-24 text-center", children: errorMessage }) })) })] }), havePagination &&
                pageCount > page &&
                ((_d = table.getRowModel().rows) === null || _d === void 0 ? void 0 : _d.length) > 0 && (_jsx(DataTablePagination, { page: page, pageSize: pageSize, pageCount: pageCount, onPageChange: (newPage) => {
                    setPagination(Object.assign(Object.assign({}, pagination), { pageIndex: newPage }));
                    onPageChange(newPage);
                }, onPageSizeChange: (newSize) => {
                    setPagination(Object.assign(Object.assign({}, pagination), { pageSize: newSize }));
                    onPageSizeChange(newSize);
                }, isLoading: isLoading, hasNextPage: hasNextPage, isFetchingNextPage: isFetchingNextPage, onLoadMore: onLoadMore }))] }));
}
