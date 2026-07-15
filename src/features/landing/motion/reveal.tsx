"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, amount: 0.2 } as const;

type RevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    y?: number;
};

export function Reveal({ children,  className,  delay = 0,y = 16,
}: RevealProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

type StaggerProps = { children: ReactNode;  className?: string; gap?: number;
};

export function Stagger({
    children,
    className,
    gap = 0.08,
}: StaggerProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            variants={{
                visible: {
                    transition: { staggerChildren: gap },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

type StaggerItemProps = {
    children: ReactNode;
    className?: string;
    y?: number;
};

export function StaggerItem({
    children,
    className,
    y = 16,
}: StaggerItemProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: EASE },
                },
            }}
        >
            {children}
        </motion.div>
    );
}
