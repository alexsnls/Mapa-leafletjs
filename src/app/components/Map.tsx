import React, { useState } from "react"
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet"
import { LatLngExpression } from 'leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import styles from './Map.module.css'

interface MapProps {
    position?: LatLngExpression
    zoom?: number
}

function ChangeMapView({ center }: { center: LatLngExpression }) {
    const map = useMap()
    map.setView(center)
    return null
}

export default function MyMap({ position = [-3.7327, -38.5270], zoom = 13 }: MapProps) {
    const [center, setCenter] = useState<LatLngExpression>(position)
    const [rua, setRua] = useState("")
    const [bairro, setBairro] = useState("")

    const handleSearch = async () => {
        const query = `${rua}, ${bairro}, Fortaleza, Brasil`
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        )
        const data = await response.json()
        if (data && data.length > 0) {
            setCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        } else {
            alert("Endereço não encontrado!")
        }
    }

    return (
        <div className={styles.wrapper}>
            <h1 style={{ color: "#e53935", marginBottom: 24, fontWeight: 700, fontSize: 32, textAlign: "center" }}>
                Mapa com Leaflet
            </h1>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={rua}
                    onChange={e => setRua(e.target.value)}
                    placeholder="Nome da rua"
                    className={styles.input}
                />
                <input
                    type="text"
                    value={bairro}
                    onChange={e => setBairro(e.target.value)}
                    placeholder="Bairro"
                    className={styles.input}
                />
                <button className={styles.button} onClick={handleSearch}>Pesquisar</button>
            </div>
            <div className={styles.mapWrapper}>
                <MapContainer
                    className={styles.map_container}
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={false}
                >
                    <ChangeMapView center={center} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={center}>
                        <Popup>
                            Local pesquisado.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    )
}

export function MapExample() {
    return (
        <>
            <MyMap position={[51.505, -0.09]} zoom={13} />

            
            <MyMap />
        </>
    )
}