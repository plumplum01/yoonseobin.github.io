import { wheelDeltaToX, WHEEL_SENSITIVITY } from '../components/hero/constants'

describe('wheelDeltaToX', () => {
  it('스크롤 다운(deltaY 양수)은 x를 감소시켜 카드를 왼쪽으로 이동시킨다', () => {
    expect(wheelDeltaToX(100, 2)).toBe(-200)
  })

  it('스크롤 업(deltaY 음수)은 x를 증가시켜 카드를 오른쪽으로 이동시킨다', () => {
    expect(wheelDeltaToX(-100, 2)).toBe(200)
  })

  it('deltaY가 0이면 0을 반환한다', () => {
    expect(wheelDeltaToX(0, 2)).toBe(0)
  })

  it('sensitivity가 0이면 deltaY와 무관하게 0을 반환한다', () => {
    expect(wheelDeltaToX(100, 0)).toBe(0)
  })

  it('트랙패드의 fractional deltaY도 정확히 처리한다', () => {
    expect(wheelDeltaToX(7.5, 2)).toBe(-15)
  })
})

describe('WHEEL_SENSITIVITY', () => {
  it('양수 상수로 정의되어 있다', () => {
    expect(WHEEL_SENSITIVITY).toBeGreaterThan(0)
  })
})
