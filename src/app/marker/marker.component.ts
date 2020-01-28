import { Component, OnInit, Input } from '@angular/core';
import { MapLocation } from '../location.service';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.scss']
})
export class MarkerComponent implements OnInit {
  @Input() location: MapLocation;
  constructor() {}

  ngOnInit() {}

  // DOES NOT WORK... no click event fired/captured from within component
  markerClickChild(location: MapLocation) {
    console.log('marker clicked from child');
  }
}
