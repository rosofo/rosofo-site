import _ from "lodash";
import React, { ComponentProps, ReactNode, useEffect, useState } from "react";
import { animated, useSprings } from "react-spring";
import useInterval from "react-useinterval";
import anchor from "./emojis/anchor.png";
import apple from "./emojis/apple.png";
import clothes from "./emojis/clothes.png";
import ice from "./emojis/ice-1.png";
import key from "./emojis/key.png";
import linkEmoji from "./emojis/link-1.png";
import loveLetterEmoji from "./emojis/love-letter.png";
import masks from "./emojis/masks.png";
import urn from "./emojis/urn.png";
import whale from "./emojis/whale.png";

const emojis = [
  linkEmoji,
  loveLetterEmoji,
  whale,
  urn,
  masks,
  key,
  clothes,
  apple,
  anchor,
  ice,
].map((item) => ({ path: item }));

export default (props: { active: boolean }) => {
  const emojiElements = useRandomFadeInEmojis(emojis, props.active);

  return <Shelves>{emojiElements}</Shelves>;
};

function Shelves(props: { children?: ReactNode }) {
  const itemGroups = _.chunk(React.Children.toArray(props.children), 5);

  return (
    <g transform="scale(30)">
      {itemGroups.map((group, index) => (
        <Shelf key={index} y={index}>
          {group}
        </Shelf>
      ))}
    </g>
  );
}

function Shelf(props: { y?: number; children?: ReactNode }) {
  return (
    <g transform={`translate(0, ${props.y})`}>
      {React.Children.map(props.children, (child, index) => (
        <g key={index} transform={`translate(${index}, 0)`}>
          {child}
        </g>
      ))}
    </g>
  );
}

type Emoji = { path: string };

function useRandomFadeInEmojis(emojis: Emoji[], active: boolean) {
  const springs = useRandomFadeInSprings(emojis.length, active);

  const emojiElements = _.zip(springs, emojis).map(
    ([styleProps, emoji]) =>
      emoji && (
        <AnimatedEmoji key={emoji.path} style={styleProps} emoji={emoji} />
      )
  );

  return emojiElements;
}

function AnimatedEmoji(
  props: { emoji: Emoji } & Omit<ComponentProps<typeof animated.image>, "href">
) {
  return (
    <animated.image
      height={0.5}
      width={0.5}
      {...props}
      href={props.emoji.path}
    />
  );
}

function useRandomFadeInSprings(n: number, active: boolean) {
  const [springs, setSprings] = useSprings(n, (_index) => ({
    from: { opacity: 0 },
  }));

  useRandomlyFadeInSpring(n, setSprings as any, active);

  return springs;
}

function useRandomlyFadeInSpring(
  numSprings: number,
  setSprings: (callback: (index: number) => { opacity: number }) => void,
  active: boolean
) {
  const [remainingIndices, setRemainingIndices] = useState(_.range(numSprings));

  useEffect(() => {
    const resetRemainingIndices = () =>
      setRemainingIndices(_.range(numSprings));

    if (!active) {
      setSprings((() => ({ opacity: 0 })) as any);
      resetRemainingIndices();
    }
  }, [active, setSprings, setRemainingIndices, numSprings]);

  useInterval(
    () => {
      const randomIndex =
        remainingIndices[_.random(remainingIndices.length - 1)];
      setSprings(((index: number) =>
        index === randomIndex ? { opacity: 1 } : {}) as any);
      setRemainingIndices((indices) =>
        _.reject(indices, (index) => index === randomIndex)
      );
    },
    active ? 2000 : null
  );
}
