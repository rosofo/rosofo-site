import { scaleLinear } from 'd3-scale'
import * as d3 from 'd3-shape'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { animated, config, useSpring, useTrail } from 'react-spring'
import useInterval from 'react-useinterval'

export default function useWavesAnimationComponent(props: { pullApart: boolean }) {
    const trail = useWavesAnimation(!props.pullApart)
    const yScale = useWavesPullApart(props.pullApart)

    return (
        <g>
            {trail.map(({ d }, index) => {
                const transform = yScale.to(y => `translate(0, ${y * (index - 3)})`)
                return (
                    <animated.path
                        transform={transform}
                        d={d}
                        key={index}
                        style={{ fill: 'none', stroke: '#E7EED9', strokeMiterlimit: 10, strokeWidth: 0.2 }}
                    />
                )
            })}
        </g>
    )
}

function useWavesAnimation(active: boolean) {
    const defaultConfig = { native: true, ...config.wobbly }
    const comingToRestConfig = { native: true, ...config.gentle }

    const [trail, setSpring] = useTrail<{ d: string }>(6, () => ({
        d: noWave,
        config: defaultConfig,
    }))

    useInterval(() => {
        if (active) {
            setSpring({ d: randomWave(), config: defaultConfig })
        } else {
            setSpring({ d: noWave, config: comingToRestConfig })
        }
    }, 200)


    return trail
}

function randomWave(): string {
    const yPoints = [0, 0].concat(randomPoints(12)).concat([0, 0])

    // usage of `as`: guaranteed to be that type after call to `reject`
    let data = waveFromYPoints(yPoints)
    data = scaleWave(data)

    // usage of `!`: guaranteed to be non-null
    return waveToPath(data)
}

function waveFromYPoints(yPoints: number[]): [number, number][] {
    return _.reject(_.zip(_.range(yPoints.length), yPoints), d => _.some(d, _.isUndefined)) as [number, number][]
}

function scaleWave(wave: [number, number][]): [number, number][] {
    const yScale = scaleLinear().domain([-1, 1]).range([-25, 25])
    const xScale = scaleLinear().domain([-10, 10]).range([-100, 100])
    return wave.map(([x, y]) => [xScale(x), yScale(y)])
}

function randomPoints(n: number): number[] {
    return new Array(n).fill(null).map(() => _.random(-1, 1))
}

function useWavesPullApart(active: boolean) {
    const [{ yScale }, setSpring] = useSpring(() => ({
        yScale: 1,
        config: config.stiff
    }))

    useEffect(() => {
        if (active) {
            setSpring({ yScale: -30 })
        } else {
            setSpring({ yScale: 3 })
        }
    }, [setSpring, active])

    return yScale
}

const noWave = waveToPath(scaleWave(waveFromYPoints(new Array(16).fill(0))))

function waveToPath(wave: [number, number][]): string {
    return d3.line().curve(d3.curveBasis)(wave)!
}