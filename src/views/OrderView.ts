// src/views/OrderView.ts

export class OrderView {
  private container: HTMLElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private selectedPayment: 'card' | 'cash' | null = null;

  private onInputCallback: (field: 'payment' | 'address', value: string) => void = () => {};
  private onSubmitCallback: () => void = () => {};

  constructor(container: HTMLElement) {
    this.container = container;

    this.container.innerHTML = `
      <form class="form" name="order">
        <div class="order">
          <div class="order__field">
            <h2 class="modal__title">Способ оплаты</h2>
            <div class="order__buttons">
              <button type="button" class="button button_alt" data-type="card">Онлайн</button>
              <button type="button" class="button button_alt" data-type="cash">При получении</button>
            </div>
          </div>
          <label class="order__field">
            <span class="form__label modal__title">Адрес доставки</span>
            <input name="address" class="form__input" type="text" placeholder="Введите адрес" />
          </label>
        </div>
        <div class="modal__actions">
          <button type="submit" disabled class="button order__button">Далее</button>
        </div>
      </form>
    `;

    const form = this.container.querySelector('form')!;
    this.paymentButtons = form.querySelectorAll('button[data-type]');
    this.addressInput = form.querySelector('input[name="address"]')!;
    this.submitBtn = form.querySelector('button[type="submit"]')!;

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const type = button.dataset.type;
        if (type === 'card' || type === 'cash') {
          this.selectedPayment = type;
          this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
          button.classList.add('button_alt-active');
          this.onInputCallback('payment', type);
        }
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.onInputCallback('address', this.addressInput.value.trim());
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmitCallback();
    });
  }

  /** Presenter подписывается на изменения полей формы */
  onInput(callback: (field: 'payment' | 'address', value: string) => void): void {
    this.onInputCallback = callback;
  }

  /** Presenter подписывается на нажатие «Далее» */
  onSubmit(callback: () => void): void {
    this.onSubmitCallback = callback;
  }

  /**
   * Обновить состояния формы (заполненное значение + активная кнопка + валидность)
   * @param address — текущее значение адреса
   * @param payment  — 'card' | 'cash' | null
   * @param isValid  — true, если оба поля заполнены валидно
   */
  setFormState(address: string, payment: 'card' | 'cash' | null, isValid: boolean): void {
    this.addressInput.value = address;

    this.paymentButtons.forEach(b => {
      if (b.dataset.type === payment) {
        b.classList.add('button_alt-active');
      } else {
        b.classList.remove('button_alt-active');
      }
    });

    this.submitBtn.disabled = !isValid;
  }

  /** Возвращает корневой элемент для модалки */
  render(): HTMLElement {
    return this.container;
  }
}
