import { type ColumnDef, type OnChangeFn, type RowSelectionState } from '@tanstack/react-table';
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    pageIndex?: number;
    pageSize?: number;
    page: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    isLoading?: boolean;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    rowId?: (originalRow: TData) => string;
    classNameCell?: string;
    exportData?: TData[];
    fileName?: string;
    heading?: string;
    classNameTable?: string;
    errorMessage?: string;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
    havePagination?: boolean;
}
export declare function DataTable<TData, TValue>({ columns, data, page, pageCount, pageIndex, pageSize, onPageChange, onPageSizeChange, isLoading, rowSelection, onRowSelectionChange, rowId, classNameCell, exportData, fileName, heading, classNameTable, errorMessage, hasNextPage, isFetchingNextPage, onLoadMore, havePagination, }: DataTableProps<TData, TValue>): import("react/jsx-runtime").JSX.Element;
export {};
