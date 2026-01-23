import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================================================
// TAILWIND CLASSNAME UTILITY - Conflict Resolution
// ============================================================================
// PATTERN: clsx (conditional classNames) + twMerge (Tailwind conflict resolution)
//
// PROBLEM:
// className="p-4 p-8" → Both classes apply → unexpected behavior
//
// SOLUTION:
// cn("p-4", "p-8") → twMerge resolves conflict → only "p-8" applies
//
// USAGE:
// cn("base-class", condition && "conditional-class", props.className)
//
// WHY clsx + twMerge:
// - clsx: Handles conditionals, arrays, objects (className composition)
// - twMerge: Intelligently merges Tailwind classes (last wins for conflicts)
// ============================================================================
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs)); // clsx composes, twMerge resolves
}
