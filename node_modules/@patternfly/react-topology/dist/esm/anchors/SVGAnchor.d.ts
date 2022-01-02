import Point from '../geom/Point';
import AbstractAnchor from './AbstractAnchor';
export default class SVGAnchor extends AbstractAnchor {
    private svgElement?;
    setSVGElement(svgElement: SVGElement): void;
    private getCircleLocation;
    private getEllipseLocation;
    private getRectLocation;
    private getPathLocation;
    private getPolygonLocation;
    getLocation(reference: Point): Point;
    getReferencePoint(): Point;
}
//# sourceMappingURL=SVGAnchor.d.ts.map