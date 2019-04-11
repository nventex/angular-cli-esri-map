import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import { MapModel } from '../MapModel';
import esri = __esri;

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent {
  @Output() editCompleted = new EventEmitter<number[][]>();
  @ViewChild('mapView') private mapViewElement: ElementRef;
  
  private defaultSymbol = {
    type: "simple-line",
    color: "red",
    width: 4,
    style: "solid"
  };

  constructor() { }

  async initializeMap(model: MapModel) {
      const [EsriMap, EsriMapView, Graphic, Polyline, GraphicsLayer, Sketch] = await loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/geometry/Polyline',
        'esri/layers/GraphicsLayer',
        'esri/widgets/Sketch',
      ]);

      const layer = new GraphicsLayer();

      const mapProperties: esri.MapProperties = {
        basemap: model.baseMap,
        layers: [layer]
      };

      const map: esri.Map = new EsriMap(mapProperties);

      const graphic = new Graphic();
      const polyline = new Polyline();
      polyline.paths = model.paths;
      polyline.spatialReference = { wkid: 102100 };

      graphic.geometry = polyline;
      graphic.attributes = model.attributes;
      graphic.symbol = this.defaultSymbol;

      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewElement.nativeElement,
        center: model.center,
        zoom: model.zoom,
        map: map
      };

      const mapView: esri.MapView = new EsriMapView(mapViewProperties);

      const sketch = new Sketch({
        layer: layer,
        view: mapView
      });

      // layer.graphics.add(graphic);

      mapView.ui.add(sketch, 'top-right');

      sketch.on('create', e => {
        if (e.state === 'complete') {
          let valid = true;
          
          if (e.tool !== 'polyline') {
            console.log('Only polyline graphics are supported at this time.');
            valid = false;
            layer.remove(e.graphic);
          }

          if (layer.graphics.length > 1) {
            console.log('Multiple graphics are not supported at this time.');
            valid = false;
            layer.remove(e.graphic);
          }
          
          if (valid) {
            e.graphic.symbol = this.defaultSymbol;
            this.onEditComplete(e.graphic.geometry.paths);
          }
        }
      });

      sketch.on('update', e => {
        if (e.state === 'complete') {
          this.onEditComplete(e.graphics[0].geometry.paths);
        }
      });

      sketch.on('delete', e => {
        this.onEditComplete(null);
      });            

      mapView.when(() => {
        mapView.goTo({ target: graphic, zoom: model.zoom });
      });
  }

  private onEditComplete(paths: number[][]) {
    this.editCompleted.emit(paths);
  }

  render(model: MapModel) {
    this.initializeMap(model);
  }
}
