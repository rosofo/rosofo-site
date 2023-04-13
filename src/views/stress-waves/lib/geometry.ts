import { interpolateBasis, quantize } from 'd3-interpolate';
import _ from 'lodash';
import * as math from 'mathjs';
import { tau } from 'mathjs';

export type Point = [number, number];
export type Points = Point[];

export function interpolateCurve(controlPoints: Points, quantizeAmount: number): Points {
	const [ xs, ys ] = _.unzip(controlPoints);
	const curvedXs = quantize(interpolateBasis(xs), quantizeAmount);
	const curvedYs = quantize(interpolateBasis(ys), quantizeAmount);
	return _.zip(curvedXs, curvedYs) as Points;
}

export function vector(angle: number, magnitude: number): Point {
	return [ math.cos(angle) * magnitude, math.sin(angle) * magnitude ];
}

export const angleAt = (index: number, controlPoints: Points) => {
	let [ before, point, after ] = [ controlPoints[index - 1], controlPoints[index], controlPoints[index + 1] ];

	if (!before) before = math.subtract([ 0, 0 ], after) as Point;
	if (!after) after = math.subtract([ 0, 0 ], before) as Point;

	return angle(before, point, after);
};

export function angle(before: Point, point: Point, after: Point) {
	const pointToBeforeVector = vectorFromTo(point, before);
	const pointToAfterVector = vectorFromTo(point, after);

	return angleBetweenVectors(pointToBeforeVector, pointToAfterVector);
}

export function vectorFromTo(pointA: Point, pointB: Point): [number, number] {
	return math.subtract(pointB, pointA) as [number, number];
}

export function angleBetweenVectors(v1: [number, number], v2: [number, number]) {
	const angle1 = angleFromX(v1);
	const angle2 = angleFromX(v2);
	const greater = angle1 > angle2 ? angle1 : angle2;
	const lesser = angle1 > angle2 ? angle2 : angle1;

	return math.subtract(greater, lesser) as number;
}

export function angleFromX(v: [number, number]): number {
	const atanAngle = math.atan2(v[1], v[0]);
	return atanAngle >= 0 ? atanAngle : tau - atanAngle;
}

export function bisectingAngle(v1: Point, v2: Point) {
	const angle1 = angleFromX(v1);
	const angle2 = angleFromX(v2);
	const greater = angle1 > angle2 ? angle1 : angle2;
	const lesser = angle1 > angle2 ? angle2 : angle1;

	const angleBetween = math.subtract(greater, lesser) as number;
	return lesser + angleBetween / 2;
}
