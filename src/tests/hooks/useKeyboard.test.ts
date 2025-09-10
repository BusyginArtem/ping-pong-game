import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useKeyboard } from '@/features/game/hooks/useKeyboard';
import { CONTROLS } from '@/shared/constants';

describe('useKeyboard Hook', () => {
  const mockOnUpdateControls = vi.fn();
  const mockOnPause = vi.fn();
  const mockOnRestart = vi.fn();

  //   beforeEach(() => {
  //     vi.clearAllMocks();
  //   });

  //   it('logs keydown event', () => {
  //     window.addEventListener('keydown', (e) => console.log('EVENT CODE:', e.code));
  //     window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
  //   });

  //   it('calls onUpdateControls when movement keys are pressed', () => {
  //     const { result } = renderHook(() =>
  //       useKeyboard({
  //         onUpdateControls: mockOnUpdateControls,
  //         onPause: mockOnPause,
  //         onRestart: mockOnRestart,
  //         isGameActive: true,
  //       })
  //     );

  //     act(() => {
  //       result.current.handleKeyDown(new KeyboardEvent('keydown', { code: CONTROLS.PLAYER_LEFT_UP }));
  //     });

  //     expect(mockOnUpdateControls).toHaveBeenCalledWith({ playerLeftUp: true });
  //   });

  //   it('calls onUpdateControls when keys are released', () => {
  //     renderHook(() =>
  //       useKeyboard({
  //         onUpdateControls: mockOnUpdateControls,
  //         onPause: mockOnPause,
  //         onRestart: mockOnRestart,
  //         isGameActive: true,
  //       })
  //     );

  //     const keyUpEvent = new KeyboardEvent('keyup', { code: CONTROLS.PLAYER_LEFT_UP });
  //     window.dispatchEvent(keyUpEvent);

  //     expect(mockOnUpdateControls).toHaveBeenCalledWith({ playerLeftUp: false });
  //   });

  //   it('calls onPause when space is pressed during active game', () => {
  //     renderHook(() =>
  //       useKeyboard({
  //         onUpdateControls: mockOnUpdateControls,
  //         onPause: mockOnPause,
  //         onRestart: mockOnRestart,
  //         isGameActive: true,
  //       })
  //     );

  //     const keyDownEvent = new KeyboardEvent('keydown', { code: CONTROLS.PAUSE });
  //     window.dispatchEvent(keyDownEvent);

  //     expect(mockOnPause).toHaveBeenCalled();
  //   });

  it('does not call onPause when space is pressed during inactive game', () => {
    renderHook(() =>
      useKeyboard({
        onUpdateControls: mockOnUpdateControls,
        onPause: mockOnPause,
        onRestart: mockOnRestart,
        isGameActive: false,
      })
    );

    const keyDownEvent = new KeyboardEvent('keydown', { code: CONTROLS.PAUSE });
    window.dispatchEvent(keyDownEvent);

    expect(mockOnPause).not.toHaveBeenCalled();
  });

  //   it('calls onRestart when R key is pressed', () => {
  //     renderHook(() =>
  //       useKeyboard({
  //         onUpdateControls: mockOnUpdateControls,
  //         onPause: mockOnPause,
  //         onRestart: mockOnRestart,
  //         isGameActive: true,
  //       })
  //     );

  //     const keyDownEvent = new KeyboardEvent('keydown', { code: CONTROLS.RESTART });
  //     window.dispatchEvent(keyDownEvent);

  //     expect(mockOnRestart).toHaveBeenCalled();
  //   });

  //   it('prevents default for game control keys during active game', () => {
  //     renderHook(() =>
  //       useKeyboard({
  //         onUpdateControls: mockOnUpdateControls,
  //         onPause: mockOnPause,
  //         onRestart: mockOnRestart,
  //         isGameActive: true,
  //       })
  //     );

  //     const keyDownEvent = new KeyboardEvent('keydown', { code: CONTROLS.PLAYER_LEFT_UP });
  //     const preventDefaultSpy = vi.spyOn(keyDownEvent, 'preventDefault');
  //     window.dispatchEvent(keyDownEvent);

  //     expect(preventDefaultSpy).toHaveBeenCalled();
  //   });
});
