import { getValidFilters } from "@/components/lib/data-table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { useDataTable } from "@/hooks/use-data-table";
import { getFiltersStateParser } from "@/lib/parsers";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Expand, Shrink } from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";
import { useMemo } from "react";
import { applyFilter, getFilterFields } from "../../lib/filter";
import { DataTable } from "./../data-table";
import { DataTableAdvancedToolbar } from "./../data-table-advanced-toolbar";
import { DataTableFilterList } from "./../data-table-filter-list";
import { DataTableSortList } from "./../data-table-sort-list";
import { DataTableViewOptions } from "./../data-table-view-options";
import { useFeatureFlags } from "./feature-flags-provider";
import { TableActionBar } from "./table-action-bar";

type TableProps = {
  data: any[];
  columns: any[];
  pageCount?: number;
  actionConfig?: any;
  addItem?: any;
};

export const Table = React.forwardRef(({ data, columns, pageCount = -1, actionConfig, addItem }: TableProps, ref) => {
  const { enableAdvancedFilter } = useFeatureFlags();
  const [fullscreen, setFullscreen] = React.useState(false);

  const addvanceTableFilterRef = React.useRef<any>(null);

  const onExpandChange = () => {
    setFullscreen((value) => !value);
  }

  const handleSheet = (value) => {
    addvanceTableFilterRef?.current?.onSheetClose(value)
  }

  React.useImperativeHandle(ref, () => ({
    handleSheet
  }))

  const filterColumns = getFilterFields(columns);
  const [filters] = useQueryState(
    "filters",
    getFiltersStateParser(filterColumns).withDefault([])
  );

  const [joinOperator] = useQueryState(
    "joinOperator", {
    defaultValue: 'and',
  });

  const filteredData = useMemo(() => {
    const validFilters = getValidFilters(Array.isArray(filters) ? filters : []);
    if (validFilters.length === 0) return data;

    return data.filter((row) => {
      if (joinOperator === "or") {
        return validFilters.some((filter) => applyFilter(row, filter));
      } else {
        return validFilters.every((filter) => applyFilter(row, filter));
      }
    });
  }, [filters, data, joinOperator]);


  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: (value) => parseInt(value) || 1,
    serialize: (value) => value.toString(),
  });

  const [perPage, setPerPage] = useQueryState("perPage", {
    defaultValue: 10,
    parse: (value) => parseInt(value) || 10,
    serialize: (value) => value.toString(),
  });

  const pageIndex = page - 1;
  const pageSize = perPage;

  const pageCountCalc = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pageIndex, pageSize]);

  const { table } = useDataTable({
    data: paginatedData,
    columns,
    pageCount: pageCountCalc,
    enableAdvancedFilter,
    initialState: {
      sorting: [],
      columnPinning: { right: ["actions"] },
      pagination: { pageIndex, pageSize },
    },
    getRowId: (row) => row.id,
    shallow: true,
    clearOnDefault: true,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({ pageIndex, pageSize });
        setPage(newPagination.pageIndex + 1);
        setPerPage(newPagination.pageSize);
      } else {
        setPage(updater.pageIndex + 1);
        setPerPage(updater.pageSize);
      }
    },
  });

  return (
    <>
      {fullscreen ? (
        <div className="fixed inset-0 z-50 bg-background p-4 flex flex-col h-screen">
          <div className="flex-shrink-0">
            <DataTableAdvancedToolbar table={table} addItem={addItem} filteredData={filteredData} ref={addvanceTableFilterRef}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={onExpandChange}
                  >
                    <Shrink />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Collapse</p>
                </TooltipContent>
              </Tooltip>
              <DataTableFilterList table={table} />
              <DataTableSortList table={table} align="start" />
              <DataTableViewOptions table={table} />
            </DataTableAdvancedToolbar>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <DataTable
              table={table}
              filteredData={filteredData}
              actionBar={<TableActionBar table={table} config={actionConfig} />}
            />
          </div>
        </div>
      ) : (
        <DataTable
          table={table}
          filteredData={filteredData}
          actionBar={<TableActionBar table={table} config={actionConfig} />}
        >
          <DataTableAdvancedToolbar table={table} addItem={addItem} filteredData={filteredData} ref={addvanceTableFilterRef}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={onExpandChange}
                >
                  <Expand />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Expand</p>
              </TooltipContent>
            </Tooltip>
            <DataTableFilterList table={table} />
            <DataTableSortList table={table} align="start" />
            <DataTableViewOptions table={table} />
          </DataTableAdvancedToolbar>
        </DataTable>
      )}
    </>
  );
});