/**
 * useIsMobile
 *
 * 뷰포트가 모바일 크기인지 런타임에 감지하는 훅.
 * matchMedia 기반이라 resize 이벤트보다 가볍고 정확하며, 브레이크포인트
 * 경계를 넘을 때만 콜백이 호출된다.
 *
 * 사용 우선순위 (위에서 아래로):
 *   1. CSS 미디어 쿼리 (Tailwind `md:` 등)  — DOM 트리를 통째로 가를 때
 *   2. 부모로부터 prop으로 전달                — 이미 게이트된 문맥 안
 *   3. 이 훅                                     — 한 컴포넌트가 두 모드에서
 *                                                 같은 DOM을 렌더해야 할 때
 *
 * 브레이크포인트는 Tailwind의 기본 `md` 값(768px)과 일치시킨다.
 */

import { useEffect, useState } from "react";

export const MOBILE_BREAKPOINT_PX = 768;

const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`;

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(MOBILE_QUERY).matches;
    });

    useEffect(() => {
        const mql = window.matchMedia(MOBILE_QUERY);
        const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return isMobile;
}
