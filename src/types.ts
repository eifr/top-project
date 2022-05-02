export type MeteorData = {
  name: string;
  id: string;
  nametype: string;
  recclass: string;
  mass: number;
  fall: string;
  year: number;
  reclat: number;
  reclong: number;
  geolocation: {
    type: string;
    coordinates: number[];
  };
};

export interface Coords {
  lat: number;
  lng: number;
}
