import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { loadModules } from 'esri-loader';
import { MapModel } from '../MapModel';
import esri = __esri;

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent {

  @ViewChild('mapView') private mapViewElement: ElementRef;
  
  constructor() { }

  async initializeMap(model: MapModel) {
      const [EsriMap, EsriMapView, Graphic, Polyline] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/geometry/Polyline'
      ]);

      const mapProperties: esri.MapProperties = {
        basemap: model.baseMap
      };

      const map: esri.Map = new EsriMap(mapProperties);

      const graphic = new Graphic();
      const polyline = new Polyline();
      polyline.paths = model.paths;
      polyline.spatialReference = { wkid: 102100 };

      graphic.geometry = polyline;
      graphic.attributes = model.attributes;
      graphic.symbol = {
        type: "simple-line",
        color: "red",
        width: 4,
        style: "solid"
      };

      graphic.popupTemplate = {
        title: "{projectName}",
        content: "Limits: {limits}"
      };

      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewElement.nativeElement,
        center: model.center,
        zoom: model.zoom,
        map: map
      };

      const mapView: esri.MapView = new EsriMapView(mapViewProperties);
      mapView.graphics.add(graphic);

      mapView.when(() => {
        mapView.goTo({ target: graphic, zoom: model.zoom });
      });
  }

  render(model: MapModel) {
    this.initializeMap(model);
  }
}
