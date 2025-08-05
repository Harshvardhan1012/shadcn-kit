'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '../ui/card';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
export function ThemeDemo() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    // Only show theme information after mounting to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return (_jsx("div", { className: "min-h-[400px] flex items-center justify-center", children: _jsx("p", { className: "text-muted-foreground", children: "Loading theme information..." }) }));
    }
    // Extract base theme and color theme
    const isSystemTheme = theme === 'system';
    const baseTheme = isSystemTheme
        ? resolvedTheme
        : (theme === null || theme === void 0 ? void 0 : theme.includes('-'))
            ? theme === null || theme === void 0 ? void 0 : theme.split('-')[0]
            : theme;
    const colorTheme = (theme === null || theme === void 0 ? void 0 : theme.includes('-')) ? theme === null || theme === void 0 ? void 0 : theme.split('-')[1] : 'default';
    return (_jsx("div", { className: "space-y-4 p-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Current Theme" }), _jsx(CardDescription, { children: "This component demonstrates the theme colors in action" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Theme" }), _jsx("span", { className: "font-medium", children: isSystemTheme ? `System (${resolvedTheme})` : theme })] }), _jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Mode" }), _jsx("span", { className: "font-medium capitalize", children: baseTheme })] }), _jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Color Palette" }), _jsx("span", { className: "font-medium capitalize", children: colorTheme })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx("span", { className: "text-sm font-medium", children: "Primary Button" }), _jsx(Button, { children: "Primary Button" })] }), _jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx("span", { className: "text-sm font-medium", children: "Secondary Button" }), _jsx(Button, { variant: "secondary", children: "Secondary Button" })] }), _jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx("span", { className: "text-sm font-medium", children: "Outline Button" }), _jsx(Button, { variant: "outline", children: "Outline Button" })] }), _jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx("span", { className: "text-sm font-medium", children: "Destructive Button" }), _jsx(Button, { variant: "destructive", children: "Destructive Button" })] })] }), _jsxs("div", { className: "mt-6 space-y-2", children: [_jsx("h3", { className: "text-lg font-medium", children: "Color Theme Samples" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: [_jsx("div", { className: "h-12 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium", children: "Primary" }), _jsx("div", { className: "h-12 rounded-md bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium", children: "Secondary" }), _jsx("div", { className: "h-12 rounded-md bg-accent flex items-center justify-center text-accent-foreground text-sm font-medium", children: "Accent" }), _jsx("div", { className: "h-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium", children: "Muted" }), _jsx("div", { className: "h-12 rounded-md bg-destructive flex items-center justify-center text-destructive-foreground text-sm font-medium", children: "Destructive" }), _jsx("div", { className: "h-12 rounded-md border border-border flex items-center justify-center text-foreground text-sm font-medium", children: "Border" })] })] })] })] }) }));
}
