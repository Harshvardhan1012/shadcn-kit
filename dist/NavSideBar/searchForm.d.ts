export interface SearchResult {
    id: string | number;
    title: string;
    groupLabel?: string;
    path: string[];
    isSubItem?: boolean;
    url?: string;
}
export interface SearchFormProps {
    onSearchAction: (query: string) => void;
    results: SearchResult[];
    className?: string;
    isCentered?: boolean;
    onCloseModal?: () => void;
}
export declare function SearchForm({ onSearchAction, results, className, isCentered, onCloseModal, ...props }: SearchFormProps): import("react/jsx-runtime").JSX.Element;
