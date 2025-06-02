// src/views/CartView.ts

export class CartView {
  private wrapper: HTMLElement;
  private listEl: HTMLUListElement;
  private priceEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;

  private onCheckoutCallback: () => void = () => {};

  constructor(container: HTMLElement) {
    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    if (!basketTemplate) throw new Error('<template id="basket"> not found');

    const clone = basketTemplate.content.cloneNode(true) as DocumentFragment;

    const list = clone.querySelector('.basket__list') as HTMLUListElement;
    const footer = clone.querySelector('.modal__actions') as HTMLElement;
    const price = footer.querySelector('.basket__price') as HTMLElement;
    const button = footer.querySelector('button') as HTMLButtonElement;

    if (!list || !footer || !price || !button) {
      throw new Error('Ошибка при инициализации элементов корзины');
    }

    this.wrapper = document.createElement('div');
    this.wrapper.appendChild(clone);
    container.appendChild(this.wrapper);

    this.listEl = list;
    this.priceEl = price;
    this.checkoutBtn = button;

    this.checkoutBtn.addEventListener('click', () => {
      this.onCheckoutCallback();
    });
  }

  /** Подписка на кнопку "Оформить" */
  onCheckout(callback: () => void): void {
    this.onCheckoutCallback = callback;
  }

  /** Обновление содержимого списка товаров */
  setItems(items: HTMLElement[]): void {
    this.listEl.innerHTML = '';
    items.forEach((el) => this.listEl.appendChild(el));
  }

  /** Обновление итоговой суммы и состояния кнопки */
  setTotalPrice(total: number): void {
    this.priceEl.textContent = `${total} синапсов`;
    this.checkoutBtn.disabled = total === 0;
  }

  /** Вернуть контейнер корзины */
  render(): HTMLElement {
    return this.wrapper;
  }
}
