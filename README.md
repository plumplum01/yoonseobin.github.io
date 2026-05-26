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
    ui/
    layout/
      Cursor.tsx
      Footer.tsx
      navigation/
        GlobalNavigationBar.tsx
    blocks/
      carousel/
    features/
      feedback/
      home/
        AboutSection.tsx
        ContactSection.tsx
        hero/
      projects/
      theme/
  data/
    about.json
    projects.json
    site.json
    media/
      projects/
  registry/
    projects.ts
    about.ts
    site.ts
    projectLoader.ts
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
- 페이지별 smooth scroll 사용 여부는 `pageRoutes[].smoothScroll`에서 관리합니다.
- `src/app/layouts/RootLayout.tsx`는 전역 레이아웃입니다. `GlobalNavigationBar`, `Cursor`, `Outlet`을 렌더링합니다.
- `src/pages`는 라우트 단위 화면을 보관합니다.
- `src/components/ui`는 shadcn 같은 외부 UI primitive 도입을 위한 예약 영역입니다.
- `src/components/layout`은 전역 앱 셸과 레이아웃성 컴포넌트를 보관합니다.
- `src/components/blocks`는 CMS block renderer처럼 콘텐츠 블록 단위로 재사용될 컴포넌트를 보관합니다.
- `src/components/features`는 home, projects, theme처럼 기능/도메인 의도가 있는 UI 컴포넌트를 보관합니다.
- `*.module.css`는 deprecated로 간주하고, 신규 스타일은 cva + Tailwind utility 기반으로 작성합니다.
- 기존 `*.module.css`는 기능 개발 과정에서 점진적으로 제거합니다.
- 커스텀 typography utility인 `src/styles/typography.css`도 deprecated로 간주하고, Tailwind text utility와 `@theme` 토큰으로 대체합니다.
- 한국어/일본어/중국어처럼 CJK 본문 줄바꿈이 필요한 긴 텍스트에는 `text-cjk` 유틸리티를 사용합니다.
- `src/data`는 Sanity로 완전히 통합하기 전까지 사용하는 임시 로컬 원본 데이터/미디어 영역입니다.
- `src/registry`는 앱이 소비하는 데이터 registry이자 추후 DOT(Data Orchestration/Translation) 계층으로 전환할 예정인 경계입니다.
- 앱 컴포넌트는 `src/data`나 Sanity에 직접 의존하지 않고 `src/registry`를 통해 데이터를 사용합니다.
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

현재는 `src/data`의 로컬 JSON과 media asset을 사용합니다. 이후 CMS가 Sanity로 통합되면 앱 컴포넌트는 그대로 두고, `src/registry` 내부의 데이터 소스를 Sanity query 기반으로 교체합니다.
