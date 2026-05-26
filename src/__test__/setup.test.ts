// Vitest 세팅 검증용 스모크 테스트
describe('Vitest setup', () => {
  it('DOM 환경이 jsdom으로 설정되어 있다', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
  })
})
