import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';

const mapboxAccessToken = environment.mapboxAccessToken;

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: mapboxAccessToken, // Optionnal, can also be set per map (accessToken input of mgl-map)
      geocoderAccessToken: mapboxAccessToken // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
