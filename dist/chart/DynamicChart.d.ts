import { type ChartConfig } from '../ui/chart';
import * as React from 'react';
interface ChartClickData {
    activePayload?: Array<{
        payload: ChartDataPoint;
        dataKey: string;
        value: number | string;
    }>;
    activeLabel?: string;
    activeCoordinate?: {
        x: number;
        y: number;
    };
}
interface RechartsTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number | string;
        name: string;
        dataKey: string;
        color?: string;
        payload?: ChartDataPoint;
    }>;
    label?: string | number;
}
export type ChartType = 'area' | 'line' | 'bar' | 'pie' | 'table' | 'donut';
export interface ChartDataPoint {
    [key: string]: string | number;
}
export interface DynamicChartProps {
    /**
     * Title of the chart
     */
    title?: React.ReactNode;
    /**
     * Description of the chart
     */
    description?: React.ReactNode;
    /**
     * Footer content for the chart
     */
    footer?: React.ReactNode;
    /**
     * Type of chart to render
     */
    chartType?: ChartType;
    /**
     * Data to be displayed in the chart
     */
    data: ChartDataPoint[];
    /**
     * Chart configuration for styling and labels
     */
    config?: ChartConfig;
    /**
     * X-axis dataKey
     */
    xAxisKey?: string;
    /**
     * Y-axis dataKeys
     */
    yAxisKeys?: string[];
    /**
     * Whether to show the grid
     */
    showGrid?: boolean;
    /**
     * Whether to show tooltips
     */
    showTooltip?: boolean;
    /**
     * Whether to show the legend
     */
    showLegend?: boolean;
    /**
     * Custom tooltip formatter
     */
    tooltipFormatter?: (value: unknown, name: string | number, props: RechartsTooltipProps) => React.ReactNode;
    /**
     * Tooltip label formatter
     */
    tooltipLabelFormatter?: (label: unknown, payload: unknown) => React.ReactNode;
    /**
     * Legend position
     */
    legendPosition?: 'top' | 'bottom';
    /**
     * Additional class name for the card
     */
    className?: string;
    /**
     * Height of the chart container - if not provided, will auto-calculate based on data
     */
    height?: number | string;
    /**
     * Custom width for the chart container (defaults to responsive)
     */
    width?: number | string;
    /**
     * Additional props for the specific chart type
     */
    chartProps?: Record<string, unknown>;
    /**
     * Custom classnames for different chart elements
     */
    classNames?: {
        card?: string;
        cardHeader?: string;
        cardTitle?: string;
        cardDescription?: string;
        cardContent?: string;
        cardFooter?: string;
        chart?: string;
    };
    /**
     * X-axis configuration
     */
    xAxis?: {
        hide?: boolean;
        label?: string;
        tickCount?: number;
        tickFormatter?: (value: unknown) => string;
        angle?: number;
        fontSize?: number;
        padding?: {
            left?: number;
            right?: number;
        };
    };
    /**
     * Y-axis configuration
     */
    yAxis?: {
        hide?: boolean;
        label?: string;
        tickCount?: number;
        tickFormatter?: (value: unknown) => string;
        domain?: [number | string, number | string];
        fontSize?: number;
        width?: number;
        padding?: {
            top?: number;
            bottom?: number;
        };
    };
    /**
     * Grid configuration
     */
    grid?: {
        horizontal?: boolean;
        vertical?: boolean;
        horizontalPoints?: number[];
        verticalPoints?: number[];
        strokeDasharray?: string;
    };
    /**
     * Background color for the chart area (supports CSS variables)
     */
    backgroundColor?: string;
    /**
     * Stacked chart (for area and bar charts)
     */
    stacked?: boolean;
    /**
     * Reference lines to add to the chart
     */
    referenceLines?: Array<{
        y?: number;
        x?: number | string;
        label?: string;
        stroke?: string;
        strokeDasharray?: string;
        strokeWidth?: number;
    }>;
    /**
     * Fallback component to display when data is empty
     */
    fallback?: React.ReactNode;
    /**
     * Whether to show the chart type selector dropdown
     */
    showTypeSelector?: boolean;
    /**
     * Callback when chart type changes
     */
    onChartTypeChange?: (type: ChartType) => void;
    /**
     * Custom colors for pie chart segments
     */
    pieColors?: string[];
    /**
     * Auto-sizing configuration
     */
    autoSize?: {
        /**
         * Minimum height for the chart
         */
        minHeight?: number;
        /**
         * Maximum height for the chart
         */
        maxHeight?: number;
        /**
         * Height per data point for bar charts
         */
        heightPerDataPoint?: number;
        /**
         * Base height for charts
         */
        baseHeight?: number;
        /**
         * Enable responsive width (defaults to true)
         */
        responsiveWidth?: boolean;
        /**
         * Minimum width for the chart
         */
        minWidth?: number;
        /**
         * Maximum width for the chart
         */
        maxWidth?: number;
        /**
         * Width per data point for charts
         */
        widthPerDataPoint?: number;
        /**
         * Base width for charts
         */
        baseWidth?: number;
    };
    /**
     * Zoom configuration
     */
    zoom?: {
        /**
         * Enable zoom functionality
         */
        enabled?: boolean;
        /**
         * Zoom increment/decrement factor
         */
        factor?: number;
        /**
         * Minimum zoom level
         */
        minZoom?: number;
        /**
         * Maximum zoom level
         */
        maxZoom?: number;
        /**
         * Initial zoom level
         */
        initialZoom?: number;
        /**
         * Show zoom controls
         */
        showControls?: boolean;
        /**
         * Whether to highlight the active (clicked) data point
         */
        highlightActive?: boolean;
    };
    /**
     * Callback when a data point is clicked in the chart
     */
    onDataPointClick?: (data: ChartClickData) => void;
    /**
     * Whether to highlight the active (clicked) data point (for pie chart)
     */
    highlightActive?: boolean;
    /**
     * Whether to show the download button
     */
    showDownload?: boolean;
    /**
     * Custom filename for downloads (without extension)
     */
    downloadFilename?: string;
    /**
     * Table configuration
     */
    tableConfig?: {
        /**
         * Whether to show row numbers
         */
        showRowNumbers?: boolean;
        /**
         * Maximum height for the table container
         */
        maxHeight?: number;
        /**
         * Whether to make the table sortable
         */
        sortable?: boolean;
        /**
         * Custom column headers
         */
        columnHeaders?: Record<string, string>;
        /**
         * Columns to hide in table view
         */
        hiddenColumns?: string[];
        /**
         * Custom cell renderer
         */
        cellRenderer?: (value: string | number, key: string, row: ChartDataPoint) => React.ReactNode;
    };
}
export declare function DynamicChart({ title, description, footer, chartType, data, config, xAxisKey, yAxisKeys, showGrid, showTooltip, showLegend, tooltipFormatter, tooltipLabelFormatter, legendPosition, className, height, width, chartProps, classNames, showTypeSelector, onChartTypeChange, pieColors, autoSize, zoom, onDataPointClick, highlightActive, showDownload, downloadFilename, tableConfig, }: DynamicChartProps): import("react/jsx-runtime").JSX.Element;
export {};
