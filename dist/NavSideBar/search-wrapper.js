'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from '../ui/command';
import { cn } from '../lib/utils';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
export function SearchWrapper({ onSearch, searchResults = [], className, }) {
    const [isCentered, setIsCentered] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [localResults, setLocalResults] = useState(searchResults);
    const router = useRouter();
    // Update local results when search results prop changes
    useEffect(() => {
        setLocalResults(searchResults);
    }, [searchResults]);
    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openCenteredSearch();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);
    const openCenteredSearch = () => {
        setSearchValue(''); // Clear search input
        setLocalResults([]); // Clear results when opening modal
        setIsCentered(true);
    };
    const handleSearch = (query) => {
        setSearchValue(query);
        onSearch === null || onSearch === void 0 ? void 0 : onSearch(query);
    };
    const handleSelect = (result) => {
        if (result.url) {
            router.push(result.url);
        }
        setIsCentered(false);
    };
    // Group results by section (only if there are results)
    const groupedResults = localResults.length > 0
        ? Object.entries(localResults.reduce((groups, result) => {
            const groupKey = result.groupLabel || 'General';
            return Object.assign(Object.assign({}, groups), { [groupKey]: [...(groups[groupKey] || []), result] });
        }, {}))
        : [];
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: cn('w-full px-4 py-2', className), children: _jsxs(Button, { variant: "outline", className: "w-full flex items-center justify-between text-muted-foreground", onClick: openCenteredSearch, children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Search, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Search..." })] }), _jsxs("kbd", { className: "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground", children: [_jsx("span", { className: "text-xs", children: "\u2318" }), "K"] })] }) }), _jsxs(CommandDialog, { open: isCentered, onOpenChange: setIsCentered, children: [_jsx(CommandInput, { placeholder: "Search for menu items, pages, or features...", value: searchValue, onValueChange: handleSearch, autoFocus: true }), _jsx(CommandList, { children: groupedResults.length > 0 ? (groupedResults.map(([groupName, groupResults]) => (_jsx(CommandGroup, { heading: groupName, children: groupResults.map((result) => (_jsx(CommandItem, { onSelect: () => handleSelect(result), className: result.isSubItem ? 'pl-6' : '', children: result.title }, result.id))) }, groupName)))) : searchValue ? (_jsx(CommandEmpty, { children: "No results found" })) : (_jsx(CommandEmpty, { children: "Type to search..." })) })] })] }));
}
