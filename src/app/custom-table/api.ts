import { queryKeys } from "@/api/queryKey"
import { useApiGet } from "@/api/tanstackHooks"

export const callApi = (url: string, api: boolean) => {
  return useApiGet<any>(
    queryKeys.custom_table.all,
    url,
    {},
    {
      enabled: !!url && !!api
    }
  )
}
