import { useNavigate } from 'react-router-dom'
import { getSideBarItems } from './api'

export default function Landing() {
  const { data: sideBarItems } = getSideBarItems()
  const navigate = useNavigate()

  if (!sideBarItems) return <div>Loading...</div>

  console.log(sideBarItems)

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Sidebar Items</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Array.isArray(sideBarItems.data) && sideBarItems.data.length > 0 ? (
          sideBarItems?.data?.map((item: any) => (
            <li
              key={item.id}
              style={{ margin: '8px 0' }}>
              <button
                style={{ padding: '8px 16px', cursor: 'pointer' }}
                onClick={() => navigate(`/custom-chart/${item.appKey}`)}>
                {item.name  || `Item ${item.id}`}
              </button>
            </li>
          ))
        ) : (
          <li>No items found.</li>
        )}
      </ul>
    </div>
  )
}
