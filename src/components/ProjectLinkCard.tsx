import { type FC, useEffect, useRef, useState } from 'react';
import { SpringTween } from '../utilities/SpringTween';

interface ProjectLinkCardProps {
    title: string;
    description: string;
    link: string;
    imageSrc: string;
    className?: string;
}

export const ProjectLinkCard: FC<ProjectLinkCardProps> = ({
    title,
    description,
    link,
    imageSrc,
    className = 'w-xl',
}) => {
    const [card, setCard] = useState<HTMLAnchorElement | null>(null);
    const isHovered = useRef(false);
    const cardRef = useRef<HTMLAnchorElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const imageLoadSpringTweenRef = useRef(SpringTween.create(0));
    const imageIsLoaded = useRef(false);
    const hoverSpringTweenRef = useRef(SpringTween.create(0));

    useEffect(() => {
        const spring = hoverSpringTweenRef.current;
        spring.setup({
            mass: 1,
            tension: 280,
            friction: 30,
        });

        if (cardRef.current) {
            cardRef.current.style.setProperty(
                '--border-thickness',
                isHovered.current ? '0.5rem' : '0px',
            );
            cardRef.current.style.setProperty(
                '--border-transparency',
                isHovered.current ? '100%' : '0%',
            );
        }

        const onUpdate = spring.onUpdate((value) => {
            if (!cardRef.current) return;
            cardRef.current.style.setProperty(
                '--border-thickness',
                `${value * 0.5}rem`,
            );
            cardRef.current.style.setProperty(
                '--border-transparency',
                `${value * 100}%`,
            );
        });

        const onFinish = spring.onFinish(() => {
            if (!cardRef.current) return;
            cardRef.current.style.setProperty(
                '--border-thickness',
                isHovered.current ? '0.5rem' : '0px',
            );
            cardRef.current.style.setProperty(
                '--border-transparency',
                isHovered.current ? '100%' : '0%',
            );
        });

        return () => {
            spring.offUpdate(onUpdate);
            spring.offFinish(onFinish);
        };
    }, []);

    useEffect(() => {
        const spring = imageLoadSpringTweenRef.current;
        spring.setup({
            mass: 1,
            tension: 280,
            friction: 30,
        });

        if (imageRef.current) {
            imageRef.current.style.filter = imageIsLoaded.current
                ? 'blur(0px)'
                : `blur(4px)`;
            imageRef.current.style.opacity = imageIsLoaded.current ? '1' : '0';
        }

        const onUpdate = spring.onUpdate((value) => {
            if (!imageRef.current) return;
            imageRef.current.style.filter = `blur(${4 * (1 - value)}px)`;
            imageRef.current.style.opacity = `${value}`;
        });

        const onFinish = spring.onFinish(() => {
            if (!imageRef.current) return;
            imageRef.current.style.filter = imageIsLoaded.current
                ? 'blur(0px)'
                : `blur(4px)`;
            imageRef.current.style.opacity = imageIsLoaded.current ? '1' : '0';
        });

        return () => {
            spring.offUpdate(onUpdate);
            spring.offFinish(onFinish);
        };
    }, []);

    useEffect(() => {
        if (!card) return;

        const hoverMediaQuery = window.matchMedia('(hover: hover)');

        let supported = hoverMediaQuery.matches;

        // Hover
        const onMouseEnter = () => {
            if (!supported) return;
            isHovered.current = true;
            hoverSpringTweenRef.current.run(1);
        };

        const onMouseLeave = () => {
            if (!supported) return;
            isHovered.current = false;
            hoverSpringTweenRef.current.run(0);
        };

        const onHoverSupported = () => {
            supported = hoverMediaQuery.matches;

            // If not supported, reset the state
            if (!supported) {
                isHovered.current = false;
                hoverSpringTweenRef.current.run(0);
            }
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mouseleave', onMouseLeave);
        hoverMediaQuery.addEventListener('change', onHoverSupported);
        return () => {
            card.removeEventListener('mouseenter', onMouseEnter);
            card.removeEventListener('mouseleave', onMouseLeave);
            hoverMediaQuery.removeEventListener('change', onHoverSupported);
        };
    }, [card]);

    useEffect(() => {
        imageLoadSpringTweenRef.current.run(0);
        imageIsLoaded.current = false;
        // Fetch the image
        let cancelled = false;
        (async () => {
            // Fetch the image
            const img = await fetch(imageSrc).catch(() => null);
            if (!img || !img.ok) return;

            if (cancelled || !imageRef.current) return;

            const blob = await img.blob();
            const objectURL = URL.createObjectURL(blob);

            await new Promise<void>((resolve) =>
                setTimeout(resolve, Math.random() * 600 + 1000),
            );

            imageRef.current.src = objectURL;
            imageIsLoaded.current = true;
            imageLoadSpringTweenRef.current.run(1);
        })();

        return () => {
            cancelled = true;
        };
    }, [imageSrc]);

    return (
        <a
            ref={(el) => {
                setCard(el);
                cardRef.current = el;
            }}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col gap-2 ${className} group`}
        >
            <div className="w-full rounded-xl sm:rounded-2xl aspect-video [border-width:calc(var(--border-thickness))] [border-color:color-mix(in_oklab,var(--color-indigo-400)_var(--border-transparency),transparent)] bg-primary-container overflow-hidden">
                <img
                    ref={imageRef}
                    src={imageSrc}
                    alt={title}
                    style={{
                        filter: `blur(4px)`,
                        opacity: '0',
                    }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="font-bold font-display text-indigo-400 group-hover:underline">
                    {title}
                </h3>
                <p className="text-sm">{description}</p>
            </div>
        </a>
    );
};
