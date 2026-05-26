import {
  stepHeroFrame,
  WHEEL_SENSITIVITY,
  AUTO_SCROLL_SPEED,
} from '../components/hero/constants'

/**
 * stepHeroFrame
 *
 * 한 프레임의 x 좌표 전이 함수.
 * 입력(현재 x, lenis delta, auto-scroll 활성 여부, 한 세트 폭)을 받아
 * 다음 x를 순수하게 계산한다. 부수효과 없음.
 *
 * 적용 순서 (계약):
 *   next = x - lenisDelta          // lenis 휠 입력 반영
 *   if autoScrollEnabled: next -= AUTO_SCROLL_SPEED
 *   if next <= -2w: next += w      // 오른쪽 경계 → 중간 세트로 wrap
 *   else if next >= 0: next -= w   // 왼쪽 경계 → 중간 세트로 wrap
 */

const W = 1000 // 한 세트 폭 — 테스트 편의용

describe('stepHeroFrame — lenis delta 반영', () => {
  it('lenisDelta 양수는 x를 감소시킨다 (카드가 왼쪽으로)', () => {
    expect(
      stepHeroFrame({
        x: -500,
        lenisDelta: 10,
        autoScrollEnabled: false,
        oneSetWidth: W,
      }),
    ).toBe(-510)
  })

  it('lenisDelta 음수는 x를 증가시킨다 (카드가 오른쪽으로)', () => {
    expect(
      stepHeroFrame({
        x: -500,
        lenisDelta: -10,
        autoScrollEnabled: false,
        oneSetWidth: W,
      }),
    ).toBe(-490)
  })

  it('lenisDelta가 0이면 auto-scroll 없을 때 x 유지', () => {
    expect(
      stepHeroFrame({
        x: -500,
        lenisDelta: 0,
        autoScrollEnabled: false,
        oneSetWidth: W,
      }),
    ).toBe(-500)
  })
})

describe('stepHeroFrame — auto-scroll', () => {
  it('autoScrollEnabled가 true면 AUTO_SCROLL_SPEED만큼 x를 감소시킨다', () => {
    expect(
      stepHeroFrame({
        x: -500,
        lenisDelta: 0,
        autoScrollEnabled: true,
        oneSetWidth: W,
      }),
    ).toBe(-500 - AUTO_SCROLL_SPEED)
  })

  it('autoScrollEnabled가 false면 delta 없을 때 x 유지', () => {
    expect(
      stepHeroFrame({
        x: -500,
        lenisDelta: 0,
        autoScrollEnabled: false,
        oneSetWidth: W,
      }),
    ).toBe(-500)
  })

  it('lenisDelta와 auto-scroll이 동시에 작용한다', () => {
    expect(
      stepHeroFrame({
        x: -500,
        lenisDelta: 10,
        autoScrollEnabled: true,
        oneSetWidth: W,
      }),
    ).toBe(-500 - 10 - AUTO_SCROLL_SPEED)
  })
})

describe('stepHeroFrame — 무한 루프 경계', () => {
  it('next가 -2w 정확히 같으면 중간 세트로 wrap (next + w)', () => {
    expect(
      stepHeroFrame({
        x: -2 * W,
        lenisDelta: 0,
        autoScrollEnabled: false,
        oneSetWidth: W,
      }),
    ).toBe(-W)
  })

  it('next가 -2w보다 작아지면 중간 세트로 wrap', () => {
    expect(
      stepHeroFrame({
        x: -2 * W - 5,
        lenisDelta: 0,
        autoScrollEnabled: false,
        oneSetWidth: W,
      }),
    ).toBe(-W - 5)
  })

  it('next가 0 정확히 같으면 중간 세트로 wrap (next - w)', () => {
    expect(
      stepHeroFrame({
        x: 0,
        lenisDelta: 0,
        autoScrollEnabled: false,
        oneSetWidth: W,
      }),
    ).toBe(-W)
  })

  it('next가 양수가 되면 중간 세트로 wrap', () => {
    expect(
      stepHeroFrame({
        x: 5,
        lenisDelta: 0,
        autoScrollEnabled: false,
        oneSetWidth: W,
      }),
    ).toBe(-W + 5)
  })

  it('auto-scroll + delta로 경계를 넘겨도 한 번에 wrap된다', () => {
    // x가 거의 -2w 직전, lenis delta가 크게 밀어 -2w를 넘는 경우
    const result = stepHeroFrame({
      x: -2 * W + 3,
      lenisDelta: 5,
      autoScrollEnabled: true,
      oneSetWidth: W,
    })
    // -2w + 3 - 5 - 0.5 = -2w - 2.5 → wrap → -w - 2.5
    expect(result).toBe(-W - 2.5)
  })
})

describe('stepHeroFrame — oneSetWidth 가드', () => {
  it('oneSetWidth가 0이면 경계 체크를 건너뛴다 (초기화 전 상태)', () => {
    // init 전에는 teleport되지 않고 현재 계산만 반영
    expect(
      stepHeroFrame({
        x: 100,
        lenisDelta: 0,
        autoScrollEnabled: false,
        oneSetWidth: 0,
      }),
    ).toBe(100)
  })
})

describe('WHEEL_SENSITIVITY', () => {
  it('양수 상수로 정의되어 있다', () => {
    expect(WHEEL_SENSITIVITY).toBeGreaterThan(0)
  })
})
