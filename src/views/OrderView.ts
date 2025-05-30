
import type { PaymentType } from '../types/order';

export class OrderView {
  constructor(
    private container: HTMLElement,
    private onSubmit: (payment: PaymentType, address: string) => void
  ) {}

  render() {
    this.container.innerHTML = `
      <form class="form">
        <div class="order__field">
          <h2 class="modal__title">Способ оплаты</h2>
            <div class="order__buttons">
							<button type="button" class="button button_alt">Онлайн</button>
							<button type="button" class="button button_alt">При получении</button>
						</div>
        </div>
        <label class="order__field">
          <span class="form__label modal__title">Адрес доставки</span>
          <input name="address" class="form__input" type="text" />
        </label>
        <div class="modal__actions">
          <button type="submit" disabled class="button order__button">Далее</button>
        </div>
      </form>
    `;
    const form = this.container.querySelector('form')!;
    const buttons = Array.from(form.querySelectorAll('button.button_alt')) as HTMLButtonElement[];
    const addr = form.querySelector('input[name="address"]') as HTMLInputElement;
    const sub = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    let payment: PaymentType | null = null;
    const validate = () => { sub.disabled = !(payment && addr.value.trim()); };
    buttons.forEach(b => b.addEventListener('click', () => {
      payment = (b.name === 'card' ? 'card' : 'cash');
      buttons.forEach(x => x.classList.remove('button_alt-active'));
      b.classList.add('button_alt-active');
      validate();
    }));
    addr.addEventListener('input', validate);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (payment) this.onSubmit(payment, addr.value.trim());
    });
  }
}