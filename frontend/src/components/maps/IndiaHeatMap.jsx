import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import fallbackHeatmapData from '@/services/data/heatmapData.json'
import api from '@/services/api'
import LoadingSpinner from '@/components/common/LoadingSpinner'

function MapController() {
  const map = useMap()
  useEffect(() => {
    map.setView([22.5937, 78.9629], 5)
  }, [map])
  return null
}

function getIntensityColor(intensity) {
  if (intensity >= 90) return '#EF4444'
  if (intensity >= 70) return '#F97316'
  if (intensity >= 50) return '#F59E0B'
  return '#2563EB'
}

export default function IndiaHeatMap({ height = '100%' }) {
  const [ready, setReady] = useState(false)
  const [points, setPoints] = useState(fallbackHeatmapData)

  useEffect(() => {
    setReady(true)
    api.getHeatmapData().then((data) => setPoints(data?.length ? data : fallbackHeatmapData))
  }, [])

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-muted/30 rounded-xl">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer center={[22.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController />
        {points.map((point) => (
          <CircleMarker
            key={point.city}
            center={[point.lat, point.lng]}
            radius={Math.max(point.intensity / 8, 8)}
            pathOptions={{
              color: getIntensityColor(point.intensity),
              fillColor: getIntensityColor(point.intensity),
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{point.city}</strong>
                <br />
                Reports: {point.reports}
                <br />
                Risk: {point.intensity}%
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
