import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}

interface Address {
  address1: string;
  address2: string;
  locality: string;
  region: string;
  postalcode: string;
  country: string;
}

export interface MapLocation extends Organization, Contact, Address {
  id: string;
  coordinates: [number, number];
  distance: number;
  units: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getLocations(): Observable<MapLocation[]> {
    return this.http.get<MapLocation[]>('/assets/locations.json');
  }
}
