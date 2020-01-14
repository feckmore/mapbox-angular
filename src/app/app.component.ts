import { Component } from '@angular/core';

import { Map, Marker, Popup } from 'mapbox-gl';
import { LocationService } from './location.service';

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

  constructor(private locationService: LocationService) {}

  loaded(map: Map) {
    this.map = map;

    // this.addFromJson();
    this.addFromService();
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
