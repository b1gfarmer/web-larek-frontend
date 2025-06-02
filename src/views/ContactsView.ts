export class ContactsView {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private errorSpan: HTMLElement;

  private onInputCallback: (field: 'email' | 'phone', value: string) => void = () => {};
  private onSubmitCallback: () => void = () => {};

  constructor(private container: HTMLElement) {
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
    this.emailInput = form.querySelector('input[name="email"]')!;
    this.phoneInput = form.querySelector('input[name="phone"]')!;
    this.submitBtn = form.querySelector('button[type="submit"]')!;
    this.errorSpan = form.querySelector('.form__errors')!;

    this.emailInput.addEventListener('input', () => {
      this.onInputCallback('email', this.emailInput.value.trim());
    });

    this.phoneInput.addEventListener('input', () => {
      this.onInputCallback('phone', this.phoneInput.value.trim());
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmitCallback();
    });
  }

  onInput(callback: (field: 'email' | 'phone', value: string) => void): void {
    this.onInputCallback = callback;
  }

  onSubmit(callback: () => void): void {
    this.onSubmitCallback = callback;
  }

  setFormState(email: string, phone: string, isValid: boolean): void {
    this.emailInput.value = email;
    this.phoneInput.value = phone;
    this.submitBtn.disabled = !isValid;
  }

  showError(message: string): void {
    this.errorSpan.textContent = message;
  }

  render(): HTMLElement {
    return this.container;
  }
}

