'use client';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

export default function MapaPrevisao() {
  const position: [number, number] = [-13.008094171967592, -38.513298896712385]; // Salvador, BA - CEEF
  const zoom = 17;

  return (
    <div style={{ height: "300px", width: "100%" }} className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer 
        center={position} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <strong>CEEF</strong><br />
              Local da previsão meteorológica<br />
              Salvador, BA
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

