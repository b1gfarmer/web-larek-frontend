
export class ContactsView {
  constructor(
    private container: HTMLElement,
    private onSubmit: (email: string, phone: string) => void
  ) {}

  render() {
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
        </div>
      </form>
    `;
    const form = this.container.querySelector('form')!;
    const email = form.querySelector('input[name="email"]') as HTMLInputElement;
    const phone = form.querySelector('input[name="phone"]') as HTMLInputElement;
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const validate = () => { btn.disabled = !(email.value.trim() && phone.value.trim()); };
    email.addEventListener('input', validate);
    phone.addEventListener('input', validate);
    form.addEventListener('submit', e => {
      e.preventDefault();
      this.onSubmit(email.value.trim(), phone.value.trim());
    });
  }
}