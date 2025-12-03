import { queryKeys } from "@/api/queryKey"
import { useApiGet, useApiPost } from "@/api/tanstackHooks"
import type { ChartConfiguration } from "./ChartBuilder"

export const postChartConfig = () => {
  return useApiPost<any>("http://localhost:3000/create", [queryKeys.charts.all])
}

export const execSp = (spName: string) => {
  return useApiGet<any>(
    [queryKeys.sp.all],
    `http://localhost:3000/exec/${spName}`
  )
}

export const editCustomChart = () => {
  return useApiPost<any>("http://localhost:3000/update", queryKeys.charts.all)
}

export const deleteChartConfig = () => {
  return useApiPost<any>("http://localhost:3000/delete", queryKeys.charts.all)
}

export const getAllCharts = () => {
  return useApiGet<ChartConfiguration[]>(
    queryKeys.charts.all,
    "http://localhost:3000/get"
  )
}

export const bulkUpdateCharts = () => {
  return useApiPost<any>(
    "http://localhost:3000/bulk-update",
    queryKeys.charts.all
  )
}

export const postCard = () => {
  return useApiPost<any>(
    "http://localhost:3000/cards/create",
    [queryKeys.cards.all]
  )
}

export const bulkUpdateCards = () => {
  return useApiPost<any>(
    "http://localhost:3000/cards/bulk-update",
    queryKeys.cards.all
  )
}

export const editCard = () => {
  return useApiPost<any>(
    "http://localhost:3000/cards/update",
    queryKeys.cards.all
  )
}

export const deleteCard = () => {
  return useApiPost<any>(
    "http://localhost:3000/cards/delete",
    queryKeys.cards.all
  )
}

export const getAllCards = () => {
  return useApiGet<any>(
    queryKeys.cards.all,
    "http://localhost:3000/cards/get"
  )
}
