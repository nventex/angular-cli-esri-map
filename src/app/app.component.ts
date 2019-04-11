import { Component, ViewChild, ElementRef } from '@angular/core';
import { MapModel } from './MapModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Set our map properties
  @ViewChild('mapViewer') private mapViewElement;
  private mapModel: MapModel = new MapModel('gray', [-95.6290, 29.9849], 14);
  pathData = [
    { id: 1, paths: [ [-10648789.3887225, 3509350.37862982], [-10644403.8142245, 3509465.03417226] ] }
    ,{ id: 2, paths: [ [ -10635270.2996, 3502395.5772], [-10633817.9961, 3500112.021] ] }
  ];

  onSelectMap(id) {
    this.mapModel.projectName = 'Gessner Rd 1';
    this.mapModel.limits = 'Gessner to Fallbrook';
    this.mapModel.paths = this.pathData.find(p => p.id === id).paths;
    this.mapViewElement.render(this.mapModel);
  }

  onEditCompleted(e) {
    console.log(e);
  }
}
