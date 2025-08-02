'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '../ui/dropdown-menu';
import { LaptopIcon, MoonIcon, SunIcon } from '../ui/icons';
import { useTheme } from 'next-themes';
export function ModeToggle() {
    const { setTheme, theme, resolvedTheme } = useTheme();
    // Helper function to preserve color theme when changing mode
    const setMode = (mode) => {
        // Extract color theme if it exists
        let colorPart = '';
        if (theme && theme.includes('-')) {
            colorPart = '-' + theme.split('-')[1];
        }
        if (mode === 'system') {
            setTheme(mode);
        }
        else {
            setTheme(`${mode}${colorPart}`);
        }
    };
    // Determine if we're in dark mode for styling icons
    const isDarkMode = resolvedTheme === 'dark' || (theme && theme.startsWith('dark'));
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "icon", children: [_jsx(SunIcon, { className: `h-5 w-5 transition-all ${isDarkMode ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}` }), _jsx(MoonIcon, { className: `absolute h-5 w-5 transition-all ${isDarkMode ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}` }), _jsx("span", { className: "sr-only", children: "Toggle theme" })] }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsxs(DropdownMenuItem, { onClick: () => setMode('light'), children: [_jsx(SunIcon, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Light" })] }), _jsxs(DropdownMenuItem, { onClick: () => setMode('dark'), children: [_jsx(MoonIcon, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "Dark" })] }), _jsxs(DropdownMenuItem, { onClick: () => setMode('system'), children: [_jsx(LaptopIcon, { className: "mr-2 h-4 w-4" }), _jsx("span", { children: "System" })] })] })] }));
}
