import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Set our map properties
  @ViewChild('mapViewer') private mapViewElement;
  mapCenter = [-95.6290, 29.9849];
  basemapType = 'gray';
  mapZoomLevel = 14;
  pathPoints = [[]];
  pathData = [
    { id: 1, paths: [ [-10648789.3887225, 3509350.37862982], [-10644403.8142245, 3509465.03417226] ] }
    ,{ id: 2, paths: [ [ -10635270.2996, 3502395.5772], [-10633817.9961, 3500112.021] ] }
  ];

  onSelectMap(id) {
    this.pathPoints = this.pathData.find(p => p.id === id).paths;
    this.mapViewElement.render(this.pathPoints);
  }
}
