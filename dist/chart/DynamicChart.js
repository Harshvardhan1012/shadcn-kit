import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '../ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, } from '../ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '../ui/table';
import { cn } from '../lib/utils';
import { Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import * as React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, Sector, XAxis, YAxis, } from 'recharts';
// Default chart config
const defaultConfig = {
    chartData1: {
        label: 'Dataset 1',
        theme: {
            light: 'oklch(0.6 0.22 41.116)',
            dark: 'oklch(0.488 0.243 264.376)',
        },
    },
    chartData2: {
        label: 'Dataset 2',
        theme: {
            light: 'oklch(0.6 0.118 184.704)',
            dark: 'oklch(0.696 0.17 162.48)',
        },
    },
    chartData3: {
        label: 'Dataset 3',
        theme: {
            light: 'oklch(0.398 0.07 227.392)',
            dark: 'oklch(0.769 0.188 70.08)',
        },
    },
};
// Default pie chart colors
const DEFAULT_PIE_COLORS = [
    '#8884d8', // Purple
    '#82ca9d', // Green
    '#ffc658', // Yellow
    '#ff7300', // Orange
    '#00ff00', // Lime
    '#0088fe', // Blue
    '#ff0066', // Pink
    '#8dd1e1', // Light Blue
    '#d084d0', // Light Purple
    '#87d068', // Light Green
];
// Default line colors for fallback
const DEFAULT_LINE_COLORS = [
    '#ffca9d', // Purple
    '#82ca9d', // Green
    '#ffc658', // Yellow
    '#ff7300', // Orange
    '#0088fe', // Blue
    '#ff0066', // Pink
    '#8dd1e1', // Light Blue
    '#d084d0', // Light Purple
    '#87d068', // Light Green
    '#00ff00', // Lime
];
// Function to calculate chart dimensions based on data
function calculateChartDimensions(data, chartType, autoSize, providedHeight, providedWidth) {
    const { minHeight = 200, maxHeight = 800, heightPerDataPoint = 40, baseHeight = 400, responsiveWidth = true, minWidth = 500, maxWidth = 2000, widthPerDataPoint = 50, baseWidth = 600, } = autoSize || {};
    let calculatedHeight = baseHeight;
    let calculatedWidth = '100%';
    let cardClassName = 'w-full';
    let chartWidth = baseWidth;
    // Calculate width based on data points
    if (providedWidth !== undefined) {
        calculatedWidth = providedWidth;
        chartWidth = typeof providedWidth === 'number' ? providedWidth : baseWidth;
    }
    else {
        // Calculate width based on chart type and data
        switch (chartType) {
            case 'bar':
            case 'line':
            case 'area':
                // For these chart types, width should scale with number of data points
                chartWidth = Math.max(minWidth, Math.min(maxWidth, data.length * widthPerDataPoint + 100));
                break;
            case 'pie':
                // Pie charts don't need as much width scaling
                chartWidth = Math.min(500, Math.max(300, baseWidth));
                break;
            default:
                chartWidth = baseWidth;
        }
    }
    // If explicit height is provided, use it
    if (providedHeight !== undefined) {
        calculatedHeight = providedHeight;
    }
    else {
        // Calculate height based on chart type and data
        switch (chartType) {
            case 'bar': {
                // For bar charts, height should accommodate all bars
                const barHeight = Math.max(minHeight, Math.min(maxHeight, data.length * heightPerDataPoint + 100));
                calculatedHeight = barHeight;
                break;
            }
            case 'pie':
                // Pie charts can be more compact
                calculatedHeight = Math.min(400, Math.max(300, data.length * 20 + 200));
                break;
            case 'line':
            case 'area':
                // Line and area charts scale with data density
                if (data.length > 20) {
                    calculatedHeight = Math.min(maxHeight, baseHeight + (data.length - 20) * 5);
                }
                else if (data.length < 5) {
                    calculatedHeight = Math.max(minHeight, baseHeight - 50);
                }
                else {
                    calculatedHeight = baseHeight;
                }
                break;
            default:
                calculatedHeight = baseHeight;
        }
    }
    // Set card className based on chart width
    if (responsiveWidth) {
        if (chartWidth > 1200) {
            cardClassName = 'w-full overflow-x-auto';
        }
        else if (chartWidth > 800) {
            cardClassName = 'w-full min-w-[800px]';
        }
        else if (chartWidth > 600) {
            cardClassName = 'w-full min-w-[600px]';
        }
        else {
            cardClassName = 'w-full';
        }
    }
    return {
        height: calculatedHeight,
        width: calculatedWidth,
        cardClassName,
        chartWidth,
    };
}
// Helper function to get color for a data key
function getColorForKey(key, index, config) {
    var _a;
    // First try to get color from CSS variable
    const cssVar = `var(--color-${key})`;
    // Check if the config has a color defined
    if ((_a = config[key]) === null || _a === void 0 ? void 0 : _a.theme) {
        return cssVar;
    }
    // Fallback to default colors
    return DEFAULT_LINE_COLORS[index % DEFAULT_LINE_COLORS.length];
}
// Helper function to convert data to CSV format
function convertToCSV(data) {
    if (!data.length)
        return '';
    const headers = Object.keys(data[0]);
    const csvRows = [];
    // Add headers
    csvRows.push(headers.join(','));
    // Add data rows
    for (const row of data) {
        const values = headers.map((header) => {
            const value = row[header];
            // Escape commas and quotes in values
            if (typeof value === 'string' &&
                (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
}
// Helper function to download file
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
// Helper function to prepare data for different chart types
function prepareDownloadData(data, chartType, yAxisKeys, config) {
    switch (chartType) {
        case 'pie':
            if (yAxisKeys.length > 1) {
                // Multi-series pie chart - aggregate data
                return yAxisKeys.map((key) => {
                    var _a, _b;
                    const total = data.reduce((sum, item) => {
                        return (sum + (typeof item[key] === 'number' ? item[key] : 0));
                    }, 0);
                    return {
                        name: typeof ((_a = config[key]) === null || _a === void 0 ? void 0 : _a.label) === 'string'
                            ? (_b = config[key]) === null || _b === void 0 ? void 0 : _b.label
                            : String(key),
                        value: total,
                        dataKey: key,
                    };
                });
            }
            return data;
        case 'table':
        case 'area':
        case 'line':
        case 'bar':
        default:
            return data;
    }
}
export function DynamicChart({ title, description, footer, chartType = 'line', data = [], config = defaultConfig, xAxisKey = 'name', yAxisKeys = ['value'], showGrid = true, showTooltip = true, showLegend = true, tooltipFormatter, tooltipLabelFormatter, legendPosition = 'bottom', className, height, width, chartProps = {}, classNames, showTypeSelector = true, onChartTypeChange, pieColors = DEFAULT_PIE_COLORS, autoSize, zoom = {
    enabled: true,
    factor: 0.2,
    minZoom: 0.5,
    maxZoom: 3,
    initialZoom: 1,
    showControls: true,
}, onDataPointClick, highlightActive = true, showDownload = true, downloadFilename = 'chart-data', tableConfig = {}, }) {
    var _a, _b;
    // Generate a unique ID for the chart
    const chartId = React.useId();
    // State for chart type
    const [currentChartType, setCurrentChartType] = React.useState(chartType);
    // State for zoom level
    const [zoomLevel, setZoomLevel] = React.useState(zoom.initialZoom || 1);
    // State for table sorting
    const [sortConfig, setSortConfig] = React.useState(null);
    // Handle chart type change
    const handleChartTypeChange = (newType) => {
        setCurrentChartType(newType);
        onChartTypeChange === null || onChartTypeChange === void 0 ? void 0 : onChartTypeChange(newType);
    };
    // Handle zoom functions
    const handleZoomIn = () => {
        if (!zoom.enabled)
            return;
        setZoomLevel((prev) => Math.min(zoom.maxZoom || 3, prev + (zoom.factor || 0.2)));
    };
    const handleZoomOut = () => {
        if (!zoom.enabled)
            return;
        setZoomLevel((prev) => Math.max(zoom.minZoom || 0.5, prev - (zoom.factor || 0.2)));
    };
    const handleZoomReset = () => {
        if (!zoom.enabled)
            return;
        setZoomLevel(zoom.initialZoom || 1);
    };
    // Handle download
    const handleDownload = () => {
        const downloadData = prepareDownloadData(data, currentChartType, yAxisKeys, config);
        const csvContent = convertToCSV(downloadData);
        const filename = `${downloadFilename}-${currentChartType}.csv`;
        downloadFile(csvContent, filename, 'text/csv');
    };
    // Handle table sorting
    const handleSort = (key) => {
        if (!tableConfig.sortable)
            return;
        setSortConfig((current) => {
            if (current && current.key === key) {
                return current.direction === 'asc' ? { key, direction: 'desc' } : null;
            }
            return { key, direction: 'asc' };
        });
    };
    // Filter out any yAxisKeys that don't exist in the data
    const validYAxisKeys = React.useMemo(() => {
        if (!data.length)
            return yAxisKeys;
        return yAxisKeys.filter((key) => Object.keys(data[0]).includes(key));
    }, [data, yAxisKeys]);
    // Calculate chart dimensions with zoom
    const chartDimensions = React.useMemo(() => {
        const baseDimensions = calculateChartDimensions(data, currentChartType, autoSize, height, width);
        // Apply zoom to dimensions if zoom is enabled and not table view
        if (zoom.enabled && currentChartType !== 'table') {
            const zoomedHeight = typeof baseDimensions.height === 'number'
                ? baseDimensions.height * zoomLevel
                : baseDimensions.height;
            const zoomedWidth = baseDimensions.chartWidth * zoomLevel;
            return Object.assign(Object.assign({}, baseDimensions), { height: zoomedHeight, chartWidth: zoomedWidth });
        }
        return baseDimensions;
    }, [data, currentChartType, autoSize, height, width, zoom.enabled, zoomLevel]);
    // Prepare sorted data for table
    const sortedData = React.useMemo(() => {
        if (!sortConfig)
            return data;
        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }
            const aString = String(aValue);
            const bString = String(bValue);
            if (sortConfig.direction === 'asc') {
                return aString.localeCompare(bString);
            }
            else {
                return bString.localeCompare(aString);
            }
        });
    }, [data, sortConfig]);
    const handleClick = (data) => {
        if (data) {
            onDataPointClick === null || onDataPointClick === void 0 ? void 0 : onDataPointClick(data);
        }
    };
    const renderActiveShape = (props) => {
        // Type guard to ensure props has the expected structure
        const shapeProps = props;
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, percent, value, name, } = shapeProps;
        return (_jsxs("g", { children: [_jsx(Sector, { cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius + 10, startAngle: startAngle, endAngle: endAngle, fill: fill }), _jsx("text", { x: cx, y: cy, dy: -20, textAnchor: "middle", fill: fill, children: name }), _jsx("text", { x: cx, y: cy, textAnchor: "middle", fill: "#333", children: value }), _jsx("text", { x: cx, y: cy, dy: 20, textAnchor: "middle", fill: "#999", children: `(${(percent * 100).toFixed(2)}%)` })] }));
    };
    // Render table view
    const renderTable = () => {
        const { showRowNumbers = false, columnHeaders = {}, hiddenColumns = [], cellRenderer, } = tableConfig;
        if (!data.length)
            return _jsx("div", { className: "text-center py-8", children: "No data available" });
        const columns = Object.keys(data[0]).filter((key) => !hiddenColumns.includes(key));
        return (_jsx("div", { className: "border rounded-md overflow-auto w-full h-full", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [showRowNumbers && (_jsx(TableHead, { className: "w-full text-center", children: "#" })), columns.map((key) => (_jsx(TableHead, { className: tableConfig.sortable ? 'cursor-pointer hover:bg-muted' : '', onClick: () => handleSort(key), children: _jsxs("div", { children: [columnHeaders[key] || key, tableConfig.sortable && (sortConfig === null || sortConfig === void 0 ? void 0 : sortConfig.key) === key && (_jsx("span", { className: "ml-2", children: sortConfig.direction === 'asc' ? '↑' : '↓' }))] }) }, key)))] }) }), _jsx(TableBody, { children: sortedData.map((row, index) => (_jsxs(TableRow, { children: [showRowNumbers && (_jsx(TableCell, { className: "text-center text-muted-foreground", children: index + 1 })), columns.map((key) => (_jsx(TableCell, { children: cellRenderer ? cellRenderer(row[key], key, row) : row[key] }, key)))] }, index))) })] }) }));
    };
    // Render the appropriate chart based on chartType
    const renderChart = () => {
        var _a, _b;
        if (currentChartType === 'table') {
            return renderTable();
        }
        const commonProps = Object.assign({ data, width: chartDimensions.chartWidth, height: typeof chartDimensions.height === 'number'
                ? chartDimensions.height
                : 300 }, chartProps);
        switch (currentChartType) {
            case 'area':
                return (_jsxs(AreaChart, Object.assign({}, commonProps, { children: [showGrid && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: xAxisKey }), _jsx(YAxis, {}), showTooltip && (_jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, { formatter: tooltipFormatter, labelFormatter: tooltipLabelFormatter }) })), showLegend && (_jsx(ChartLegend, { content: _jsx(ChartLegendContent, { payload: undefined }), verticalAlign: legendPosition })), validYAxisKeys.map((key, index) => (_jsx(Area, Object.assign({ type: "monotone", dataKey: key, stackId: "1", stroke: getColorForKey(key, index, config), fill: getColorForKey(key, index, config), fillOpacity: 0.5 }, (chartProps[key] || {})), key)))] })));
            case 'line':
                return (_jsxs(LineChart, Object.assign({}, commonProps, { children: [showGrid && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: xAxisKey }), _jsx(YAxis, {}), showTooltip && (_jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, { formatter: tooltipFormatter, labelFormatter: tooltipLabelFormatter }) })), showLegend && (_jsx(ChartLegend, { content: _jsx(ChartLegendContent, { payload: undefined }), verticalAlign: legendPosition })), validYAxisKeys.map((key, index) => (_jsx(Line, Object.assign({ type: "monotone", dataKey: key, stroke: getColorForKey(key, index, config), strokeWidth: 2, dot: {
                                fill: getColorForKey(key, index, config),
                                strokeWidth: 1,
                                r: 2,
                            }, activeDot: { r: 4, strokeWidth: 1 } }, (chartProps[key] || {})), key)))] })));
            case 'bar':
                return (_jsxs(BarChart, Object.assign({}, commonProps, { children: [showGrid && _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: xAxisKey }), _jsx(YAxis, {}), showTooltip && (_jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, { formatter: tooltipFormatter, labelFormatter: tooltipLabelFormatter }) })), showLegend && (_jsx(ChartLegend, { content: _jsx(ChartLegendContent, { payload: undefined }), verticalAlign: legendPosition })), validYAxisKeys.map((key, index) => (_jsx(Bar, Object.assign({ dataKey: key, fill: getColorForKey(key, index, config), onClick: (e) => {
                                handleClick(e);
                            } }, (chartProps[key] || {})), index)))] })));
            case 'pie': {
                // For pie charts, we need to transform multi-series data
                const pieData = validYAxisKeys.length > 1
                    ? validYAxisKeys.map((key) => {
                        var _a;
                        // Calculate the sum of values for this key
                        const total = data.reduce((sum, item) => {
                            return (sum +
                                (typeof item[key] === 'number' ? item[key] : 0));
                        }, 0);
                        return {
                            name: ((_a = config[key]) === null || _a === void 0 ? void 0 : _a.label) || key,
                            value: total,
                            dataKey: key,
                        };
                    })
                    : data.map((item, index) => (Object.assign(Object.assign({}, item), { fill: pieColors[index % pieColors.length] })));
                return (_jsxs(PieChart, Object.assign({}, commonProps, { children: [_jsx(Pie, { data: pieData, nameKey: validYAxisKeys.length > 1 ? 'name' : xAxisKey, dataKey: validYAxisKeys.length > 1 ? 'value' : validYAxisKeys[0], cx: "50%", cy: "50%", outerRadius: typeof chartProps.outerRadius === 'number'
                                ? chartProps.outerRadius
                                : Math.min(120, (typeof chartDimensions.height === 'number'
                                    ? chartDimensions.height
                                    : 300) * 0.35), innerRadius: typeof chartProps.innerRadius === 'string' ||
                                typeof chartProps.innerRadius === 'number'
                                ? chartProps.innerRadius
                                : 0, paddingAngle: typeof chartProps.paddingAngle === 'number'
                                ? chartProps.paddingAngle
                                : 0, labelLine: chartProps.labelLine !== false, label: chartProps
                                ? (_a = chartProps.label) !== null && _a !== void 0 ? _a : ((entry) => entry.name)
                                : false, activeShape: highlightActive ? renderActiveShape : undefined, onClick: (data) => {
                                handleClick(data);
                            }, children: validYAxisKeys.length > 1
                                ? pieData.map((_, index) => (_jsx(Cell, { fill: pieColors[index % pieColors.length] }, `cell-${index}`)))
                                : data.map((entry, index) => (_jsx(Cell, { fill: typeof entry.fill === 'number'
                                        ? String(entry.fill)
                                        : entry.fill || pieColors[index % pieColors.length] }, `cell-${index}`))) }), showTooltip && (_jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, { formatter: tooltipFormatter, labelFormatter: tooltipLabelFormatter }) })), showLegend && (_jsx(ChartLegend, { content: _jsx(ChartLegendContent, { payload: undefined }), verticalAlign: legendPosition }))] })));
            }
            case 'donut': {
                // Donut chart - same as pie but with inner radius
                const pieData = validYAxisKeys.length > 1
                    ? validYAxisKeys.map((key) => {
                        var _a;
                        const total = data.reduce((sum, item) => {
                            return (sum +
                                (typeof item[key] === 'number' ? item[key] : 0));
                        }, 0);
                        return {
                            name: ((_a = config[key]) === null || _a === void 0 ? void 0 : _a.label) || key,
                            value: total,
                            dataKey: key,
                        };
                    })
                    : data.map((item, index) => (Object.assign(Object.assign({}, item), { fill: pieColors[index % pieColors.length] })));
                const outerRadius = typeof chartProps.outerRadius === 'number'
                    ? chartProps.outerRadius
                    : Math.min(120, (typeof chartDimensions.height === 'number'
                        ? chartDimensions.height
                        : 300) * 0.35);
                return (_jsxs(PieChart, Object.assign({}, commonProps, { children: [_jsx(Pie, { data: pieData, nameKey: validYAxisKeys.length > 1 ? 'name' : xAxisKey, dataKey: validYAxisKeys.length > 1 ? 'value' : validYAxisKeys[0], cx: "50%", cy: "50%", outerRadius: outerRadius, innerRadius: outerRadius * 0.6, paddingAngle: typeof chartProps.paddingAngle === 'number'
                                ? chartProps.paddingAngle
                                : 0, labelLine: chartProps.labelLine !== false, label: chartProps
                                ? (_b = chartProps.label) !== null && _b !== void 0 ? _b : ((entry) => entry.name)
                                : false, activeShape: highlightActive ? renderActiveShape : undefined, onClick: (data) => {
                                handleClick(data);
                            }, children: validYAxisKeys.length > 1
                                ? pieData.map((_, index) => (_jsx(Cell, { fill: pieColors[index % pieColors.length] }, `cell-${index}`)))
                                : data.map((entry, index) => (_jsx(Cell, { fill: typeof entry.fill === 'number'
                                        ? String(entry.fill)
                                        : entry.fill || pieColors[index % pieColors.length] }, `cell-${index}`))) }), showTooltip && (_jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, { formatter: tooltipFormatter, labelFormatter: tooltipLabelFormatter }) })), showLegend && (_jsx(ChartLegend, { content: _jsx(ChartLegendContent, { payload: undefined }), verticalAlign: legendPosition }))] })));
            }
            default:
                return _jsx("div", { children: "Unsupported chart type" });
        }
    };
    return (_jsxs(Card, { className: cn('gap-4', chartDimensions.cardClassName, className, classNames === null || classNames === void 0 ? void 0 : classNames.card), children: [(title ||
                description ||
                showTypeSelector ||
                (zoom.enabled && zoom.showControls)) && (_jsx(CardHeader, { className: cn('relative', classNames === null || classNames === void 0 ? void 0 : classNames.cardHeader), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [title && (_jsx(CardTitle, { className: classNames === null || classNames === void 0 ? void 0 : classNames.cardTitle, children: title })), description && (_jsx(CardDescription, { className: classNames === null || classNames === void 0 ? void 0 : classNames.cardDescription, children: description }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [zoom.enabled && zoom.showControls && (_jsxs("div", { className: "flex items-center gap-1 border rounded-md p-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: handleZoomOut, disabled: zoomLevel <= (zoom.minZoom || 0.5), className: "h-8 w-8 p-0", title: "Zoom Out", children: _jsx(ZoomOut, { className: "h-4 w-4" }) }), _jsxs("span", { className: "text-xs text-muted-foreground px-2 min-w-[3rem] text-center", children: [Math.round(zoomLevel * 100), "%"] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleZoomIn, disabled: zoomLevel >= (zoom.maxZoom || 3), className: "h-8 w-8 p-0", title: "Zoom In", children: _jsx(ZoomIn, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleZoomReset, className: "h-8 w-8 p-0", title: "Reset Zoom", children: _jsx(RotateCcw, { className: "h-4 w-4" }) })] })), showTypeSelector && (_jsx("div", { children: _jsxs(Select, { value: currentChartType, onValueChange: handleChartTypeChange, children: [_jsx(SelectTrigger, { className: "w-32", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "area", children: "Area" }), _jsx(SelectItem, { value: "line", children: "Line" }), _jsx(SelectItem, { value: "bar", children: "Bar" }), _jsx(SelectItem, { value: "pie", children: "Pie" }), _jsx(SelectItem, { value: "table", children: "Table" }), _jsx(SelectItem, { value: "donut", children: "Donut" })] })] }) })), showDownload && (_jsx(Button, { size: "icon", variant: "outline", onClick: handleDownload, className: "ml-1", title: "Download CSV", children: _jsx(Download, { className: "h-4 w-4" }) }))] })] }) })), _jsx(CardContent, { className: cn('p-1', classNames === null || classNames === void 0 ? void 0 : classNames.cardContent), children: _jsx("div", { style: {
                        height: chartDimensions.height,
                        width: '100%',
                        overflow: 'auto',
                    }, children: _jsx(ChartContainer, { id: `dynamic-chart-${chartId}`, config: config, className: cn('h-full', classNames === null || classNames === void 0 ? void 0 : classNames.chart), style: {
                            minWidth: (_a = chartDimensions.chartWidth) !== null && _a !== void 0 ? _a : '100%',
                            width: (_b = chartDimensions.chartWidth) !== null && _b !== void 0 ? _b : '100%',
                        }, children: renderChart() }) }) }), footer && (_jsx(CardFooter, { className: cn('flex justify-between text-xs text-muted-foreground', classNames === null || classNames === void 0 ? void 0 : classNames.cardFooter), children: footer }))] }));
}
