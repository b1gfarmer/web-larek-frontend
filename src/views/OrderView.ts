
import type { PaymentType } from '../types/order';

export class OrderView {
  private container: HTMLElement;
  private onSubmitCallback: (payment: PaymentType, address: string) => void = () => {};

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /** Presenter подписывается, чтобы получить данные «способ оплаты + адрес» */
  onSubmit(callback: (payment: PaymentType, address: string) => void): void {
    this.onSubmitCallback = callback;
  }

  /** Отрисовка формы: кнопки оплаты + поле адреса */
  render(): void {
    this.container.innerHTML = `
      <form class="form" name="order">
        <div class="order__field">
          <h2 class="modal__title">Способ оплаты</h2>
          <div class="order__buttons">
            <button name="card" type="button" class="button button_alt">Онлайн</button>
            <button name="cash" type="button" class="button button_alt">При получении</button>
          </div>
        </div>
        <label class="order__field">
          <span class="form__label modal__title">Адрес доставки</span>
          <input name="address" class="form__input" type="text" />
        </label>
        <div class="modal__actions">
          <button type="submit" disabled class="button order__button">Далее</button>
          <span class="form__errors"></span>
        </div>
      </form>
    `;

    const form = this.container.querySelector('form') as HTMLFormElement;
    const buttons = Array.from(form.querySelectorAll('button.button_alt')) as HTMLButtonElement[];
    const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    let payment: PaymentType | null = null;

    const validate = () => {
      submitBtn.disabled = !(payment && addressInput.value.trim());
    };

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        payment = (btn.name === 'card') ? 'card' : 'cash';
        buttons.forEach(x => x.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        validate();
      });
    });
    addressInput.addEventListener('input', validate);

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (payment) {
        this.onSubmitCallback(payment, addressInput.value.trim());
      }
    });
  }
}
