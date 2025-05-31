export class OrderView {
  private payment: 'card' | 'cash' | null = null;
  private address: string = '';
  private submitCallback: (payment: 'card' | 'cash', address: string) => void = () => {};

  constructor(private container: HTMLElement) {}

  onSubmit(callback: (payment: 'card' | 'cash', address: string) => void) {
    this.submitCallback = callback;
  }

  render() {
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
    const buttons = form.querySelectorAll<HTMLButtonElement>('button[data-type]');
    const addressInput = form.querySelector<HTMLInputElement>('input[name="address"]')!;
    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    const validate = () => {
      this.address = addressInput.value.trim();
      submitButton.disabled = !(this.payment && this.address);
    };

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const type = button.dataset.type;
        if (type === 'card' || type === 'cash') {
          this.payment = type;

          // выделим активную кнопку
          buttons.forEach(b => b.classList.remove('button_alt-active'));
          button.classList.add('button_alt-active');

          validate();
        }
      });
    });

    addressInput.addEventListener('input', validate);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.payment && this.address) {
        this.submitCallback(this.payment, this.address);
      }
    });
  }
}
