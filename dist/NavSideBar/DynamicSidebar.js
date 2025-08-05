'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from '../ui/collapsible';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, } from '../ui/sidebar';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../lib/utils';
import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { SearchWrapper } from './search-wrapper';
// Badge component to show on sidebar menu items
const SidebarMenuBadge = ({ children, className, }) => (_jsx("span", { className: cn('ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground', className), children: children }));
const SidebarLoadingSkeleton = () => (_jsxs("div", { className: "space-y-6 p-4", children: [_jsxs("div", { className: "flex flex-col items-center gap-4", children: [_jsx(Skeleton, { className: "h-8 w-24 rounded" }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(Skeleton, { className: "h-10 w-10 rounded-full" }), _jsx(Skeleton, { className: "h-4 w-32 rounded" }), _jsx(Skeleton, { className: "h-3 w-24 rounded" })] })] }), _jsx(Skeleton, { className: "h-9 w-full rounded" }), _jsx("div", { className: "space-y-8", children: [1, 2, 3].map((group) => (_jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { className: "h-4 w-24 rounded" }), _jsx("div", { className: "space-y-2 ml-2", children: [1, 2].map((item) => (_jsx(Skeleton, { className: "h-8 w-full rounded" }, item))) })] }, group))) }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-9 w-full rounded" }), _jsx(Skeleton, { className: "h-9 w-full rounded" })] })] }));
// Helper function to evaluate showIf condition
const shouldShow = (showIf) => {
    if (showIf === undefined)
        return true;
    if (typeof showIf === 'boolean')
        return showIf;
    if (typeof showIf === 'function')
        return showIf();
    return true;
};
const renderHeaderAndFooter = (header, isHeader = true) => {
    if (React.isValidElement(header)) {
        return header;
    }
    if (Array.isArray(header)) {
        return renderGroups(header);
    }
    if (isHeader)
        return renderHeaderFromConfig(header);
    return renderFooterFromConfig(header);
};
const renderIcon = (icon) => {
    if (!icon)
        return null;
    if (React.isValidElement(icon))
        return icon;
    const IconComponent = icon;
    return _jsx(IconComponent, { className: "h-4 w-4" });
};
const renderGroups = (groups) => (_jsx(_Fragment, { children: groups &&
        groups.length > 0 &&
        groups.map((group) => (_jsxs(SidebarGroup, { children: [group.label && _jsx(SidebarGroupLabel, { children: group.label }), _jsx(SidebarGroupContent, { children: _jsx(SidebarMenu, { children: group.items
                            .filter((item) => shouldShow(item.showIf))
                            .map((item) => (_jsx(SidebarMenuItem, { children: _jsx(SidebarMenuButton, { asChild: !!item.url, onClick: item.onClick, tooltip: item.title, disabled: item.disabled, children: item.url ? (_jsxs(Link, { href: item.url, children: [item.icon && renderIcon(item.icon), _jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: item.title }), item.badge && (_jsx(SidebarMenuBadge, { children: item.badge }))] })) : (_jsxs(_Fragment, { children: [item.icon && renderIcon(item.icon), _jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: item.title }), item.badge && (_jsx(SidebarMenuBadge, { children: item.badge }))] })) }) }, item.id))) }) })] }, group.id))) }));
