const tg = window.Telegram?.WebApp;

export function useTelegram() {
  const onToggleButton = () => {
    if (tg.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    onToggleButton,
    expand: () => tg?.expand?.(),
    close: () => tg?.close?.(),
    showMainButton: () => tg?.MainButton?.show?.(),
    hideMainButton: () => tg?.MainButton?.hide?.(),
    setMainButtonText: (text: string) => tg?.MainButton?.setText?.(text),
    onMainButton: (cb: () => void) => tg?.MainButton?.onClick?.(cb),
    offMainButton: (cb: () => void) => tg?.MainButton?.offClick?.(cb)
  };
}
