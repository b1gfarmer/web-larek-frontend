export default class Modal {
  private root: HTMLElement;
  private contentContainer: HTMLElement;
  private escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close();
  };

  constructor(rootSelector: string) {
    const el = document.querySelector(rootSelector);
    if (!el) throw new Error(`Modal root not found: ${rootSelector}`);
    this.root = el as HTMLElement;

    const contentEl = this.root.querySelector('.modal__content');
    if (!contentEl) throw new Error(`.modal__content not found inside ${rootSelector}`);
    this.contentContainer = contentEl as HTMLElement;

    this.initHandlers();
  }

  get content(): HTMLElement {
    return this.contentContainer;
  }

  private initHandlers() {
    this.root.addEventListener('click', (e) => {
      const target = e.target as Element;
      if (target.closest('.modal__close') || target === this.root) {
        this.close();
      }
    });
  }

  open() {
    document.body.style.overflow = 'hidden';
    this.root.classList.add('modal_active');
    document.addEventListener('keydown', this.escHandler);
  }

  close() {
    document.body.style.overflow = '';
    this.root.classList.remove('modal_active');
    document.removeEventListener('keydown', this.escHandler);
  }

  setContent(content: HTMLElement): void {
    this.contentContainer.innerHTML = '';
    this.contentContainer.appendChild(content);
  }
}
