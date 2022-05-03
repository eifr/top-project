import { GoogleMap, Marker } from "@react-google-maps/api";
import { Wrapper } from "@googlemaps/react-wrapper";
import "./map.css";
import { Coords } from "../../types";

export type GoogleMapProps = {
  markers: (Coords & { id: string })[];
};
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

// using google-react-map to display markers on a map
export const MarkersMap: React.FC<GoogleMapProps> = ({ markers }) => {
  const averageCoords = markers.reduce(
    (acc, { lat, lng }) => ({
      lat: (acc.lat * markers.length + lat) / (markers.length + 1),
      lng: (acc.lng * markers.length + lng) / (markers.length + 1),
    }),
    { lat: 0, lng: 0 }
  );

  return (
    <div className="map-container">
      <Wrapper apiKey="">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={averageCoords}
          zoom={1}
        >
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker} />
          ))}
        </GoogleMap>
      </Wrapper>
    </div>
  );
};
