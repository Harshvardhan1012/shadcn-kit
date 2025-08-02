interface PaginationProps {
    page: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    isLoading?: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
}
export declare function DataTablePagination({ page, pageSize, pageCount, onPageChange, onPageSizeChange, isLoading, hasNextPage, isFetchingNextPage, onLoadMore, }: PaginationProps): import("react/jsx-runtime").JSX.Element;
export {};
