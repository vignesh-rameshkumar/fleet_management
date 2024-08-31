import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const vehicleIcon = new L.Icon({
  iconUrl: "/vehicle-icon.png",
  iconSize: [35, 35],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function LocateControl({ position }: { position: [number, number] }) {
  const map = useMap();

  const handleLocate = useCallback(() => {
    map.setView(position, 15);
  }, [map, position]);

  useMapEvents({
    load: () => {
      handleLocate();
    },
  });

  return (
    <button
      onClick={handleLocate}
      className="absolute bottom-20 right-1/4 transform translate-x-1/2 z-[1000] bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      title="Center on vehicle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>
  );
}

const getVehicleStatus = (speed: string): { status: string; color: string } => {
  const speedNum = parseInt(speed);
  if (speedNum > 0) return { status: "Running", color: "text-green-500" };
  if (speedNum === 0) return { status: "Idle", color: "text-yellow-500" };
  return { status: "Parked", color: "text-red-500" };
};

const VehicleTracking: React.FC = () => {
  const { vehicleNumber } = useParams<{ vehicleNumber: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const loadVehicleData = async () => {
      try {
        const response = await fetchVehicleData();
        const foundVehicle = response.data.find(
          (v) => v.vehicle_number === vehicleNumber
        );
        setVehicle(foundVehicle || null);
      } catch (error) {
        console.error("Failed to load vehicle data:", error);
      }
    };

    loadVehicleData();
    const interval = setInterval(loadVehicleData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [vehicleNumber]);

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const position: [number, number] = [
    parseFloat(vehicle.lat_message),
    parseFloat(vehicle.lon_message),
  ];
  const { status, color } = getVehicleStatus(vehicle.speed);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Vehicle Tracking</h1>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm"
        >
          Back to List
        </Link>
      </div>
      <div className="flex-grow relative">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          whenReady={() => setMapReady(true)}
          zoomControl={false} // Disable default zoom control
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={vehicleIcon}>
            <Popup>
              <div>
                <h2 className="font-bold">{vehicle.vehicle_number}</h2>
                <p>Model: {vehicle.model_name}</p>
                <p>Speed: {vehicle.speed} km/h</p>
                <p>
                  Last Updated:{" "}
                  {new Date(vehicle.gps_datetime).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
          <LocateControl position={position} />
          {/* Custom zoom control */}
          <div className="leaflet-top leaflet-left">
            <div className="leaflet-control-zoom leaflet-bar leaflet-control">
              <a
                className="leaflet-control-zoom-in"
                href="#"
                title="Zoom in"
                role="button"
                aria-label="Zoom in"
              >
                +
              </a>
              <a
                className="leaflet-control-zoom-out"
                href="#"
                title="Zoom out"
                role="button"
                aria-label="Zoom out"
              >
                −
              </a>
            </div>
          </div>
        </MapContainer>
        {mapReady && (
          <div className="absolute top-0 right-0 bg-white shadow-lg z-[1000] floating-card">
            <div className="p-4">
              <h2 className="font-bold mb-2">{vehicle.vehicle_number}</h2>
              <p className="mb-1">Model: {vehicle.model_name}</p>
              <p className="mb-1">Speed: {vehicle.speed} km/h</p>
              <p className={`font-semibold ${color} mb-1`}>Status: {status}</p>
              <p className="text-gray-600">
                Last Updated: {new Date(vehicle.gps_datetime).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleTracking;
