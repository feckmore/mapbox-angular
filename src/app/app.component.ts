import { Component, ViewChild, ElementRef } from '@angular/core';

import { Map, Marker, Popup } from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { environment } from 'src/environments/environment';
import { LocationService, MapLocation } from './location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Mapbox GL Map object (Mapbox is ran outside angular zone, keep that in mind when binding events from this object)
  map: Map;
  locations: MapLocation[];
  selectedLocationId: string;
  selectedLocation: MapLocation;
  center: [number, number] = [-73.995813, 40.730105];

  @ViewChild('searchbox', { static: false }) searchBox: ElementRef;

  constructor(private locationService: LocationService) {}

  loaded(map: Map) {
    this.map = map;

    this.addFromService();
    this.addGeocoder(map);
  }

  addGeocoder(map: Map) {
    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapboxAccessToken,
      position: 'top-left'
    });
    this.searchBox.nativeElement.appendChild(geocoder.onAdd(map));
  }

  addFromService() {
    const result = this.locationService.getLocations();
    result.forEach(locations => {
      console.log('adding locations');
      this.locations = locations;
      // locations.forEach(location => {
      //   const marker = new Marker();
      //   marker.setLngLat([location.coordinates[0], location.coordinates[1]]);
      //   marker.addTo(this.map);
      // });
    });
  }

  cardClick(location: MapLocation) {
    console.log('card click - ' + location.id);
    this.selectLocation(location);
  }

  markerClick(location: MapLocation) {
    console.log('marker click - ' + location.id);
    this.selectLocation(location);
  }

  mapClick(event) {
    if (event.lngLat) {
      console.log(event.lngLat);
    }
    console.log('map click');
    console.log(event);
  }

  selectLocation(location: MapLocation) {
    console.log(location);
    if (this.selectedLocationId !== location.id) {
      // setting the selected location affects card styling, popup
      this.selectedLocationId = location.id;
      this.selectedLocation = location;
      this.moveToLocation(location.coordinates, 13);
    }
  }

  unselectLocation() {
    this.selectedLocationId = null;
    this.selectedLocation = null;
  }

  moveToLocation(coordinates: [number, number], zoomLevel: number) {
    this.map.panTo(coordinates);
    // this.map.flyTo({
    //   center: coordinates,
    //   zoom: zoomLevel
    // });
  }
}
