import DynamicMaster from '@/components/master-table/master-table'
import ColumnConfigPage from '../custom-table/page'
import columnConfig from './column_config'
import datatableConfig from './table_config'
import { data } from './data'

const TableExample = () => {
  return (
    <>
      <DynamicMaster
        datatableConfig={{
          ...datatableConfig,
          columnsConfig: columnConfig,
        }}
        data={data}
      />
    </>
  )
}

export default TableExample
