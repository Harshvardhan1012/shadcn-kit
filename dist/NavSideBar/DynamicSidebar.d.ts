import React, { ReactNode } from 'react';
export interface SidebarSubItem {
    id: string | number;
    title: string;
    icon?: React.ElementType | React.ReactNode;
    url?: string;
    onClick?: () => void;
    badge?: ReactNode | string | number;
    disabled?: boolean;
    showIf?: boolean | (() => boolean);
}
export interface SidebarItem {
    id: string | number;
    title: string;
    icon?: React.ElementType | React.ReactNode;
    url?: string;
    onClick?: () => void;
    badge?: ReactNode | string | number;
    subItems?: SidebarSubItem[];
    disabled?: boolean;
    defaultOpen?: boolean;
    showIf?: boolean | (() => boolean);
}
export interface SidebarGroup {
    id: string | number;
    label?: string;
    items: SidebarItem[];
}
export interface SidebarHeaderConfig {
    logo?: {
        text?: string;
        iconUrl?: string;
        iconComponent?: React.ElementType;
    };
    user?: {
        name?: string;
        email?: string;
        avatarUrl?: string;
        avatarComponent?: React.ElementType;
    };
    className?: string;
}
export interface SidebarFooterConfig {
    buttons?: Array<{
        id: string | number;
        label: string;
        icon?: React.ElementType;
        onClick?: () => void;
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    }>;
    className?: string;
}
export interface SidebarConfig {
    groups: SidebarGroup[];
    header?: ReactNode | SidebarHeaderConfig | SidebarGroup[];
    footer?: ReactNode | SidebarFooterConfig | SidebarGroup[];
}
interface DynamicSidebarProps {
    config: SidebarConfig;
    enableSearch?: boolean;
    isLoading?: boolean;
}
export declare function DynamicSidebar({ config, enableSearch, isLoading, }: DynamicSidebarProps): import("react/jsx-runtime").JSX.Element;
export {};
