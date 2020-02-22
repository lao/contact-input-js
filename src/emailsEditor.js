/* eslint-disable no-console */
import './main.scss';

export default class emailsEditor {
  constructor(config) {
    const {
      container,
      // onChange,
      // getEmails,
      // setEmails
    } = config || {};

    if (!this.validConfig(config)) {
      console.log('config invalid');
    }

    this.emails = {};

    this.render(container);
    const input = container.querySelector('input');
    const listener = (e) => {
      return e;
    };
    input.addEventListener('change', listener);
    input.addEventListener('keyup', listener);
  }

  validConfig(config) {
    return config && config.container;
  }

  render(el) {
    const template = `
      <div class="container">
        <div class="top">
          <h1>Share <strong>Board name</strong> with others</h1>
          <div class="text-container">
            <div class="ballons-container">
              <div class="ballon">dfdff</div>
            </div>
            <input placeholder="add more people..."/>
          </div>
        </div>
        <div class="bottom">
          <button>
            Add email
          </button>  
          <button>
            Get emails count
          </button>
        </div>
      </div>
    `;
    el.innerHTML = template;
    return el;
  }
}
