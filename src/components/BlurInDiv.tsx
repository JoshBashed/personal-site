import { type FC, type HTMLAttributes, useEffect, useRef } from 'react';
import { SpringTween } from '../utilities/SpringTween';

interface BlurInDivProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    blur?: number;
    delay?: number;
}

export const BlurInDiv: FC<BlurInDivProps> = ({
    children,
    blur = 4,
    delay = 0,
    className = '',
    ...props
}) => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const springTweenRef = useRef(SpringTween.create(0));

    useEffect(() => {
        const spring = springTweenRef.current;
        spring.setup({
            mass: 1,
            tension: 170,
            friction: 26,
        });

        const onUpdate = spring.onUpdate((value) => {
            if (!divRef.current) return;
            divRef.current.style.filter = `blur(${blur * (1 - value)}px)`;
            divRef.current.style.transform = `translateY(${(1 - value) * 20}px)`;
            divRef.current.style.opacity = `${value}`;
        });

        const onFinish = spring.onFinish(() => {
            if (!divRef.current) return;
            divRef.current.style.filter = `blur(0px)`;
            divRef.current.style.transform = `translateY(0px)`;
            divRef.current.style.opacity = '1';
        });

        const timeoutId = setTimeout(() => {
            spring.run(1);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
            spring.offUpdate(onUpdate);
            spring.offFinish(onFinish);
        };
    }, [blur, delay]);

    return (
        <div
            ref={divRef}
            style={{
                filter: `blur(${blur}px)`,
                transform: 'translateY(20px)',
                opacity: '0',
                transition:
                    'filter 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
            }}
            className={className}
            {...props}
        >
            {children}
        </div>
    );
};
