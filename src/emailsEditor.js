/* eslint-disable no-console */

import { Polyfill } from './helpers';
import './main.scss';

export default class emailsEditor {
  constructor() {
    alert('test');
    // eslint-disable-next-line no-console
    console.log('test');
    console.log(Polyfill.isDomElement(null));
  }
}

