"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { PopupPayload } from "@/types/popup";

// ============================================================================
// ARCHITECTURAL NOTE: POPUP MANAGEMENT VIA CONTEXT
// ============================================================================
// Global state for popup/modal system using React Context.
//
// PATTERN: Context + Provider + Custom Hook
// - PopupContext: Stores global popup state
// - PopupProvider: Wraps app in layout.tsx
// - usePopup(): Consumes context with guard check
//
// STATE:
// - isOpen: boolean (popup visibility)
// - currentPopup: PopupPayload | null (popup content data)
// - openPopup(payload): Opens popup with content
// - closePopup(): Closes popup
//
// FACT: Provider located in app/layout.tsx
// EVIDENCE: app/layout.tsx wraps children with PopupProvider
// ============================================================================

interface PopupContextType {
    isOpen: boolean;
    currentPopup: PopupPayload | null;
    openPopup: (payload: PopupPayload) => void;
    closePopup: () => void;
}

const PopupContext = createContext<PopupContextType| undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================
export function PopupProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPopup, setCurrentPopup] = useState<PopupPayload | null>(null);

    // useCallback prevents recreation on every render (stable references)
    const openPopup = useCallback((payload: PopupPayload) => {
        setCurrentPopup(payload);
        setIsOpen(true);
    }, []);

    const closePopup = useCallback(() => {
        setIsOpen(false);
        // Note: currentPopup not cleared immediately (allows exit animation)
    }, []);

    return (
        <PopupContext.Provider value={{ isOpen, currentPopup, openPopup, closePopup }}>
            {children}
        </PopupContext.Provider>
    );
}

// ============================================================================
// CONSUMER HOOK - With guard check
// ============================================================================
// GUARD: Throws if used outside PopupProvider
// WHY: Prevents runtime errors with helpful message
// PATTERN: Standard Context consumer pattern
// ============================================================================
export function usePopup() {
    const context = useContext(PopupContext);
    if (!context) {
        // GUARD: Catch developer error (forgot to wrap with provider)
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
}
