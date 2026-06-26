import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const generateMoodGradientStyleLight = (moodName: string) => {
    let hash = 0;
    for (let i = 0; i < moodName.length; i++) {
        hash = moodName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const baseHue = Math.abs(hash % 360);
    const complementaryHue = (baseHue + 50) % 360;

    // Vibrant but dark enough to keep white text readable
    return {
        background: `linear-gradient(135deg, hsv(${baseHue} 60% 28%), hsl(${complementaryHue}, 50%, 14%))`,
        backgroundActual: `linear-gradient(135deg, hsl(${baseHue}, 50%, 24%) 0%, hsl(${complementaryHue}, 45%, 15%) 100%)`,
        borderColor: `hsl(${baseHue}, 55%, 38%)`,
    };
};