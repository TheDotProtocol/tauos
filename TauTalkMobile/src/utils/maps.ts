/** OpenStreetMap links — no Google tracking. */
export function openStreetMapUrl(lat: number, lng: number, zoom = 17): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;
}

export function openStreetMapSearchUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/search?query=${lat}%2C${lng}`;
}
