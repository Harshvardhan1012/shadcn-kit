'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from '../ui/dropdown-menu';
import { PaletteIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
// Color theme options
const colorThemes = [
    { name: 'Default', value: 'default' },
    { name: 'Red', value: 'red' },
    { name: 'Rose', value: 'rose' },
    { name: 'Orange', value: 'orange' },
    { name: 'Green', value: 'green' },
    { name: 'Blue', value: 'blue' },
];
export function ThemeSelector() {
    const { setTheme, theme, resolvedTheme } = useTheme();
    // Extract the color theme part from the theme string
    const currentColorTheme = (theme === null || theme === void 0 ? void 0 : theme.includes('-'))
        ? theme.split('-')[1]
        : 'default';
    // Function to set theme that preserves light/dark preference
    const setColorTheme = (colorTheme) => {
        // Get the current mode (dark or light) from various possible sources
        let baseTheme;
        // First priority: If theme is explicitly dark or light
        if (theme === 'dark' || theme === 'light') {
            baseTheme = theme;
        }
        // Second priority: If theme is a compound theme (like 'dark-blue')
        else if (theme && theme.includes('-')) {
            baseTheme = theme.startsWith('dark') ? 'dark' : 'light';
        }
        // Third priority: Use resolvedTheme (this accounts for 'system' preference)
        else if (resolvedTheme === 'dark' || resolvedTheme === 'light') {
            baseTheme = resolvedTheme;
        }
        // Fallback if nothing else works
        else {
            baseTheme = 'light'; // Safe default
        }
        // Set the theme - either plain (dark/light) or with color theme
        if (colorTheme === 'default') {
            setTheme(baseTheme);
        }
        else {
            setTheme(`${baseTheme}-${colorTheme}`);
        }
    };
    // Generate color indicator class based on theme
    const getColorClass = (themeValue) => {
        const colorMap = {
            default: 'bg-black',
            red: 'bg-red-500',
            rose: 'bg-rose-500',
            orange: 'bg-orange-500',
            green: 'bg-green-500',
            blue: 'bg-blue-500',
        };
        return colorMap[themeValue] || colorMap.default;
    };
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "icon", children: [_jsx(PaletteIcon, { className: "h-5 w-5" }), _jsx("span", { className: "sr-only", children: "Select color theme" })] }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuLabel, { children: "Color Theme" }), _jsx(DropdownMenuSeparator, {}), colorThemes.map((colorTheme) => (_jsxs(DropdownMenuItem, { onClick: () => setColorTheme(colorTheme.value), className: "flex items-center justify-between", children: [_jsx("span", { children: colorTheme.name }), _jsx("span", { className: `ml-2 h-4 w-4 rounded-full ${getColorClass(colorTheme.value)}`, "aria-hidden": "true" }), (currentColorTheme === colorTheme.value ||
                                (currentColorTheme === 'default' &&
                                    colorTheme.value === 'default')) && (_jsxs("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: [_jsx("span", { className: "sr-only", children: "Active" }), "\u2022"] }))] }, colorTheme.value)))] })] }));
}
