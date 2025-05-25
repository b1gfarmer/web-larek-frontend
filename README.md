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
```

---

### Общая структура приложения

Приложение реализовано по паттерну **MVP (Model-View-Presenter)**.  
Взаимодействие между слоями реализуется через **EventEmitter** (брокер событий).  
**EventEmitter** и **ApiClient** — вспомогательные классы.

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

---

### Основные сущности, классы и их роли

#### 1. **ProductModel**
- **Задача:** Управляет данными каталога товаров.
- **Атрибуты:**  
  - `products: Product[]` — список товаров.
- **Методы:**  
  - `fetchProducts(): Promise<void>` — загрузить товары с сервера.
  - `getProductById(id: string): Product | undefined` — получить товар по id.

#### 2. **CartModel**
- **Задача:** Управляет состоянием корзины.
- **Атрибуты:**  
  - `items: CartItem[]` — список товаров в корзине.
- **Методы:**  
  - `addItem(product: Product): void` — добавить товар в корзину.
  - `removeItem(productId: string): void` — удалить товар из корзины.
  - `clear(): void` — очистить корзину.
  - `getTotal(): number` — сумма заказа.

#### 3. **OrderModel**
- **Задача:** Хранит данные о текущем заказе.
- **Атрибуты:**  
  - `items: CartItem[]`
  - `address: string`
  - `paymentMethod: string`
  - `email: string`
  - `phone: string`
- **Методы:**  
  - `setAddress(address: string): void`
  - `setPaymentMethod(method: string): void`
  - `setContact(email: string, phone: string): void`
  - `isValid(): boolean` — валидация заказа.

#### 4. **ProductView**
- **Задача:** Отображение каталога и карточки товара.
- **Атрибуты:**  
  - `container: HTMLElement`
- **Методы:**  
  - `render(products: Product[]): void`
  - `showProductModal(product: Product): void`
  - `onProductClick(callback: (id: string) => void): void`

#### 5. **CartView**
- **Задача:** Отображение корзины.
- **Атрибуты:**  
  - `container: HTMLElement`
- **Методы:**  
  - `render(cart: CartItem[]): void`
  - `onRemoveItem(callback: (id: string) => void): void`

#### 6. **OrderView**
- **Задача:** Отображение формы заказа.
- **Атрибуты:**  
  - `container: HTMLElement`
- **Методы:**  
  - `render(order: Order): void`
  - `onSubmit(callback: (order: Order) => void): void`
  - `showError(message: string): void`

#### 7. **Presenter**
- **Задача:** Управляет связью между моделями и представлениями, реализует логику переходов, реагирует на события пользователя.
- **Атрибуты:**  
  - `productModel: ProductModel`
  - `cartModel: CartModel`
  - `orderModel: OrderModel`
  - `productView: ProductView`
  - `cartView: CartView`
  - `orderView: OrderView`
  - `eventEmitter: EventEmitter`
- **Методы:**  
  - `init(): void` — инициализация приложения и подписка на события.

#### 8. **EventEmitter** 
- **Задача:** Организация событийной коммуникации между слоями.
- **Атрибуты:**  
  - `listeners: { [event: string]: Function[] }`
- **Методы:**  
  - `on(event: string, handler: Function): void`
  - `off(event: string, handler: Function): void`
  - `emit(event: string, payload?: any): void`

#### 9. **ApiClient** 
- **Задача:** Работа с REST API.
- **Методы:**  
  - `getProducts(): Promise<Product[]>`
  - `makeOrder(order: Order): Promise<OrderResult>`

---

### Классы только представления

- **ModalView** — управление отображением модальных окон (открытие/закрытие).
- **ButtonView** — универсальная кнопка.
- **InputView** — поле ввода.

Для этих сущностей не нужны отдельные модели — только классы для отображения и управления состоянием UI.

---

### Основные пользовательские события

| Событие             | Описание                                              | Инициатор           | Обработчик (слой/класс)      |
|---------------------|------------------------------------------------------|---------------------|------------------------------|
| productSelected     | Клик по карточке товара                              | ProductView         | Presenter, открывает модалку |
| addToCart           | Клик по "Купить" в модалке товара                    | ProductView         | CartModel, CartView          |
| removeFromCart      | Клик по "Убрать" в корзине                           | CartView            | CartModel, CartView          |
| openBasket          | Клик по иконке корзины                               | HeaderView          | CartView                     |
| orderSubmit         | Отправка формы заказа                                | OrderView           | OrderModel, ApiClient        |
| modalClose          | Закрытие любого модального окна                      | ModalView           | Presenter                    |
| checkoutNextStep    | Переход к следующему шагу оформления заказа          | OrderView           | OrderModel, OrderView        |

---

### Пример сценария взаимодействия

1. Пользователь кликает по товару → **productSelected**  
   → Presenter открывает модалку с товаром.
2. Клик "Купить" → **addToCart**  
   → CartModel добавляет товар, CartView обновляет корзину.
3. Оформление заказа:  
   — Ввод адреса, выбора оплаты → **checkoutNextStep**  
   — Ввод email, телефона → **orderSubmit**  
   → OrderModel валидирует данные, ApiClient отправляет заказ, CartModel очищает корзину.

---

### Типы данных 

- **Product:** id, title, description, image, price, category
- **CartItem:** product, quantity
- **Order:** items, address, paymentMethod, email, phone
