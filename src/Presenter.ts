// src/Presenter.ts
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

  init(): void {
    this.productsModel.onUpdate = (products: Product[]) => {
      const cardElements = products.map((product) => {
        const card = new ProductCardView(product, () => {
          this.openProductModal(product.id);
        });
        return card.render();
      });
      this.catalogView.setCards(cardElements);
    };

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

    this.headerView.onOpenBasket(() => {
      this.cartModel.onUpdate?.(this.cartModel.getItems());
      this.modal.setContent(this.cartView.render());
      this.modal.open();
    });

    // Нет глобальной onAddToCart здесь — всё в openProductModal

    this.cartView.onCheckout(() => {
      this.orderView.setFormState('', null, false);
      this.modal.setContent(this.orderView.render());
      this.modal.open();
    });

    this.orderView.onInput((field, value) => {
      if (field === 'payment' && (value === 'card' || value === 'cash')) {
        this.orderModel.setPayment(value, this.orderModel['address']);
      } else if (field === 'address') {
        this.orderModel.setPayment(this.orderModel['paymentType'], value);
      }
      const addr = this.orderModel['address'];
      const pay = this.orderModel['paymentType'];
      const isValid = Boolean(addr && pay);
      this.orderView.setFormState(addr, pay, isValid);
    });

    this.orderView.onSubmit(() => {
      this.contactsView.setFormState('', '', false);
      this.modal.setContent(this.contactsView.render());
    });

    this.contactsView.onInput((field, value) => {
      if (field === 'email') {
        this.orderModel.setContacts(value, this.orderModel['phone']);
      } else if (field === 'phone') {
        this.orderModel.setContacts(this.orderModel['email'], value);
      }
      const em = this.orderModel['email'];
      const ph = this.orderModel['phone'];
      const isValid = Boolean(em && ph);
      this.contactsView.setFormState(em, ph, isValid);
    });

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
        this.modal.setContent(this.successView.render(result.total));
        this.modal.open();
      } catch {
        this.contactsView.showError('Ошибка при оформлении заказа');
      }
    });

    this.successView.onClose(() => {
      this.modal.close();
    });

    this.loadProducts();
  }

  private openProductModal(productId: string): void {
    const product = this.productsModel.getById(productId);
    if (!product) return;

    // 1) рендерим карточку один раз и сохраняем HTML-элемент
    const element = this.productModalView.render(product);

    // 2) подписываемся на кнопку «В корзину» у только что отрисованной карточки
    this.productModalView.onAddToCart((id: string) => {
      console.log('Добавляем товар в корзину, id=', id);
      const alreadyInCart = this.cartModel
        .getItems()
        .some((i) => i.productId === id);
      if (!alreadyInCart) {
        this.cartModel.add({ productId: id });
        console.log('Товар добавлен. Текущие товары в модели:', this.cartModel.getItems());
      }
      this.modal.close();
    });

    // 3) кладём в модалку и открываем
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
