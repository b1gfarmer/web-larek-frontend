## Архитектура и классы проекта "Веб-ларёк"

### Используемый стек

HTML, SCSS, TypeScript, Webpack.

---

### Инструкция по запуску

```sh
npm install
npm run start
# или
yarn
yarn start
````

---

### Общая структура приложения

Приложение реализовано по паттерну **MVP (Model-View-Presenter)**.
Взаимодействие между слоями происходит через колбэки (View → Presenter), а API-запросы — в Presenter.
**ApiClient** — вспомогательный класс для работы с REST API.

```
src/
  components/         # вспомогательные UI-компоненты (Modal и т. п.)
    base/
      api.ts
      events.ts
      Modal.ts
  models/             # модели приложения (ProductsModel, CartModel, OrderModel)
    CartModel.ts
    OrderModel.ts
    ProductsModel.ts
  views/              # классы представлений (HeaderView, CatalogView, и т. д.)
    CartView.ts
    CatalogView.ts
    ContactsView.ts
    HeaderView.ts
    OrderView.ts
    ProductModalView.ts
    SuccessView.ts
  types/              # все TypeScript-типы
    cart.ts
    order.ts
    product.ts
    api.ts
  apiClient.ts        # реализация ApiClient
  Presenter.ts        # Presenter, который связывает модели и представления
  index.ts            # точка входа (создаёт Presenter и вызывает init)
  scss/
    styles.scss       # корневой файл стилей
  utils/
    constants.ts      # константы проекта
    utils.ts          # вспомогательные функции
