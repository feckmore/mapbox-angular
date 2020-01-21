import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Organization {
  organization: string;
  website: string;
  email: string;
  phone: string;
  classification: string;
  specialties: string[];
}

interface Contact {
  prefix: string;
  firstname: string;
  lastname: string;
  suffix: string;
  fullname: string;
}

interface Address {
  address1: string;
  address2: string;
  locality: string;
  region: string;
  postalcode: string;
  country: string;
  line1: string;
  line2: string;
}

interface Feature {
  type: 'Feature';
  geometry: Geometry;
  properties: Properties;
}

interface Geometry {
  type: 'Point';
  coordinates: [number, number];
}

interface Properties {
  [key: string]: string;
}

export interface MapLocation extends Organization, Contact, Address {
  id: string;
  coordinates: [number, number];
  distance: number;
  units: string;
  selected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getLocations(): Observable<MapLocation[]> {
    // return this.http.get<MapLocation[]>('/assets/locations.json');
    return this.http
      .get('/assets/locations.json')
      .pipe(map((data: any) => this.transformResponse(data)));
  }

  transformResponse(json: MapLocation[]): MapLocation[] {
    const locations = json;
    for (const l of locations) {
      l.fullname = [l.prefix, l.firstname, l.lastname, l.suffix]
        .join(' ')
        .trim();
      l.line1 = [l.address1, l.address2].join(' ').trim();
      l.line2 = [l.locality, l.region, l.postalcode].join(' ').trim();
      l.classification = l.classification.toUpperCase();
      l.units = l.units.toLowerCase();
    }

    return locations;
  }

  getFeatures(): Observable<GeoJSON.FeatureCollection<GeoJSON.Point>> {
    return this.http
      .get('/assets/locations.json')
      .pipe(map((data: any) => this.toGeoJson(data)));
  }

  toGeoJson(
    locations: MapLocation[]
  ): GeoJSON.FeatureCollection<GeoJSON.Point> {
    const features: Feature[] = new Array();
    for (const l of locations) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: l.coordinates
        },
        properties: {
          fullname: l.firstname,
          address1: l.address1
        }
      });
    }

    return { type: 'FeatureCollection', features };
  }
}
