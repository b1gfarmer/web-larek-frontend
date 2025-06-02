export class SuccessView {
  private container: HTMLElement;
  private closeButton: HTMLButtonElement | null = null;
  private description: HTMLElement | null = null;
  private onCloseCallback: () => void = () => {};

  constructor(container: HTMLElement) {
    this.container = container;

    this.container.innerHTML = `
      <div class="order-success">
        <h2 class="order-success__title">Заказ оформлен</h2>
        <p class="order-success__description"></p>
        <button class="button order-success__close">За новыми покупками!</button>
      </div>
    `;
    this.description = this.container.querySelector('.order-success__description');
    this.closeButton = this.container.querySelector('.order-success__close');
    this.closeButton?.addEventListener('click', () => this.onCloseCallback());
  }

  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  render(total: number): HTMLElement {
    if (this.description) {
      this.description.textContent = `Списано ${total} синапсов`;
    }
    return this.container;
  }
}
