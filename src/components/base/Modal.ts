/**
 * Класс Modal управляет открытием/закрытием модального окна и предоставляет контейнер для контента
 */
export default class Modal {
  private root: HTMLElement;
  public content: HTMLElement;

  constructor(rootSelector: string) {
    const el = document.querySelector(rootSelector);
    if (!el) throw new Error(`Modal root not found: ${rootSelector}`);
    this.root = el as HTMLElement;
    const contentEl = this.root.querySelector('.modal__content');
    if (!contentEl) throw new Error(`.modal__content not found inside ${rootSelector}`);
    this.content = contentEl as HTMLElement;
    this.initHandlers();
  }

  private initHandlers() {
    // Закрытие при клике на крестик или оверлей
    this.root.addEventListener('click', (e) => {
      const target = e.target as Element;
      if (target.closest('.modal__close') || target === this.root) {
        this.close();
      }
    });
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  /** Открыть модалку */
  open() {
    document.body.style.overflow = 'hidden';
    this.root.classList.add('modal_active');
  }

  /** Закрыть модалку */
  close() {
    document.body.style.overflow = '';
    this.root.classList.remove('modal_active');
  }
}
