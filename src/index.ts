// index.ts
import './scss/styles.scss';
import { apiClient } from './apiClient';
import { initModalLogic, openOrderModal, openCartModal, closeModal } from './modal';
import type { Product } from './types/product';
import type { Cart } from './types/cart';

window.addEventListener('DOMContentLoaded', () => {
  const catalogContainer = document.querySelector('.gallery') as HTMLElement;
  const cartCounter = document.querySelector('.header__basket-counter') as HTMLElement;
  const cartButton = document.querySelector('.header__basket') as HTMLButtonElement;
  const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;

  const cart: Cart = {
    items: []
  };

  let products: Product[] = [];

  function updateCartCounter(): void {
    cartCounter.textContent = String(cart.items.length);
  }

  function openProductModal(product: Product) {
    const modal = document.getElementById('modal-container') as HTMLElement;
    const content = modal.querySelector('.modal__content') as HTMLElement;
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
    const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    card.querySelector('.card__category')!.textContent = product.category;
    card.querySelector('.card__title')!.textContent = product.title;
    card.querySelector('.card__image')!.setAttribute('src', product.image);
    card.querySelector('.card__text')!.textContent = product.description;
    card.querySelector('.card__price')!.textContent = `${product.price} синапсов`;

    const addButton = card.querySelector('.card__button');
    addButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      cart.items.push({ productId: product.id });
      updateCartCounter();
      closeModal();
    });

    content.innerHTML = '';
    content.appendChild(card);
    modal.classList.add('modal_active');
  }

  function renderCatalog(productList: Product[]): void {
    products = productList;
    catalogContainer.innerHTML = '';
    products.forEach((product: Product) => {
      const card = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const category = card.querySelector('.card__category') as HTMLElement;
      const title = card.querySelector('.card__title') as HTMLElement;
      const img = card.querySelector('.card__image') as HTMLImageElement;
      const price = card.querySelector('.card__price') as HTMLElement;

      title.textContent = product.title;
      img.src = product.image;
      price.textContent = `${product.price} синапсов`;
      category.textContent = product.category;

      const slug = product.category
        .toLowerCase()
        .replace(/ё/g, 'e')
        .replace(/[^a-z0-9а-я]+/g, '-')
        .replace(/^-+|-+$/g, '');
      category.className = 'card__category';
      category.classList.add(`card__category--${slug}`);

      card.addEventListener('click', () => openProductModal(product));
      catalogContainer.appendChild(card);
    });
  }

  cartButton.addEventListener('click', () => {
    openCartModal(cart, products, () => {
      openOrderModal(cart, () => {
        updateCartCounter();
      });
    });
  });

  apiClient.getProducts().then(renderCatalog);
  initModalLogic();
});
