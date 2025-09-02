import { type FC, useEffect, useRef, useState } from 'react';
import { SpringTween } from '../utilities/SpringTween';
import { LiquidText } from './LiquidText';

interface NoBotEmailProps {
    email: Array<{
        cipherText: string;
        e: number;
        n: number;
    }>;
}

export const NoBotEmail: FC<NoBotEmailProps> = ({ email }) => {
    const [emailString, setStringEmail] = useState<string | null>(null);
    const springTweenRef = useRef(SpringTween.create(0));
    const decryptingRef = useRef<HTMLSpanElement | null>(null);
    const emailRef = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        // Create a new worker instance
        const worker = new Worker(
            new URL('../utilities/noBotEmailWorker', import.meta.url),
            {
                type: 'module',
            },
        );

        // Handle messages from the worker
        worker.addEventListener(
            'message',
            (
                event: MessageEvent<{
                    type: 'decrypted' | 'error';
                    data?: string;
                    message?: string;
                }>,
            ) => {
                if (event.data.type === 'decrypted') {
                    setStringEmail(event.data.data || null);
                } else if (event.data.type === 'error') {
                    console.error(
                        'Error decrypting email:',
                        event.data.message,
                    );
                    setStringEmail(null);
                }
                worker.terminate();
            },
        );

        worker.postMessage({
            type: 'decrypt',
            cipherTexts: email,
        });

        return () => worker.terminate();
    }, [email]);

    useEffect(() => {
        const spring = springTweenRef.current;
        spring.setup({
            mass: 1,
            tension: 120,
            friction: 14,
        });

        if (emailString !== null) spring.run(1);

        if (emailRef.current) {
            emailRef.current.ariaHidden =
                emailString === null ? 'true' : 'false';
            emailRef.current.style.pointerEvents =
                emailString === null ? 'none' : 'auto';
            emailRef.current.style.userSelect =
                emailString === null ? 'none' : 'auto';
        }
        if (decryptingRef.current) {
            decryptingRef.current.style.pointerEvents =
                emailString === null ? 'auto' : 'none';
            decryptingRef.current.ariaHidden =
                emailString === null ? 'false' : 'true';
            decryptingRef.current.style.userSelect =
                emailString === null ? 'auto' : 'none';
        }

        const onUpdate = spring.onUpdate((value) => {
            if (!decryptingRef.current || !emailRef.current) return;
            decryptingRef.current.style.opacity = `${1 - value}`;
            emailRef.current.style.opacity = `${value}`;
        });

        const onFinish = spring.onFinish(() => {
            if (!decryptingRef.current || !emailRef.current) return;
            decryptingRef.current.style.opacity = '0';
            emailRef.current.style.opacity = '1';
        });

        return () => {
            spring.offUpdate(onUpdate);
            spring.offFinish(onFinish);
        };
    }, [emailString]);

    return (
        <div className="relative inline">
            <span ref={decryptingRef} className="absolute left-0">
                Decrypting...
            </span>
            <a
                ref={emailRef}
                href={`mailto:${emailString}`}
                className="contents absolute left-0"
            >
                <LiquidText
                    text={emailString ?? '[Loading email...]'}
                    state={emailString ? 'shown' : 'hidden'}
                    color="var(--color-indigo-400)"
                    className="hover:underline"
                />
            </a>
        </div>
    );
};
