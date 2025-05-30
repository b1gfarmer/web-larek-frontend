
import './scss/styles.scss';
import type { Product } from './types/product';
import type { CartItem } from './types/cart';
import type { PaymentType } from './types/order';
import { apiClient } from './apiClient';
import Modal from './components/base/Modal';
import { ProductsModel } from './models/ProductsModel';
import { CartModel } from './models/CartModel';
import {
  CatalogView,
  ProductModalView,
  CartView,
  OrderView,
  ContactsView,
  SuccessView
} from './views';

window.addEventListener('DOMContentLoaded', () => {
  // Модели данных
  const productsModel = new ProductsModel(apiClient);
  const cartModel = new CartModel();

  // Модалка
  const modal = new Modal('#modal-container');

  // Элементы шапки
  const cartCounter = document.querySelector('.header__basket-counter') as HTMLElement;
  const cartButton = document.querySelector('.header__basket') as HTMLButtonElement;

  // View-компоненты
  const catalogView = new CatalogView('.gallery', (id: string) => {
    const product = productsModel.getById(id);
    if (product) {
      productModalView.render(product);
      modal.open();
    }
  });

  const productModalView = new ProductModalView(modal.content, (id: string) => {
    cartModel.add({ productId: id });
    modal.close();
  });

  const cartView = new CartView(
    modal.content,
    (id: string) => { cartModel.remove(id); },
    () => { orderView.render(); modal.open(); }
  );

  const orderView = new OrderView(
    modal.content,
    (paymentType: PaymentType, address: string) => {
      // Сохраняем детали заказа, переходим к форме контактов
      orderDetails = { paymentType, address };
      contactsView.render();
      modal.open();
    }
  );

  let orderDetails: { paymentType: PaymentType; address: string } = {
    paymentType: 'card',
    address: ''
  };

  const contactsView = new ContactsView(
    modal.content,
    async (email: string, phone: string) => {
      const items = cartModel.getItems();
      try {
        const response = await apiClient.makeOrder({
          items,
          paymentType: orderDetails.paymentType,
          address: orderDetails.address,
          email,
          phone
        });
        cartModel.clear();
        successView.render(response.total);
        modal.open();
      } catch {
        // Если ошибка API, вычисляем сумму локально
        const total = items.reduce((sum, item) => {
          const prod = productsModel.getById(item.productId);
          return sum + (prod?.price || 0);
        }, 0);
        cartModel.clear();
        successView.render(total);
        modal.open();
      }
    }
  );

  const successView = new SuccessView(modal.content, () => {
    modal.close();
  });

  // Подписка на обновления моделей
  productsModel.onUpdate = (list: Product[]) => catalogView.render(list);
  cartModel.onUpdate = (items: CartItem[]) => {
    cartCounter.textContent = items.length.toString();
    cartView.render(items, productsModel.getAll());
  };

  // Открытие корзины по кнопке в шапке
  cartButton.addEventListener('click', () => {
    // Рисуем текущее содержимое корзины
    cartView.render(cartModel.getItems(), productsModel.getAll());
    modal.open();
  });

  // Загрузить данные и начать работу
  productsModel.load();
});