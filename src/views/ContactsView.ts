

export class ContactsView {
  constructor(
    private container: HTMLElement,
    private onSubmitCallback: (email: string, phone: string) => void = () => {}
  ) {}

  onSubmit(callback: (email: string, phone: string) => void): void {
    this.onSubmitCallback = callback;
  }

  render(): void {
    this.container.innerHTML = `
      <form class="form">
        <label class="order__field">
          <span class="form__label modal__title">Email</span>
          <input name="email" class="form__input" type="email" />
        </label>
        <label class="order__field">
          <span class="form__label modal__title">Телефон</span>
          <input name="phone" class="form__input" type="tel" />
        </label>
        <div class="modal__actions">
          <button type="submit" disabled class="button">Оплатить</button>
          <span class="form__errors"></span>
        </div>
      </form>
    `;

    const form = this.container.querySelector('form')!;
    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    const validate = () => {
      submitBtn.disabled = !(emailInput.value.trim() && phoneInput.value.trim());
    };

    emailInput.addEventListener('input', validate);
    phoneInput.addEventListener('input', validate);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmitCallback(emailInput.value.trim(), phoneInput.value.trim());
    });
  }

  showError(message: string): void {
    const errorSpan = this.container.querySelector('.form__errors') as HTMLElement;
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }
}
