import { renderHook, act } from '@testing-library/react'
import { useScrollLock } from '../hooks/useScrollLock'

describe('useScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  it('잠금 시 body overflow를 hidden으로 설정한다', () => {
    const { result } = renderHook(() => useScrollLock())

    act(() => result.current.lock())

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('해제 시 body overflow를 빈 문자열로 복원한다', () => {
    const { result } = renderHook(() => useScrollLock())

    act(() => result.current.lock())
    act(() => result.current.unlock())

    expect(document.body.style.overflow).toBe('')
  })

  it('여러 컴포넌트가 잠근 경우 하나가 해제해도 overflow는 유지된다', () => {
    const { result: a } = renderHook(() => useScrollLock())
    const { result: b } = renderHook(() => useScrollLock())

    act(() => {
      a.current.lock()
      b.current.lock()
    })

    act(() => a.current.unlock())

    // b가 아직 잠겨 있으므로 hidden 유지
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('모든 컴포넌트가 해제하면 overflow가 복원된다', () => {
    const { result: a } = renderHook(() => useScrollLock())
    const { result: b } = renderHook(() => useScrollLock())

    act(() => {
      a.current.lock()
      b.current.lock()
    })

    act(() => {
      a.current.unlock()
      b.current.unlock()
    })

    expect(document.body.style.overflow).toBe('')
  })

  it('언마운트 시 자동으로 잠금을 해제한다', () => {
    const { result, unmount } = renderHook(() => useScrollLock())

    act(() => result.current.lock())
    unmount()

    expect(document.body.style.overflow).toBe('')
  })
})
