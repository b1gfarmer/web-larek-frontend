export class CartItemView {
  private element: HTMLLIElement;

  constructor(
    index: number,
    title: string,
    price: number,
    onRemove: () => void
  ) {
    const template = document.getElementById('card-basket') as HTMLTemplateElement;
    if (!template) throw new Error('<template id="card-basket"> not found');

    const clone = template.content.cloneNode(true) as DocumentFragment;
    const li = clone.querySelector('li') as HTMLLIElement;
    if (!li) throw new Error('<li> not found in template');

    li.querySelector('.basket__item-index')!.textContent = index.toString();
    li.querySelector('.card__title')!.textContent = title;
    li.querySelector('.card__price')!.textContent = `${price} синапсов`;

    li.querySelector('.basket__item-delete')!.addEventListener('click', onRemove);

    this.element = li;
  }

  render(): HTMLLIElement {
    return this.element;
  }
}
