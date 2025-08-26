import { useEffect, useCallback } from 'react';

import { CONTROLS } from '@/shared/constants';
import type { Controls } from '../types';

export const useKeyboard = ({
  onUpdateControls,
  onPause,
  onRestart,
  isGameActive,
}: {
  onUpdateControls: (newControls: Partial<Controls>) => void;
  onPause: () => void;
  onRestart: () => void;
  isGameActive: boolean;
}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (Object.values(CONTROLS).includes(event.code) && isGameActive) {
        event.preventDefault();
      }

      switch (event.code) {
        case CONTROLS.PLAYER_LEFT_UP:
          onUpdateControls({ playerLeftUp: true });
          break;
        case CONTROLS.PLAYER_LEFT_DOWN:
          onUpdateControls({ playerLeftDown: true });
          break;
        case CONTROLS.PLAYER_RIGHT_UP:
          onUpdateControls({ playerRightUp: true });
          break;
        case CONTROLS.PLAYER_RIGHT_DOWN:
          onUpdateControls({ playerRightDown: true });
          break;
        case CONTROLS.PAUSE:
          if (isGameActive) {
            onPause();
          }
          break;
        case CONTROLS.RESTART:
          onRestart();
          break;
      }
    },

    [onUpdateControls, isGameActive, onRestart, onPause]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case CONTROLS.PLAYER_LEFT_UP:
          onUpdateControls({ playerLeftUp: false });
          break;
        case CONTROLS.PLAYER_LEFT_DOWN:
          onUpdateControls({ playerLeftDown: false });
          break;
        case CONTROLS.PLAYER_RIGHT_UP:
          onUpdateControls({ playerRightUp: false });
          break;
        case CONTROLS.PLAYER_RIGHT_DOWN:
          onUpdateControls({ playerRightDown: false });
          break;
      }
    },
    [onUpdateControls]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};
