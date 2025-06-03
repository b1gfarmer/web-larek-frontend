
export class ContactsView {
  private formElement: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private errorSpan: HTMLElement;

  private onInputCallback: (field: 'email' | 'phone', value: string) => void = () => {};
  private onSubmitCallback: () => void = () => {};

  constructor(private container: HTMLElement) {
    // Клонируем шаблон <template id="contacts"> из index.html
    const template = document.getElementById('contacts') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;
    this.container.appendChild(content);

    // Находим саму форму и её поля
    this.formElement = this.container.querySelector('form[name="contacts"]')! as HTMLFormElement;
    this.emailInput = this.formElement.querySelector('input[name="email"]')! as HTMLInputElement;
    this.phoneInput = this.formElement.querySelector('input[name="phone"]')! as HTMLInputElement;
    this.submitBtn = this.formElement.querySelector('button[type="submit"]')! as HTMLButtonElement;
    this.errorSpan = this.formElement.querySelector('.form__errors')! as HTMLElement;

    // Подпишемся на изменения полей: при любом вводе в инпуты вызываем коллбэк-презентеру
    this.emailInput.addEventListener('input', () => {
      const value = this.emailInput.value.trim();
      this.onInputCallback('email', value);
    });
    this.phoneInput.addEventListener('input', () => {
      const value = this.phoneInput.value.trim();
      this.onInputCallback('phone', value);
    });

    // Обработчик сабмита формы
    this.formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmitCallback();
    });
  }

  /**
   * Presenter подписывается на изменения полей (email / phone)
   */
  onInput(callback: (field: 'email' | 'phone', value: string) => void): void {
    this.onInputCallback = callback;
  }

  /**
   * Presenter подписывается на отправку формы “Оплатить”
   */
  onSubmit(callback: () => void): void {
    this.onSubmitCallback = callback;
  }

  /**
   * Обновление состояния формы: перезаписываем значения полей, 
   * а кнопка “Оплатить” активируется/деактивируется в зависимости от isValid.
   * @param email — текущее значение поля email
   * @param phone — текущее значение поля phone
   * @param isValid — true, если оба поля прошли валидацию
   */
  setFormState(email: string, phone: string, isValid: boolean): void {
    // Вставляем только непустые строки, иначе оставляем пустое
    this.emailInput.value = email || '';
    this.phoneInput.value = phone || '';
    this.submitBtn.disabled = !isValid;
  }

  /**
   * Показать текст ошибки под формой (например, “Неверный формат email” или “Ошибка при оформлении заказа”)
   */
  showError(message: string): void {
    this.errorSpan.textContent = message || '';
  }

  /**
   * Возвращает корневой элемент, чтобы Presenter мог вывести его в модалку.
   */
  render(): HTMLElement {
    return this.container;
  }
}
