import {
  cardEndpoints,
  chartEndpoints,
  filterEndpoints,
  spEndpoints,
} from "@/api/apiEndPoint"
import { queryKeys } from "@/api/queryKey"
import { useApiGet, useApiPost } from "@/api/tanstackHooks"
import type { ChartConfiguration } from "./ChartBuilder"
import type { FilterConfig } from "./FilterConfigSheet"

// Chart APIs
export const postChartConfig = () => {
  return useApiPost<any>(chartEndpoints.create, queryKeys.charts.all)
}

export const editCustomChart = () => {
  return useApiPost<any>(chartEndpoints.update, queryKeys.charts.all)
}

export const deleteChartConfig = () => {
  return useApiPost<any>(chartEndpoints.delete, queryKeys.charts.all)
}

export const getAllCharts = (params: Object) => {
  const encoded = encodeURIComponent(JSON.stringify(params))
  return useApiGet<ChartConfiguration[]>(
    [queryKeys.charts.all, encoded],
    `${chartEndpoints.get}?params=${encoded}`,
    {},
    {
      placeholderData: (previousData) => previousData,
    }
  )
}

export const bulkUpdateCharts = () => {
  return useApiPost<any>(chartEndpoints.bulkUpdate, queryKeys.charts.all)
}

// Card APIs
export const postCard = () => {
  return useApiPost<any>(cardEndpoints.create, [queryKeys.cards.all])
}

export const bulkUpdateCards = () => {
  return useApiPost<any>(cardEndpoints.bulkUpdate, queryKeys.cards.all)
}

export const editCard = () => {
  return useApiPost<any>(cardEndpoints.update, queryKeys.cards.all)
}

export const deleteCard = () => {
  return useApiPost<any>(cardEndpoints.delete, queryKeys.cards.all)
}

export const getAllCards = () => {
  return useApiGet<any>(queryKeys.cards.all, cardEndpoints.get)
}

// Stored Procedure APIs
export const execSp = (spName: string) => {
  return useApiGet<any>([queryKeys.sp.all], spEndpoints.exec(spName))
}

// Filter APIs
export const createFilter = () => {
  return useApiPost<FilterConfig>(filterEndpoints.create, [
    queryKeys.filters.all,
  ])
}

export const updateFilter = () => {
  return useApiPost<FilterConfig>(filterEndpoints.update, queryKeys.filters.all)
}

export const deleteFilter = () => {
  return useApiPost<any>(filterEndpoints.delete, queryKeys.filters.all)
}

export const getAllFilters = () => {
  return useApiGet<FilterConfig[]>(queryKeys.filters.all, filterEndpoints.get)
}

export const bulkUpdateFilters = () => {
  return useApiPost<any>(filterEndpoints.bulkUpdate, queryKeys.filters.all)
}
