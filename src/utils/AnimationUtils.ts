import gsap from "gsap";
import type { Container } from "pixi.js";

export function animateModal(container: Container, duration: number = 1.2) {
    const initialScale = container.scale.x;

    // Pulse animation
    gsap.to(container.scale, {
        duration,
        x: initialScale * 0.9,
        y: initialScale * 0.9,
        ease: "power0.out",
        yoyo: true,
        repeat: -1,
    });
}

export function stopAnimation(container: Container) {
    gsap.killTweensOf(container.scale);
}
