'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
export function SearchForm(_a) {
    var { onSearchAction, results, className, isCentered = false, onCloseModal } = _a, props = __rest(_a, ["onSearchAction", "results", "className", "isCentered", "onCloseModal"]);
    const [showResults, setShowResults] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const router = useRouter();
    useEffect(() => {
        if (isCentered) {
            const input = document.querySelector('#search');
            if (input) {
                input.focus();
            }
            setShowResults(true);
        }
    }, [isCentered]);
    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            const searchContainer = document.querySelector('#search-container');
            if (searchContainer && !searchContainer.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (_jsxs("div", { id: "search-container", className: cn('relative w-full', isCentered, className), children: [_jsx("form", Object.assign({}, props, { onSubmit: (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const query = formData.get('search');
                    setSearchValue(query);
                    onSearchAction === null || onSearchAction === void 0 ? void 0 : onSearchAction(query);
                }, children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: cn('absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground', isCentered && 'h-5 w-5') }), _jsx(Input, { id: "search", name: "search", value: searchValue, onChange: (e) => {
                                setSearchValue(e.target.value);
                                onSearchAction === null || onSearchAction === void 0 ? void 0 : onSearchAction(e.target.value);
                            }, placeholder: isCentered ? 'Search anything...' : 'Search...', className: cn('flex h-10 w-full rounded-md border bg-background px-10 py-2', 'text-sm placeholder:text-muted-foreground', 'focus-visible:outline-none focus-visible:ring-2', 'focus-visible:ring-ring focus-visible:ring-offset-2', isCentered && 'h-12 text-lg'), autoComplete: "off", onFocus: () => setShowResults(true) })] }) })), (showResults || isCentered) && (_jsx("div", { className: cn('overflow-hidden transition-all duration-150', isCentered ? 'max-h-[60vh]' : 'max-h-[300px]'), children: results.length > 0 ? (_jsx("div", { className: "overflow-y-auto p-2 divide-y divide-border", children: results.map((result) => (_jsx("button", { className: cn('flex flex-col w-full items-start gap-1 px-3 py-2 text-sm', 'hover:bg-accent hover:text-accent-foreground rounded-md transition-colors', 'focus:outline-none focus:bg-accent focus:text-accent-foreground'), onClick: () => {
                            if (result.url) {
                                router.push(result.url);
                            }
                            setShowResults(false);
                            onCloseModal === null || onCloseModal === void 0 ? void 0 : onCloseModal();
                        }, children: _jsxs("div", { className: "w-full space-y-1", children: [_jsx("div", { className: "font-medium truncate", children: result.title }), result.path.length > 0 && (_jsx("div", { className: "text-xs text-muted-foreground truncate", children: result.path.join(' > ') }))] }) }, result.id))) })) : searchValue ? (_jsx("div", { className: "p-4 text-sm text-muted-foreground text-center", children: "No results found" })) : (_jsx("div", { className: "p-4 text-sm text-muted-foreground text-center", children: "Type to search..." })) }))] }));
}
