
export class SuccessView {
  private container: HTMLElement;
  private closeButton: HTMLButtonElement | null = null;
  private description: HTMLElement | null = null;
  private onCloseCallback: () => void = () => {};

  constructor(container: HTMLElement) {
    this.container = container;

    // Строим разметку “Успеха” в конструкторе
    this.container.innerHTML = `
      <div class="order-success">
        <h2 class="order-success__title">Заказ оформлен</h2>
        <p class="order-success__description"></p>
        <button class="button order-success__close">За новыми покупками!</button>
      </div>
    `;

    this.description = this.container.querySelector(
      '.order-success__description'
    );
    this.closeButton = this.container.querySelector(
      '.order-success__close'
    ) as HTMLButtonElement;

    this.closeButton?.addEventListener('click', () => {
      this.onCloseCallback();
    });
  }

  /**
   * Вызов в Presenter:
   *   this.modal.setContent(this.successView.render(result.total));
   */
  render(total: number): HTMLElement {
    if (this.description) {
      this.description.textContent = `Списано ${total} синапсов`;
    }
    return this.container;
  }

  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }
}
