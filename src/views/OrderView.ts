

export class OrderView {
  private formElement: HTMLFormElement;
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;

  private onInputCallback: (field: 'payment' | 'address', value: string) => void = () => {};
  private onSubmitCallback: () => void = () => {};

  constructor(private container: HTMLElement) {
    // Клонируем шаблон <template id="order"> из index.html
    const template = document.getElementById('order') as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;
    this.container.appendChild(content);

    // Находим саму форму и её элементы
    this.formElement = this.container.querySelector('form[name="order"]')! as HTMLFormElement;
    this.paymentButtons = this.formElement.querySelectorAll('button.button_alt') as NodeListOf<HTMLButtonElement>;
    this.addressInput = this.formElement.querySelector('input[name="address"]')! as HTMLInputElement;
    this.submitBtn = this.formElement.querySelector('button[type="submit"]')! as HTMLButtonElement;

    // Обработка клика по способу оплаты
    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const paymentType = button.getAttribute('name'); // name="card" или name="cash"
        if (paymentType === 'card' || paymentType === 'cash') {
          // Снимаем класс у всех, добавляем активный класс к выбранному
          this.paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
          button.classList.add('button_alt-active');
          this.onInputCallback('payment', paymentType);
        }
      });
    });

    // Обработка ввода адреса
    this.addressInput.addEventListener('input', () => {
      const value = this.addressInput.value.trim();
      this.onInputCallback('address', value);
    });

    // Отправка формы “Далее”
    this.formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmitCallback();
    });
  }

  /**
   * Presenter подписывается на изменения полей формы (payment / address)
   */
  onInput(callback: (field: 'payment' | 'address', value: string) => void): void {
    this.onInputCallback = callback;
  }

  /**
   * Presenter подписывается на сабмит (кнопка “Далее”)
   */
  onSubmit(callback: () => void): void {
    this.onSubmitCallback = callback;
  }

  /**
   * Обновить состояние формы: выставить значение поля “Адрес“, 
   * отметить активную кнопку оплаты и включить/отключить кнопку “Далее”
   * @param address — текущее значение адреса
   * @param payment — 'card' | 'cash' | null
   * @param isValid — true, если оба поля валидны (и способ оплаты, и адрес заполнены)
   */
  setFormState(address: string, payment: 'card' | 'cash' | null, isValid: boolean): void {
    this.addressInput.value = address || '';

    this.paymentButtons.forEach((b) => {
      if (b.getAttribute('name') === payment) {
        b.classList.add('button_alt-active');
      } else {
        b.classList.remove('button_alt-active');
      }
    });

    this.submitBtn.disabled = !isValid;
  }

  /**
   * Возвращает корневой элемент, чтобы Presenter мог показать этот View в модалке
   */
  render(): HTMLElement {
    return this.container;
  }
}
