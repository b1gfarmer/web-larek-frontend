
import './scss/styles.scss';
import { Presenter } from './Presenter';

window.addEventListener('DOMContentLoaded', () => {
  const presenter = new Presenter();
  presenter.init();
});
