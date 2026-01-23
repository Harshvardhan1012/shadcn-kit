import { useParams } from 'react-router-dom'
import Page from './page'

export default function CustomChartAppKeyPage() {
  const { appKey } = useParams()
  // Pass appKey as id prop to Page, or let Page use useParams internally
  return <Page id={appKey} />
}
