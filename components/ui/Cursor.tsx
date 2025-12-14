"use client";

import dynamic from "next/dynamic";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

// Dynamic import to prevent loading code bundle on mobile
const CursorImpl = dynamic(() => import("./CursorImpl"), { ssr: false });

export default function Cursor() {
    const isTouch = useIsTouchDevice();

    // If undefined (initial client render) or true (mobile), render nothing.
    // This ensures on desktop we wait for check (1 tick) before loading/rendering cursor.
    if (isTouch === undefined || isTouch === true) {
        return null;
    }

    return <CursorImpl />;
}
