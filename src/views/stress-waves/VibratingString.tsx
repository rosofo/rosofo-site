import { interpolateBasis } from "d3-interpolate";
import { curveCardinal, line } from "d3-shape";
import _ from "lodash";
import * as math from "mathjs";
import { sin } from "mathjs";
import React, { useEffect, useState } from "react";
import {
  animated,
  Interpolation,
  SpringValue,
  to,
  useSpring,
} from "react-spring";
import {
  bisectingAngle,
  interpolateCurve,
  Point,
  Points,
  vector,
  vectorFromTo,
} from "./lib/geometry";

export default function VibratingStrings(props: { moving?: boolean }) {
  const sPoints = [
    [0.2, -0.9],
    [-0.6, -0.7],
    [0.6, 0.6],
    [-0.2, 0.9],
  ] as Points;

  return (
    <g>
      {_.range(6).map((n) => (
        <g transform={`translate(${n / 10}, 0)`}>
          <VibratingString
            moving={props.moving}
            points={sPoints}
            density={80}
          />
        </g>
      ))}
    </g>
  );
}

function VibratingString(props: {
  moving?: boolean;
  points: Points;
  density: number;
}) {
  const offsets = useVibratingOffsets(props.density, Boolean(props.moving));

  return (
    <FluctuatedCurve controlPoints={props.points} offsets={offsets as any} />
  );
}

const FluctuatedCurve = animated(
  (props: { controlPoints: Points; offsets: number[] }) => {
    const offsetPoints = applyOffsets(props.offsets, props.controlPoints);
    return <path d={pathData(offsetPoints)} />;
  }
);

function useVibratingOffsets(n: number, active: boolean) {
  const centerOfMass = useMovingCenterOfMass(n, active);
  return useVibrationsAroundCenter(n, centerOfMass, active);
}

function useMovingCenterOfMass(n: number, active: boolean) {
  const [delay, randomiseDelay] = useRandomDelay();
  const [{ center }] = useSpring(
    () => ({
      from: { center: -10 },
    }),
    [randomiseDelay]
  ) as any;

  useEffect(() => {
    center.start(n - 1, {
      config: { mass: 20, tension: 50, clamp: true },
      loop: active,
      onRest: randomiseDelay,
      delay,
    });
  }, [active, delay, center, n, randomiseDelay]);

  return center;
}

function useRandomDelay() {
  const [delay, setDelay] = useState(0);
  const randomiseDelay = () => {
    setDelay(_.random(500));
  };
  return [delay, randomiseDelay] as [typeof delay, typeof randomiseDelay];
}

function useVibrationsAroundCenter(
  n: number,
  center: SpringValue<number>,
  active: boolean
): Interpolation<number[], number[]> {
  const waveOffsets = useWave(n, active);
  return to(
    [waveOffsets, center] as [typeof waveOffsets, typeof center],
    (waveOffsets, center) => applyAmplitudeCurve(center, waveOffsets)
  );
}

function useWave(n: number, active: boolean) {
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: 2 },
    loop: true,
    pause: !active,
    config: { duration: 3000 },
  });

  return x.to((x) => _.range(0, n).map((y) => sin((x + y) * 4) / 16));
}

function applyAmplitudeCurve(center: number, offsets: number[]) {
  const curve = amplitudeCurve(center, offsets.length);
  const curveValue = (index: number) => {
    return curve((index - center) / 10);
  };
  return offsets.map((offset, index) => offset * curveValue(index));
}

function amplitudeCurve(_center: number, _size: number) {
  return interpolateBasis([0, 1, 0]);
}

function applyOffsets(offsets: number[], points: Points) {
  const controlPoints = interpolateCurve(points, offsets.length);

  const crossAxisAngles = controlPoints.map((_point: Point, index: number) => {
    return crossAxisAngle(index, controlPoints);
  });
  console.log(crossAxisAngles);

  const applyOffset = (point: Point, offset: number, offsetAngle: number) => {
    const offsetVector = vector(offsetAngle, offset);
    return math.add(offsetVector, point) as Point;
  };

  return _.zipWith(controlPoints, offsets, crossAxisAngles, applyOffset);
}

function neighborhood<T>(index: number, array: T[]): [T, T, T] {
  const [x, y, z] = [array[index - 1], array[index], array[index + 1]];

  return [x, y, z];
}

export const crossAxisAngle = (index: number, points: Points) => {
  let [before, point, after] = neighborhood(index, points);
  if (!before) before = math.subtract(point, after) as Point;
  if (!after) after = math.subtract(point, before) as Point;

  const [toBeforeV, toAfterV] = angleVectors(before, point, after);
  return bisectingAngle(toBeforeV, toAfterV);
};

function angleVectors(
  before: Point,
  point: Point,
  after: Point
): [Point, Point] {
  return [vectorFromTo(point, before), vectorFromTo(point, after)];
}

function pathData(points: [number, number][]): string | undefined {
  return line().curve(curveCardinal)(points) || undefined;
}
