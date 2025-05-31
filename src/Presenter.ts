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
import Modal from './components/base/Modal';

export class Presenter {
  private productsModel: ProductsModel;
  private cartModel: CartModel;
  private orderModel: OrderModel;

  private headerView: HeaderView;
  private catalogView: CatalogView;
  private productModalView: ProductModalView;
  private cartView: CartView;
  private orderView: OrderView;
  private contactsView: ContactsView;
  private successView: SuccessView;
  private modal: Modal;

  constructor() {
    this.productsModel = new ProductsModel(apiClient);
    this.cartModel = new CartModel();
    this.orderModel = new OrderModel();

    this.modal = new Modal('#modal-container');

    this.headerView = new HeaderView('.header__container');
    this.catalogView = new CatalogView('.gallery');
    this.productModalView = new ProductModalView(this.modal.content);
    this.cartView = new CartView(this.modal.content);
    this.orderView = new OrderView(this.modal.content);
    this.contactsView = new ContactsView(this.modal.content);
    this.successView = new SuccessView(this.modal.content);
  }

  init(): void {
    this.productsModel.onUpdate = (products: Product[]) => {
      this.catalogView.render(products);
    };

    this.cartModel.onUpdate = (items: CartItem[]) => {
      this.headerView.updateCounter(items.length);
      this.cartView.render(items, this.productsModel.getAll());
    };

    this.catalogView.onProductClick((productId: string) => {
      const product = this.productsModel.getById(productId);
      if (!product) return;
      this.productModalView.render(product);
      this.modal.open();
    });

    this.productModalView.onAddToCart((productId: string) => {
      this.cartModel.add({ productId });
      this.modal.close();
    });

    this.headerView.onOpenBasket(() => {
      this.cartView.render(this.cartModel.getItems(), this.productsModel.getAll());
      this.modal.open();
    });

    this.cartView.onRemoveItem((productId: string) => {
      this.cartModel.remove(productId);
    });

    this.cartView.onCheckout(() => {
      this.orderView.render();
      this.modal.open();
    });

    this.orderView.onSubmit((paymentType, address) => {
      if (paymentType === 'card' || paymentType === 'cash') {
        this.orderModel.setPayment(paymentType, address);
        this.contactsView.render();
        this.modal.open();
      }
    });

    this.contactsView.onSubmit(async (email: string, phone: string) => {
      this.orderModel.setContacts(email, phone);

      const rawItems = this.cartModel.getItems();
      const filteredItems = rawItems.filter(item => {
        const prod = this.productsModel.getById(item.productId);
        return prod !== undefined && typeof prod.price === 'number';
      });

      if (!filteredItems.length) {
        this.contactsView.showError('Корзина пуста или содержит товары без цены.');
        return;
      }

      const total = filteredItems.reduce((sum, item) => {
        const prod = this.productsModel.getById(item.productId);
        return sum + (prod?.price || 0);
      }, 0);

      const orderPayload = this.orderModel.getOrder(filteredItems, total);

      try {
        const response = await apiClient.makeOrder(orderPayload);
        this.cartModel.clear();
        this.orderModel.clear();
        this.successView.render(response.total);
        this.modal.open();
      } catch (err) {
        this.contactsView.showError(
          typeof err === 'string' ? err : 'Ошибка при оформлении заказа. Попробуйте позже.'
        );
        console.error('[ERROR] Ошибка при отправке заказа:', err);
      }
    });

    this.successView.onClose(() => {
      this.modal.close();
    });

    this.productsModel.load();
  }
}