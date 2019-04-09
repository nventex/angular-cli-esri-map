export class MapModel {
  baseMap: string = 'gray';
  center: Array<number> = [-95.6290, 29.9849];
  zoom: number = 14;
  paths: Array<Array<number>> = [[]];
  projectName: string;
  limits: string;

  constructor(baseMap: string, center: Array<number>, zoom: number) {
    this.baseMap = baseMap;
    this.center = center;
    this.zoom = zoom;
  }

  get attributes(): any {
    return { projectName: this.projectName, limits: this.limits };
  }
}