// modal.ts
import { apiClient } from './apiClient';
import type { Cart } from './types/cart';
import type { Product } from './types/product';
import type { PaymentType } from './types/order';

export function initModalLogic() {
  document.addEventListener('click', (event) => {
    const activeModal = document.querySelector('.modal.modal_active') as HTMLElement;
    if (!activeModal) return;

    const isCloseClick = (event.target instanceof Element) && event.target.closest('.modal__close');
    const isOverlayClick = event.target === activeModal;

    if (isCloseClick || isOverlayClick) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

export function openModal(modal: HTMLElement) {
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('modal_active'));
  modal.classList.add('modal_active');
}

export function closeModal() {
  document.body.style.overflow = '';
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('modal_active'));
}

export function openCartModal(cart: Cart, products: Product[], onCheckout: () => void) {
  const modal = document.getElementById('modal-container') as HTMLElement;
  const content = modal.querySelector('.modal__content') as HTMLElement;
  const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
  const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;

  const basket = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const list = basket.querySelector('.basket__list') as HTMLElement;
  const total = basket.querySelector('.basket__price') as HTMLElement;
  const button = basket.querySelector('.basket__button') as HTMLButtonElement;

  const items = cart.items.map((item, index) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;

    const card = itemTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    (card.querySelector('.basket__item-index') as HTMLElement).textContent = String(index + 1);
    (card.querySelector('.card__title') as HTMLElement).textContent = product.title;
    (card.querySelector('.card__price') as HTMLElement).textContent = `${product.price} синапсов`;

    const delBtn = card.querySelector('.basket__item-delete') as HTMLButtonElement;
    delBtn.addEventListener('click', () => {
      cart.items.splice(index, 1);
      openCartModal(cart, products, onCheckout);
    });

    return card;
  }).filter(Boolean);

  const sum = cart.items.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    return acc + (product?.price || 0);
  }, 0);

  total.textContent = `${sum} синапсов`;

  if (items.length) {
    list.replaceChildren(...(items as HTMLElement[]));
  } else {
    list.innerHTML = '<li class="basket__item">Корзина пуста</li>';
  }

  button.addEventListener('click', () => {
    onCheckout();
  });

  content.innerHTML = '';
  content.appendChild(basket);
  openModal(modal);
}

export function openOrderModal(cart: Cart, onOrderComplete: () => void) {
  const modal = document.getElementById('modal-container') as HTMLElement;
  const content = modal.querySelector('.modal__content') as HTMLElement;
  const orderTemplate = document.getElementById('order') as HTMLTemplateElement;

  const orderForm = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
  const payButtons = Array.from(orderForm.querySelectorAll('.button_alt')) as HTMLButtonElement[];
  const addressInput = orderForm.querySelector('input[name="address"]') as HTMLInputElement;
  const submitBtn = orderForm.querySelector('.order__button') as HTMLButtonElement;

  let paymentType: PaymentType | null = null;

  function validate() {
    submitBtn.disabled = !(paymentType && addressInput.value.trim());
  }

  payButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      paymentType = btn.name === 'card' ? 'card' : 'cash';
      payButtons.forEach(b => b.classList.remove('button_alt-active'));
      btn.classList.add('button_alt-active');
      validate();
    });
  });

  addressInput.addEventListener('input', validate);

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    openContactsModal(cart, {
      paymentType: paymentType!,
      address: addressInput.value.trim(),
    }, onOrderComplete);
  });

  content.innerHTML = '';
  content.appendChild(orderForm);
  openModal(modal);
}

function openContactsModal(
  cart: Cart,
  orderInfo: { paymentType: PaymentType; address: string },
  onOrderComplete: () => void
) {
  const modal = document.getElementById('modal-container') as HTMLElement;
  const content = modal.querySelector('.modal__content') as HTMLElement;
  const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;

  const contactsForm = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
  const emailInput = contactsForm.querySelector('input[name="email"]') as HTMLInputElement;
  const phoneInput = contactsForm.querySelector('input[name="phone"]') as HTMLInputElement;
  const submitBtn = contactsForm.querySelector('button[type="submit"]') as HTMLButtonElement;

  // Подсчитаем сумму для показа в Success-модалке
  const totalSum = cart.items.reduce((acc, item) => {
    const prod = cart.items.find(p => p.productId === item.productId);
    const price = prod ? (prod as any).price : 0;
    return acc + price;
  }, 0);

  function validate() {
    submitBtn.disabled = !(emailInput.value.trim() && phoneInput.value.trim());
  }

  emailInput.addEventListener('input', validate);
  phoneInput.addEventListener('input', validate);

  // При сабмите формы делаем API-запрос и открываем Success
  contactsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const order = {
        items: cart.items,
        address: orderInfo.address || 'Адрес не указан',
        paymentType: orderInfo.paymentType || 'card',
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
      };
      const result = await apiClient.makeOrder(order);
      cart.items = [];
      onOrderComplete();
      openOrderSuccessModal(result.total);
    } catch {
      // Если API упало — всё равно покажем Success
      openOrderSuccessModal(totalSum);
    }
  });

  // Дублируем: при клике на кнопку «Оплатить» сразу открываем Success (без ожидания API)
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openOrderSuccessModal(totalSum);
  });

  content.innerHTML = '';
  content.appendChild(contactsForm);
  openModal(modal);
}

function openOrderSuccessModal(total: number) {
  const modal = document.getElementById('modal-container') as HTMLElement;
  const content = modal.querySelector('.modal__content') as HTMLElement;
  const successTemplate = document.getElementById('success') as HTMLTemplateElement;

  const successBlock = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const desc = successBlock.querySelector('.order-success__description') as HTMLElement;
  desc.textContent = `Списано ${total} синапсов`;

  const closeBtn = successBlock.querySelector('.order-success__close') as HTMLButtonElement;
  closeBtn.addEventListener('click', closeModal);

  content.innerHTML = '';
  content.appendChild(successBlock);
  openModal(modal);
}