const renderHeaderFromConfig = (config) => {
    return (_jsxs("div", { className: cn('flex flex-col items-center', config.className), children: [config.logo && (_jsxs("div", { className: "flex items-center gap-2", children: [config.logo.iconUrl && (_jsx("div", { className: "relative h-6 w-6", children: _jsx(Image, { src: config.logo.iconUrl, alt: "Logo", fill: true, className: "object-contain" }) })), config.logo.iconComponent && (_jsx(config.logo.iconComponent, { className: "h-6 w-6" })), config.logo.text && (_jsx("span", { className: "font-bold text-xl group-data-[collapsible=icon]:hidden", children: config.logo.text }))] })), config.user && (_jsxs("div", { className: "flex flex-col items-center gap-2 w-full", children: [_jsx("div", { className: "relative h-10 w-10 rounded-full overflow-hidden", children: config.user.avatarUrl ? (_jsx(Image, { src: config.user.avatarUrl, alt: config.user.name || 'User', fill: true, className: "object-cover" })) : (_jsx("div", { className: "flex h-full w-full items-center justify-center bg-muted", children: config.user.avatarComponent ? (_jsx(config.user.avatarComponent, { className: "h-5 w-5" })) : (_jsx("div", { className: "h-5 w-5 rounded-full bg-primary" })) })) }), _jsxs("div", { className: "text-center group-data-[collapsible=icon]:hidden", children: [config.user.name && (_jsx("p", { className: "text-sm font-medium", children: config.user.name })), config.user.email && (_jsx("p", { className: "text-xs text-muted-foreground", children: config.user.email }))] })] }))] }));
};
const renderFooterFromConfig = (config) => {
    var _a;
    return (_jsx("div", { className: cn('space-y-2', config.className), children: (_a = config.buttons) === null || _a === void 0 ? void 0 : _a.map((button) => (_jsxs(Button, { variant: button.variant || 'outline', className: "w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-2", onClick: button.onClick, children: [button.icon && (_jsx(button.icon, { className: "mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" })), _jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: button.label })] }, button.id))) }));
};
export function DynamicSidebar({ config, enableSearch = true, isLoading = false, }) {
    const [openItems, setOpenItems] = useState({});
    const [searchResults, setSearchResults] = useState([]);
    const searchSidebarItems = (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        const results = [];
        config.groups.forEach((group) => {
            group.items
                .filter((item) => shouldShow(item.showIf))
                .forEach((item) => {
                var _a;
                if (item.title.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        id: item.id,
                        title: item.title,
                        groupLabel: group.label,
                        path: group.label ? [group.label] : [],
                        url: item.url,
                        icon: item.icon,
                    });
                }
                (_a = item.subItems) === null || _a === void 0 ? void 0 : _a.filter((subItem) => shouldShow(subItem.showIf)).forEach((subItem) => {
                    if (subItem.title.toLowerCase().includes(query.toLowerCase())) {
                        results.push({
                            id: subItem.id,
                            title: subItem.title,
                            groupLabel: group.label,
                            path: [...(group.label ? [group.label] : []), item.title],
                            isSubItem: true,
                            url: subItem.url,
                            icon: subItem.icon,
                        });
                    }
                });
            });
        });
        setSearchResults(results);
    };
    const toggleCollapsible = (id) => {
        setOpenItems((prev) => (Object.assign(Object.assign({}, prev), { [id]: !prev[id] })));
    };
    const isCollapsibleOpen = (id, defaultOpen) => {
        return openItems[id] === undefined ? !!defaultOpen : openItems[id];
    };
    const renderMenuItem = (item) => {
        var _a;
        // Filter visible sub-items
        const visibleSubItems = (_a = item.subItems) === null || _a === void 0 ? void 0 : _a.filter((subItem) => shouldShow(subItem.showIf));
        const menuButtonContent = (_jsxs(_Fragment, { children: [item.icon && renderIcon(item.icon), _jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: item.title }), item.badge && _jsx(SidebarMenuBadge, { children: item.badge })] }));
        if (visibleSubItems === null || visibleSubItems === void 0 ? void 0 : visibleSubItems.length) {
            return (_jsx(Collapsible, { defaultOpen: item.defaultOpen, open: isCollapsibleOpen(item.id, item.defaultOpen), onOpenChange: () => toggleCollapsible(item.id), className: "w-full", children: _jsxs(SidebarMenuItem, { children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsx(SidebarMenuButton, { tooltip: item.title, children: menuButtonContent }) }), _jsx(CollapsibleContent, { children: _jsx(SidebarMenuSub, { children: visibleSubItems.map((subItem) => (_jsx(SidebarMenuSubItem, { children: _jsx(SidebarMenuSubButton, { asChild: !!subItem.url, onClick: subItem.onClick, children: subItem.url ? (_jsxs("a", { href: subItem.url, children: [renderIcon(subItem.icon), _jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: subItem.title }), subItem.badge && (_jsx(SidebarMenuBadge, { children: subItem.badge }))] })) : (_jsxs(_Fragment, { children: [renderIcon(subItem.icon), _jsx("span", { className: "group-data-[collapsible=icon]:hidden", children: subItem.title }), subItem.badge && (_jsx(SidebarMenuBadge, { children: subItem.badge }))] })) }) }, subItem.id))) }) })] }) }, item.id));
        }
        return (_jsx(SidebarMenuItem, { children: _jsx(SidebarMenuButton, { asChild: !!item.url, onClick: item.onClick, tooltip: item.title, children: item.url ? (_jsx("a", { href: item.url, children: menuButtonContent })) : (menuButtonContent) }) }, item.id));
    };
    if (isLoading) {
        return (_jsx(Sidebar, { variant: "inset", collapsible: "icon", children: _jsx(SidebarLoadingSkeleton, {}) }));
    }
    return (_jsxs(Sidebar, { variant: "inset", collapsible: "icon", className: "sidebar-fixed-bg", children: [config.header && (_jsx(SidebarHeader, { children: renderHeaderAndFooter(config.header) })), _jsxs(SidebarContent, { children: [enableSearch && (_jsx(SearchWrapper, { onSearch: searchSidebarItems, searchResults: searchResults, className: "w-full" })), config.groups.map((group) => (_jsxs(SidebarGroup, { children: [group.label && (_jsx(SidebarGroupLabel, { children: group.label })), _jsx(SidebarGroupContent, { children: _jsx(SidebarMenu, { children: group.items
                                        .filter((item) => shouldShow(item.showIf))
                                        .map(renderMenuItem) }) })] }, group.id)))] }), config.footer && (_jsx(SidebarFooter, { children: renderHeaderAndFooter(config.footer, false) })), _jsx(SidebarRail, {})] }));
}
