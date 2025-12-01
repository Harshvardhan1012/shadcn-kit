import { queryKeys } from "@/api/queryKey"
import { useApiPost } from "@/api/tanstackHooks"

export const postChartConfig = () => {
  return useApiPost<any>('/post', [queryKeys.custom_table.all])
}
