
export class SuccessView {
  private container: HTMLElement;
  private onCloseCallback: () => void = () => {};

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /** Presenter подписывается, чтобы закрыть модалку по кнопке «За новыми покупками!» */
  onClose(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  /** Отрисовать сообщение об успешном заказе */
  render(total: number): void {
    this.container.innerHTML = `
      <div class="order-success">
        <h2 class="order-success__title">Заказ оформлен</h2>
        <p class="order-success__description">Списано ${total} синапсов</p>
        <button class="button order-success__close">За новыми покупками!</button>
      </div>
    `;
    const btnClose = this.container.querySelector('button.order-success__close') as HTMLButtonElement;
    btnClose.addEventListener('click', () => this.onCloseCallback());
  }
}
