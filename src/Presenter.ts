

import type { Product } from './types/product';
import type { CartItem } from './types/cart';

import { apiClient } from './apiClient';
import { ProductsModel } from './models/ProductsModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';

import { HeaderView } from './views/HeaderView';
import { CatalogView } from './views/CatalogView';
import { ProductModalView } from './views/ProductModalView';
import { CartView } from './views/CartView';
import { OrderView } from './views/OrderView';
import { ContactsView } from './views/ContactsView';
import { SuccessView } from './views/SuccessView';
import { CartItemView } from './views/CartItemView';
import { ProductCardView } from './views/ProductCardView';
import Modal from './components/base/Modal';

export class Presenter {
  private productsModel = new ProductsModel();
  private cartModel = new CartModel();
  private orderModel = new OrderModel();

  private headerView = new HeaderView('.header__container');
  private catalogView = new CatalogView('.gallery');
  private modal = new Modal('#modal-container');

  private productModalView = new ProductModalView(document.createElement('div'));
  private cartView = new CartView(document.createElement('div'));
  private orderView = new OrderView(document.createElement('div'));
  private contactsView = new ContactsView(document.createElement('div'));
  private successView = new SuccessView(document.createElement('div'));

  // Текущие значения полей:
  private currentAddress: string = '';
  private currentPayment: 'card' | 'cash' | null = null;
  private currentEmail: string = '';
  private currentPhone: string = '';

  init(): void {
    // 1) Загрузка и рендеринг каталога
    this.productsModel.onUpdate = (products: Product[]) => {
      const cardElements = products
        .filter((prod) => prod.price != null && prod.price > 0)
        .map((product) => {
          const card = new ProductCardView(product, (productId: string) => {
            this.openProductModal(productId);
          });
          return card.render();
        });
      this.catalogView.setCards(cardElements);
    };

    // 2) Подписка на обновление корзины
    this.cartModel.onUpdate = (items: CartItem[]) => {
      this.headerView.updateCounter(items.length);

      const listElements = items.map((item, idx) => {
        const product = this.productsModel.getById(item.productId)!;
        const itemView = new CartItemView(
          idx + 1,
          product.title,
          product.price,
          () => {
            this.cartModel.remove(product.id);
          }
        );
        return itemView.render();
      });

      const total = items.reduce((sum, it) => {
        const prod = this.productsModel.getById(it.productId)!;
        return sum + prod.price;
      }, 0);

      this.cartView.setItems(listElements);
      this.cartView.setTotalPrice(total);
    };

    // 3) Открытие корзины (Header → CartView)
    this.headerView.onOpenBasket(() => {
      this.cartModel.onUpdate?.(this.cartModel.getItems());
      this.modal.setContent(this.cartView.render());
      this.modal.open();
    });

    // 4) Нажали «Оформить» в CartView → переходим к OrderView
    this.cartView.onCheckout(() => {
      this.orderModel.clear();
      this.currentAddress = '';
      this.currentPayment = null;

      // При открытии OrderView кнопка «Далее» должна быть disabled
      this.orderView.setFormState('', null, false);
      this.modal.setContent(this.orderView.render());
      this.modal.open();
    });

    // 5) Ввод в OrderView (выбрали payment / ввели address)
    this.orderView.onInput((field, value) => {
      if (field === 'payment') {
        this.currentPayment = value as 'card' | 'cash';
        this.orderModel.setPayment(this.currentPayment, this.currentAddress);
      } else if (field === 'address') {
        this.currentAddress = value;
        if (this.currentPayment) {
          this.orderModel.setPayment(this.currentPayment, this.currentAddress);
        }
      }

      // 🚩 Проверка валидности «Order»-формы:
      //   1) payment должен быть либо 'card', либо 'cash'
      //   2) адрес — не менее 5 символов (после trim)
      const isAddressValid = this.currentAddress.trim().length >= 5;
      const isPaymentValid = this.currentPayment === 'card' || this.currentPayment === 'cash';
      const isOrderValid = isPaymentValid && isAddressValid;

      this.orderView.setFormState(this.currentAddress, this.currentPayment, isOrderValid);
    });

    // 6) Сабмит формы OrderView («Далее») → показываем ContactsView
    this.orderView.onSubmit(() => {
      this.currentEmail = '';
      this.currentPhone = '';

      // Изначально кнопка «Оплатить» disabled
      this.contactsView.setFormState('', '', false);
      this.modal.setContent(this.contactsView.render());
    });

    // 7) Ввод в ContactsView (email / phone)
    this.contactsView.onInput((field, value) => {
      if (field === 'email') {
        this.currentEmail = value;
      } else if (field === 'phone') {
        this.currentPhone = value;
      }
      this.orderModel.setContacts(this.currentEmail, this.currentPhone);

      // 🚩 Проверка валидности «Contacts»-формы:
      //   Email: простой regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      //   Phone: простой regex /^\+?\d{10,15}$/
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?\d{10,15}$/;

      const isEmailValid = emailRegex.test(this.currentEmail.trim());
      const isPhoneValid = phoneRegex.test(this.currentPhone.trim());
      const isContactsValid = isEmailValid && isPhoneValid;

      this.contactsView.setFormState(this.currentEmail, this.currentPhone, isContactsValid);
    });

    // 8) Сабмит формы ContactsView («Оплатить») → отправка на сервер
    this.contactsView.onSubmit(async () => {
      const items = this.cartModel.getItems();
      const total = items.reduce((sum, it) => {
        const prod = this.productsModel.getById(it.productId)!;
        return sum + prod.price;
      }, 0);

      const orderPayload = this.orderModel.getOrder(items, total);

      try {
        const result = await apiClient.makeOrder(orderPayload);
        this.cartModel.clear();
        this.orderModel.clear();
        this.currentAddress = '';
        this.currentPayment = null;
        this.currentEmail = '';
        this.currentPhone = '';

        // Показываем SuccessView
        this.modal.setContent(this.successView.render(result.total));
        this.modal.open();
      } catch (e) {
        this.contactsView.showError('Ошибка при оформлении заказа. Попробуйте позже.');
      }
    });

    // 9) Закрытие SuccessView
    this.successView.onClose(() => {
      this.modal.close();
    });

    // 10) Загрузка продуктов
    this.loadProducts();
  }

  private openProductModal(productId: string): void {
    const product = this.productsModel.getById(productId);
    if (!product) return;

    // 1) Рендерим карточку товара в модалке
    const element = this.productModalView.render(product);

    // 2) Если товар уже есть в корзине → сразу блокируем кнопку «В корзину»
    const alreadyInCart = this.cartModel
      .getItems()
      .some((i) => i.productId === productId);
    if (alreadyInCart) {
      this.productModalView.disableAddButtonIfInCart();
    }

    // 3) Подписка на кнопку «В корзину»
    this.productModalView.onAddToCart((id: string) => {
      this.cartModel.add({ productId: id });
      this.modal.close();
    });

    // 4) Показываем модалку
    this.modal.setContent(element);
    this.modal.open();
  }

  private async loadProducts(): Promise<void> {
    try {
      const products = await apiClient.getProducts();
      this.productsModel.setProducts(products);
    } catch (e) {
      console.error('Ошибка загрузки товаров:', e);
    }
  }
}
