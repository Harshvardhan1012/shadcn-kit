export interface SearchResult {
    id: string | number;
    title: string;
    groupLabel?: string;
    path: string[];
    isSubItem?: boolean;
    url?: string;
    icon?: React.ElementType | React.ReactNode;
}
export interface SearchWrapperProps {
    onSearch?: (query: string) => void;
    searchResults?: SearchResult[];
    className?: string;
}
export declare function SearchWrapper({ onSearch, searchResults, className, }: SearchWrapperProps): import("react/jsx-runtime").JSX.Element;
