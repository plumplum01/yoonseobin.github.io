# yoonseobin.github.io

React, TypeScript, Vite 기반의 포트폴리오 사이트입니다.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Framer Motion
- Embla Carousel
- Biome
- Vitest
- Playwright
- Sanity 준비 패키지

## Project Structure

```txt
src/
  app/
    App.tsx
    router.tsx
    layouts/
      RootLayout.tsx
  pages/
    Home.tsx
    About.tsx
  components/
    navigation/
      GlobalNavigationBar.tsx
    hero/
    project/
    carousel/
  content/
    data/
    assets/
  lib/
    content/
  features/
    theme/
  hooks/
  styles/
  __test__/

packages/
  types/
  sanity/

tests/
  e2e/
```

## Architecture Notes

- `src/app/router.tsx`에서 앱 페이지 모델인 `pageRoutes`를 관리하고, React Router의 `RouteObject[]`로 변환합니다.
- `src/app/layouts/RootLayout.tsx`는 전역 레이아웃입니다. `GlobalNavigationBar`, `Cursor`, `Outlet`을 렌더링합니다.
- `src/pages`는 라우트 단위 화면을 보관합니다.
- `src/components`는 라우트에 종속되지 않는 UI 컴포넌트를 보관합니다.
- `src/content`는 Sanity로 완전히 통합하기 전까지 사용하는 임시 로컬 콘텐츠 영역입니다.
- `src/lib/content`는 현재 content loader/adapter 역할이며, 추후 DOT(Data Orchestration/Translation) 계층으로 전환할 예정입니다.
- `packages/types`는 콘텐츠 타입 SSOT입니다.
- `packages/sanity`는 Sanity schema, query, client를 관리합니다.

## Scripts

```sh
npm run dev
npm run check
npm run test:run
npm run test:e2e
npm run build
```

## Testing

- Unit/integration tests: `src/__test__`
- E2E tests: `tests/e2e`
- Vitest setup: `src/__test__/setup.ts`

## Content Migration Plan

현재는 `src/content/data`와 `src/content/assets`를 사용합니다. 이후 CMS가 Sanity로 통합되면 앱 컴포넌트는 그대로 두고, `src/lib/content` 내부의 데이터 소스를 Sanity query 기반으로 교체합니다.
