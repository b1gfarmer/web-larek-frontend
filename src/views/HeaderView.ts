
export class HeaderView {
  private basketButton: HTMLButtonElement;
  private basketCounter: HTMLElement;

  constructor(containerSelector: string) {
    const container = document.querySelector(containerSelector);
    if (!container) throw new Error(`Header container not found: ${containerSelector}`);

    // Ищем внутри контейнера кнопку корзины и счётчик
    this.basketButton = (container.querySelector('.header__basket') as HTMLButtonElement);
    this.basketCounter = (container.querySelector('.header__basket-counter') as HTMLElement);

    if (!this.basketButton)  throw new Error('HeaderView: .header__basket not found');
    if (!this.basketCounter) throw new Error('HeaderView: .header__basket-counter not found');
  }

  /** Позволяет Presenter-у подписаться на клик по иконке корзины */
  onOpenBasket(callback: () => void): void {
    this.basketButton.addEventListener('click', () => {
      callback();
    });
  }

  /** Обновляет число товаров (Presenter вызывает при обновлении CartModel) */
  updateCounter(count: number): void {
    this.basketCounter.textContent = String(count);
  }
}
