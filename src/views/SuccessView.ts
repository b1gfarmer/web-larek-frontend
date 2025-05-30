
export class SuccessView {
  constructor(
    private container: HTMLElement,
    private onClose: () => void
  ) {}

  render(total: number) {
    this.container.innerHTML = `
      <div class="order-success">
        <h2 class="order-success__title">Заказ оформлен</h2>
        <p class="order-success__description">Списано ${total} синапсов</p>
        <button class="button order-success__close">За новыми покупками!</button>
      </div>
    `;
    this.container.querySelector('button.order-success__close')!
      .addEventListener('click', () => this.onClose());
  }
}