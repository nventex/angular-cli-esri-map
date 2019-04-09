import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent {

  private zoomLevel: number = 10;
  private centerPoint: Array<number> = [-95.6290, 29.9849];
  private baseMapName: string = 'gray';
  private pathPoints: Array<Array<number>> = [[]];

  @ViewChild('mapView') private mapViewElement: ElementRef;

  @Input()
  set basemap(basemap: string) {
    this.baseMapName = basemap;
  }

  @Input()
  set center(center: Array<number>) {
    this.centerPoint = center;
  }

  @Input()
  set zoom(zoom: number) {
    this.zoomLevel = zoom;
  }

  @Input()
  set paths(paths: Array<Array<number>>) {
    this.pathPoints = paths;
  }

  constructor() { }

  async initializeMap(paths: Array<Array<number>>) {
      const [EsriMap, EsriMapView, Graphic, Polyline] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/geometry/Polyline'
      ]);

      // Set type of map
      const mapProperties: esri.MapProperties = {
        basemap: this.baseMapName
      };

      const map: esri.Map = new EsriMap(mapProperties);

      let graphic = new Graphic();
      let polyline = new Polyline();
      polyline.paths = paths;
      polyline.spatialReference = { wkid: 102100 };

      graphic.geometry = polyline;
      graphic.attributes = { phase: 'Design', limits: 'Gessner1', projectName: 'Gessner Road 1' };
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
        center: this.centerPoint,
        zoom: this.zoomLevel,
        map: map
      };

      const mapView: esri.MapView = new EsriMapView(mapViewProperties);
      mapView.graphics.add(graphic);

      mapView.when(() => {
        mapView.goTo({ target: graphic, zoom: this.zoomLevel });
      });
  }

  render(paths: Array<Array<number>>) {
    this.initializeMap(paths);
  }
}
