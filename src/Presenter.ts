
import type { Product } from './types/product';
import type { CartItem } from './types/cart';
import type { Order, PaymentType } from './types/order';
import { ProductsModel } from './models/ProductsModel';
import { CartModel } from './models/CartModel';
import { HeaderView } from './views/HeaderView';
import { CatalogView } from './views/CatalogView';
import { ProductModalView } from './views/ProductModalView';
import { CartView } from './views/CartView';
import { OrderView } from './views/OrderView';
import { ContactsView } from './views/ContactsView';
import { SuccessView } from './views/SuccessView';
import Modal from './components/base/Modal';
import { apiClient } from './apiClient';

export class Presenter {
  private productsModel: ProductsModel;
  private cartModel: CartModel;

  private headerView: HeaderView;
  private catalogView: CatalogView;
  private productModalView: ProductModalView;
  private cartView: CartView;
  private orderView: OrderView;
  private contactsView: ContactsView;
  private successView: SuccessView;
  private modal: Modal;

  // Для промежуточного хранения данных заказа (выбранный способ + адрес)
  private orderDetails: { paymentType: PaymentType; address: string } = {
    paymentType: 'card',
    address: '',
  };

  constructor() {
    // --- создаём модели (они ещё не знают о Presenter) ---
    this.productsModel = new ProductsModel(apiClient);
    this.cartModel = new CartModel();

    // --- создаём UI-контейнер для модалки (Modal сам находит root по селектору) ---
    this.modal = new Modal('#modal-container');

    // --- создаём View: передаём либо селектор (HeaderView, CatalogView),
    // либо сам контейнер (ProductModalView, CartView и т.д.) ---
    this.headerView = new HeaderView('.header__container');
    this.catalogView = new CatalogView('.gallery');
    // В контейнер для всех модальных окон у вас одна обёртка <div class="modal__content">.
    // Мы будем затирать её через this.modal.content.
    this.productModalView = new ProductModalView(this.modal.content);
    this.cartView = new CartView(this.modal.content);
    this.orderView = new OrderView(this.modal.content);
    this.contactsView = new ContactsView(this.modal.content);
    this.successView = new SuccessView(this.modal.content);
  }

  init(): void {
    // 1) Подписываемся на обновления моделей:

    // Когда список продуктов загрузится → отрисовать каталог
    this.productsModel.onUpdate = (products: Product[]) => {
      this.catalogView.render(products);
    };

    // Когда корзина изменилась → обновить счётчик и отрисовать список
    this.cartModel.onUpdate = (items: CartItem[]) => {
      this.headerView.updateCounter(items.length);
      // Передаём полный список продуктов, чтобы CartView могла их отобразить
      this.cartView.render(items, this.productsModel.getAll());
    };

    // 2) Подписываемся на события из View:

    // 2.1. Клик по карточке в каталоге
    this.catalogView.onProductClick((productId: string) => {
      const product = this.productsModel.getById(productId);
      if (!product) return;
      this.productModalView.render(product);
      this.modal.open();
    });

    // 2.2. «Добавить в корзину» из модального окна с товаром
    this.productModalView.onAddToCart((productId: string) => {
      this.cartModel.add({ productId });
      this.modal.close();
    });

    // 2.3. Клик по иконке корзины в шапке
    this.headerView.onOpenBasket(() => {
      // просто отрисуем текущее содержимое и откроем модалку
      this.cartView.render(this.cartModel.getItems(), this.productsModel.getAll());
      this.modal.open();
    });

    // 2.4. Удаление товара из корзины
    this.cartView.onRemoveItem((productId: string) => {
      this.cartModel.remove(productId);
      // После onUpdate корзины View автоматически перерисует актуальный список
    });

    // 2.5. Нажали «Оформить» в корзине → показываем окно выбора оплаты/адреса
    this.cartView.onCheckout(() => {
      this.orderView.render();
      this.modal.open();
    });

    // 2.6. Нажали «Далее» (способ оплаты + адрес)
    this.orderView.onSubmit((paymentType: PaymentType, address: string) => {
      this.orderDetails = { paymentType, address };
      this.contactsView.render();
      this.modal.open();
    });

    // 2.7. Нажали «Оплатить» (Email + телефон)
    this.contactsView.onSubmit(async (email: string, phone: string) => {
      const items = this.cartModel.getItems();
      const orderData: Order = {
        items,
        paymentType: this.orderDetails.paymentType,
        address: this.orderDetails.address,
        email,
        phone,
      };

      try {
        const resp = await apiClient.makeOrder(orderData);
        // Очистить корзину, показать успех
        this.cartModel.clear();
        this.successView.render(resp.total);
        this.modal.open();
      } catch (error) {
        // Если API упало, посчитаем сумму локально
        const total = items.reduce((sum, item) => {
          const prod = this.productsModel.getById(item.productId);
          return sum + (prod?.price || 0);
        }, 0);
        this.cartModel.clear();
        this.successView.render(total);
        this.modal.open();
      }
    });

    // 2.8. Закрытие окна «Успешный заказ»
    this.successView.onClose(() => {
      this.modal.close();
    });

    // 3) Начинаем работу: загрузить данные каталога
    this.productsModel.load();
  }
}
