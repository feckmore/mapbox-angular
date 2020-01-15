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
  geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          message: 'Foo',
          iconSize: [60, 60]
        },
        geometry: {
          type: 'Point',
          coordinates: [-90, 40]
        }
      },
      {
        type: 'Feature',
        properties: {
          message: 'Bar',
          iconSize: [50, 50]
        },
        geometry: {
          type: 'Point',
          coordinates: [-90, 40.5]
        }
      },
      {
        type: 'Feature',
        properties: {
          message: 'Baz',
          iconSize: [40, 40]
        },
        geometry: {
          type: 'Point',
          coordinates: [-90.5, 40]
        }
      }
    ]
  };

  // Mapbox GL Map object (Mapbox is ran outside angular zone, keep that in mind when binding events from this object)
  map: Map;
  locations: MapLocation[];
  @ViewChild('searchbox', { static: false }) searchBox: ElementRef;

  constructor(private locationService: LocationService) {}

  loaded(map: Map) {
    this.map = map;

    // this.addFromJson();
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

  addFromJson() {
    this.geojson.features.forEach(feature => {
      const marker = new Marker();
      marker.setLngLat([
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1]
      ]);
      const popup = new Popup({ offset: 25 }).setHTML(
        '<h3>' +
          feature.properties.message +
          '</h3><div>' +
          feature.properties.message +
          '</div>'
      );
      marker.setPopup(popup);
      marker.addTo(this.map);
    });
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
}
