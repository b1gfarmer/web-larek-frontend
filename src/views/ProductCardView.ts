

import type { Product } from '../types/product';

const categorySlugMap: Record<string, string> = {
  'софт-скил': 'soft',
  'хард-скил': 'hard',
  'другое': 'other',
  'дополнительное': 'additional',
  'кнопка': 'button',
};

export class ProductCardView {
  private element: HTMLButtonElement;

  constructor(product: Product, onClick: (productId: string) => void) {
    // Клонируем шаблон <template id="card-catalog">
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    const cloned = template.content.firstElementChild!.cloneNode(true) as HTMLButtonElement;

    // Устанавливаем data-id, чтобы Presenter знал, какой продукт кликнули
    cloned.setAttribute('data-id', product.id);

    // Заменяем категорию
    const slug = categorySlugMap[product.category.toLowerCase()] || 'other';
    const categoryEl = cloned.querySelector('.card__category') as HTMLElement;
    categoryEl.textContent = product.category || '';
    categoryEl.className = `card__category card__category--${slug}`;

    // Заменяем заголовок
    const titleEl = cloned.querySelector('.card__title') as HTMLElement;
    titleEl.textContent = product.title;

    // Заменяем картинку
    const imgEl = cloned.querySelector('.card__image') as HTMLImageElement;
    imgEl.src = product.image;
    imgEl.alt = product.title;

    // Заменяем цену
    const priceEl = cloned.querySelector('.card__price') as HTMLElement;
    priceEl.textContent = product.price != null ? `${product.price} синапсов` : '0 синапсов';

    // Если нет цены (null или 0) — можно стилизовать по-другому или заблокировать кнопку
    if (product.price == null || product.price === 0) {
      // Можно добавить класс, чтобы “серо” отображалось
      cloned.classList.add('card__no-price');
    }

    // Навешиваем onClick: передаём его в Presenter
    cloned.addEventListener('click', () => {
      onClick(product.id);
    });

    this.element = cloned;
  }

  render(): HTMLButtonElement {
    return this.element;
  }
}
