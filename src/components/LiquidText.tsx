import { type FC, useEffect, useRef } from 'react';
import { SpringTween } from '../utilities/SpringTween';

interface LiquidTextProps {
    text: string;
    state: 'shown' | 'hidden';
    color?: string;
    hiddenColor?: string;
    springParams?: {
        mass: number;
        tension: number;
        friction: number;
    };
    className?: string;
}

export const LiquidText: FC<LiquidTextProps> = ({
    text,
    state,
    color = 'var(--color-on-surface)',
    hiddenColor = 'transparent',
    springParams = {
        mass: 1,
        tension: 280,
        friction: 120,
    },
    className = '',
}) => {
    const textRef = useRef<HTMLSpanElement | null>(null);
    const stateRef = useRef<'shown' | 'hidden'>(state);
    const springTweenRef = useRef(SpringTween.create(0));

    useEffect(() => {
        const spring = springTweenRef.current;
        spring.setup(springParams);
        spring.run(state === 'shown' ? 1 : 0);
        stateRef.current = state;
    }, [state, springParams]);

    useEffect(() => {
        const onUpdate = springTweenRef.current.onUpdate((value) => {
            if (!textRef.current) return;
            textRef.current.style.color = 'transparent';
            textRef.current.style.webkitTextFillColor = 'transparent';
            textRef.current.style.backgroundPositionX = `${100 - value * 100}%`;
        });

        const onFinish = springTweenRef.current.onFinish(() => {
            if (!textRef.current) return;
            textRef.current.style.backgroundPositionX =
                stateRef.current === 'shown' ? '0%' : '100%';
            textRef.current.style.color =
                stateRef.current === 'shown'
                    ? 'var(--local-color)'
                    : 'transparent';
            textRef.current.style.webkitTextFillColor =
                stateRef.current === 'shown'
                    ? 'var(--local-color)'
                    : 'transparent';
        });

        return () => {
            springTweenRef.current.offUpdate(onUpdate);
            springTweenRef.current.offFinish(onFinish);
        };
    }, []);

    return (
        <span
            ref={textRef}
            style={
                {
                    '--local-color': color,
                    '--hidden-color': hiddenColor,
                    color: 'transparent',
                    backgroundImage: `linear-gradient(90deg in oklab,var(--local-color) 0,var(--local-color) 33.33%,var(--color-rose-300) 40%,var(--color-teal-400) 60%,var(--hidden-color) 66.67%,var(--hidden-color))`,
                    backgroundClip: 'text',
                    backgroundSize: '300% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundPositionY: '0px',
                    backgroundPositionX: state === 'shown' ? '100%' : '0%',
                } as React.CSSProperties
            }
            className={className}
        >
            {text}
        </span>
    );
};