```

---

### Важные файлы

* `src/index.ts` — точка входа приложения, создаёт и инициализирует Presenter.

* `src/Presenter.ts` — класс Presenter, который:

  1. Подписывается на обновления моделей, чтобы обновлять View.
  2. Регистрирует колбэки View → Presenter.
  3. Выполняет запросы к API и обрабатывает ошибки.
  4. Составляет объекты заказов (`Order`) и передаёт их в `ApiClient`.

* `src/models/ProductsModel.ts` — хранит список загруженных продуктов, предоставляет методы `setProducts`, `getAll`, `getById`.

* `src/models/CartModel.ts` — управляет состоянием корзины: методы `add`, `remove`, `clear`, `getItems`.

* `src/models/OrderModel.ts` — накапливает детали заказа (payment, address, email, phone, total) и формирует финальный объект `Order` для отправки.

* `src/apiClient.ts` — обёртка над `fetch`, реализует методы `getProducts()` и `makeOrder(order)`.

* `src/views/`:

  * `HeaderView.ts` — рендерит счётчик в шапке, обрабатывает клик «открыть корзину».
  * `CatalogView.ts` — рендерит каталог товаров, отслеживает клик по карточке.
  * `ProductModalView.ts` — рендерит подробную информацию о продукте, кнопка «В корзину».
  * `CartView.ts` — рендерит список товаров в корзине, сумму и кнопку «Оформить».
  * `OrderView.ts` — рендерит форму выбора способа оплаты + адрес, валидация до отправки.
  * `ContactsView.ts` — рендерит форму ввода Email + телефона, валидация до отправки.
  * `SuccessView.ts` — рендерит экран «Заказ оформлен» с итоговой суммой.

* `src/components/base/Modal.ts` — базовый класс для работы с модальными окнами: открытие, закрытие, обработка Escape и клика вне контента.

---

### Основные сущности, классы и их роли

#### 1. **ProductsModel**

* **Задача:** Хранит массив `Product[]`, который пришёл из API.
* **Атрибуты:**

  * `products: Product[]`
* **Колбэк:**

  * `onUpdate?: (products: Product[]) => void`
* **Методы:**

  * `setProducts(items: Product[]): void` — сохранить список и вызвать `onUpdate`.
  * `getAll(): Product[]` — вернуть копию списка.
  * `getById(id: string): Product | undefined` — найти продукт по `id`.

#### 2. **CartModel**

* **Задача:** Управляет состоянием корзины (список `CartItem`).
* **Атрибуты:**

  * `items: CartItem[]`
* **Колбэк:**

  * `onUpdate?: (items: CartItem[]) => void`
* **Методы:**

  * `add(item: CartItem): void` — добавить новый товар, вызвать `onUpdate`.
  * `remove(productId: string): void` — удалить товар, вызвать `onUpdate`.
  * `clear(): void` — очистить корзину, вызвать `onUpdate`.
  * `getItems(): CartItem[]` — вернуть копию массива.

#### 3. **OrderModel**

* **Задача:** Хранит детали заказа (способ оплаты, адрес, контакты, total).
* **Атрибуты:**

  * `paymentType: 'card' | 'cash'`
  * `address: string`
  * `email: string`
  * `phone: string`
* **Методы:**

  * `setPayment(paymentType: 'card' | 'cash', address: string): void`
  * `setContacts(email: string, phone: string): void`
  * `getOrder(items: CartItem[], total: number): Order` — собрать финальный объект `Order`,
  * `clear(): void` — сбросить все поля.

#### 4. **ApiClient**

* **Задача:** Обёртка над `fetch`, предоставляет методы для работы с API.
* **Методы:**

  * `getProducts(): Promise<Product[]>` — GET `/product/`.
  * `makeOrder(order: Order): Promise<OrderResponse>` — POST `/order`.

#### 5. **Modal**

* **Задача:** Управление модальным окном (открытие/закрытие, при клике вне контента и Escape).
* **Атрибуты:**

  * `root: HTMLElement` — корневой элемент модалки.
  * `content: HTMLElement` — контейнер для вставки произвольных View.
* **Методы:**

  * `open(): void` — показать модалку, заблокировать прокрутку, навесить Escape-слушатель.
  * `close(): void` — скрыть модалку, снять блокировку прокрутки, снять Escape-слушатель.

#### 6. **HeaderView**

* **Задача:** Отображение иконки корзины в шапке и счётчика.
* **Атрибуты:**

  * `container: HTMLElement` — корневой элемент View.
  * `onOpenBasketCallback?: () => void`
* **Методы:**

  * `onOpenBasket(callback: () => void): void` — подписка на клик по иконке.
  * `updateCounter(count: number): void` — обновить цифру-счётчик.

#### 7. **CatalogView**

* **Задача:** Отображение сетки товаров.
* **Атрибуты:**

  * `container: HTMLElement`
  * `onProductClickCallback?: (productId: string) => void`
* **Методы:**

  * `onProductClick(callback: (productId: string) => void): void`
  * `render(products: Product[]): void` — очистить `container` и нарисовать карточки.

#### 8. **ProductModalView**

* **Задача:** Показ детальной карточки товара и кнопки "В корзину".
* **Атрибуты:**

  * `container: HTMLElement`
  * `onAddToCartCallback?: (productId: string) => void`
* **Методы:**

  * `onAddToCart(callback: (productId: string) => void): void`
  * `render(product: Product): void` — вставить разметку с данными и кнопку.

#### 9. **CartView**

* **Задача:** Отображение списка товаров в корзине (название, цена) и кнопки "Оформить".
* **Атрибуты:**

  * `container: HTMLElement`
  * `onRemoveCallback?: (productId: string) => void`
  * `onCheckoutCallback?: () => void`
* **Методы:**

  * `onRemoveItem(callback: (productId: string) => void): void`
  * `onCheckout(callback: () => void): void`
  * `render(items: CartViewItem[]): void` — клонирует шаблон, заполняет данными и вешает слушатели.

#### 10. **OrderView**

* **Задача:** Форма выбора способа оплаты и ввода адреса.
* **Атрибуты:**

  * `container: HTMLElement`
  * `onSubmitCallback?: (payment: 'card' | 'cash', address: string) => void`
* **Методы:**

  * `onSubmit(callback: (payment: 'card' | 'cash', address: string) => void): void`
  * `render(): void` — вставить форму, валидация полей, вызвать `onSubmitCallback` при корректном сабмите.

#### 11. **ContactsView**

* **Задача:** Форма ввода Email и телефона.
* **Атрибуты:**

  * `container: HTMLElement`
  * `onSubmitCallback?: (email: string, phone: string) => void`
* **Методы:**

  * `onSubmit(callback: (email: string, phone: string) => void): void`
  * `render(): void` — вставить форму, валидация полей, вызвать `onSubmitCallback` при сабмите.
  * `showError(message: string): void` — показать текст ошибки под формой.

#### 12. **SuccessView**

* **Задача:** Экран «Заказ оформлен».
* **Атрибуты:**

  * `container: HTMLElement`
  * `onCloseCallback?: () => void`
* **Методы:**

  * `onClose(callback: () => void): void`
  * `render(total: number): void` — показать сумму, назначить слушатель на кнопку.

---

### Основные пользовательские события

| Событие          | Описание                                     | Инициатор        | Обработчик |
| ---------------- | -------------------------------------------- | ---------------- | ---------- |
| productSelected  | Клик по карточке товара                      | CatalogView      | Presenter  |
| addToCart        | Клик «В корзину» в модальном окне товара     | ProductModalView | Presenter  |
| removeFromCart   | Клик «удалить» в корзине                     | CartView         | Presenter  |
| openBasket       | Клик по иконке корзины в шапке               | HeaderView       | Presenter  |
| checkoutNextStep | Клик «Оформить» в корзине                    | CartView         | Presenter  |
| orderSubmit      | Сабмит формы оплаты и адреса                 | OrderView        | Presenter  |
| contactsSubmit   | Сабмит формы Email + телефона                | ContactsView     | Presenter  |
| modalClose       | Клик крестика или Escape для модального окна | Modal            | Presenter  |
| successClose     | Клик «За новыми покупками»                   | SuccessView      | Presenter  |

---

### Пример сценария взаимодействия

1. Пользователь кликает по товару → **productSelected** (CatalogView) → Presenter открывает ProductModalView.
2. Клик «В корзину» → **addToCart** (ProductModalView) → Presenter добавляет в CartModel, CartView обновляет список.
3. Клик иконки корзины → **openBasket** (HeaderView) → Presenter собирает данные для CartView и открывает модалку.
4. Клик «Оформить» → **checkoutNextStep** (CartView) → Presenter открывает OrderView.
5. В OrderView выбирают оплату + вводят адрес → **orderSubmit** → Presenter сохраняет в OrderModel, открывает ContactsView.
6. В ContactsView вводят Email + телефон → **contactsSubmit** → Presenter собирает заказ (`OrderModel.getOrder`), вызывает ApiClient.makeOrder.
   • Если успешно → Presenter очищает CartModel, показывает SuccessView.
   • Если ошибка → Presenter вызывает `ContactsView.showError(...)`, форма остаётся открытой.

---

### Типы данных

* **Product:**

  ```ts
  interface Product {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    category: string;
  }
  ```
* **CartItem:**

  ```ts
  interface CartItem {
    productId: string;
  }
  ```
* **Order:**

  ```ts
  interface Order {
    items: string[];
    payment: 'card' | 'cash';
    address: string;
    email: string;
    phone: string;
    total: number;
  }
  ```
* **OrderResponse:**

  ```ts
  interface OrderResponse {
    id: string;
    total: number;
  }
  ```

