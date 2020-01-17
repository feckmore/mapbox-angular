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
  @ViewChild('searchbox', { static: false }) searchBox: ElementRef;
  selectedLocationId: string;

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
      this.locations = locations;
      locations.forEach(location => {
        const marker = new Marker();
        marker.setLngLat([location.coordinates[0], location.coordinates[1]]);
        const popup = new Popup({ offset: 25 }).setHTML(
          '<h3>' +
            location.organization +
            '</h3><div>' +
            location.address1 +
            '</div>'
        );
        marker.setPopup(popup);
        marker.addTo(this.map);
      });
    });
  }

  cardSelected(location: MapLocation) {
    console.log(location);
    this.selectedLocationId = location.id;
  }
}
