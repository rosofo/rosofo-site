import { curveCardinal, line } from 'd3-shape'
import produce from 'immer'
import _, { uniqueId } from 'lodash'
import React, { useState } from 'react'
import { animated, useSprings } from 'react-spring'

export function RandomFlowers(props: { blooms?: number, active?: boolean }) {
    const flowers = useGardener(Boolean(props.active), props.blooms || 5)

    return (
        <g>
            {flowers}
        </g>
    )
}

function useGardener(active: boolean, blooms: number) {
    const items = useFlowers(active, blooms)

    return items.map((props, i) => <Flower key={i} {...props} />)
}

function useFlowers(active: boolean, amount: number) {
    const maxOpacity = 0.8
    const [randomPropsItems, randomiseAt] = useRandomProps(amount)
    const [items] = useSprings(amount, index => ({
        from: { opacity: 0, growth: 0 },
        to: async animate => {
            if (!active) {
                await animate({ to: { opacity: maxOpacity, growth: 1 } })
            }
            while (active) {
                await animate({
                    to: { opacity: 0, growth: 0 },
                })
                randomiseAt(index)
                await animate({
                    to: { opacity: maxOpacity, growth: 1 },
                    delay: _.random(0, 50),
                    config: { tension: _.random(50, 100) },
                })
            }
        },
    }), [active])

    return _.zipWith(items, randomPropsItems, (propsA, propsB) => ({ ...propsA, ...propsB }))
}

function useRandomProps(amount: number) {
    const [items, setItems] = useState(_.range(amount).map(randomProps))

    const randomiseAt = (index: number) => {
        setItems(produce(items => {
            items[index] = randomProps()
            return items
        }))
    }
    return [items, randomiseAt] as [typeof items, typeof randomiseAt]
}

const Flower = animated((props: {
    color: string,
    position: [number, number],
    size: number,
    opacity: number,
    growth: number
}) => {
    const gradientIdA = uniqueId()
    const gradientIdB = uniqueId()

    return (
        <g>
            <defs>
                <radialGradient id={gradientIdA}>
                    <stop offset={`${props.growth * 30}%`} stopColor={props.color} />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id={gradientIdB}>
                    <stop offset={`${props.growth * 30}%`} stopColor='purple' />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>
            <g
                transform={`translate(${props.position[0]}, ${props.position[1]}) scale(${props.size * 2})`}
                opacity={props.opacity}
                strokeWidth={0.01}
            >
                {_.range(0, 360, 45).map(rotation => (
                    <Petal
                        rotation={rotation + props.growth * 10}
                        length={1 / Math.log(props.growth / 2)}
                        color={`url(#${gradientIdA})`}
                    />
                ))}
                {_.range(22, 382, 45).map(rotation => (
                    <Petal
                        rotation={rotation + props.growth * 10}
                        length={1 / Math.log(props.growth / 2)}
                        color={`url(#${gradientIdB})`}
                    />
                ))}
            </g>
        </g>
    )
})

function Petal(props: { rotation?: number, length: number, color: string }) {
    const closedCurve = line().curve(curveCardinal.tension(0.0))

    return (
        <path
            d={closedCurve([[0.0, 0.0], [0.5 * props.length, 0.25 * props.length], [1 * props.length, 0 * props.length]]) as string}
            transform={`skewX(20) rotate(${props.rotation})`}
            fill={props.color}
        />
    )
}

function randomProps() {
    const colors = ['#FCC7E0', '#FC93C1', '#FD85C2', '#FC338B', '#FC6AAA']
    return {
        color: colors[_.random(0, colors.length - 1)],
        size: _.random(0.2, 0.5, true),
        position: [_.random(-1.0, 1.0, true), _.random(-1.0, 1.0, true)] as [number, number]
    }
}