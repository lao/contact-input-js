/* eslint-disable no-console */
import './main.scss';
// TODO: turn this into createElement and EXTERNALIZE
const REMOVE_SVG = `<svg class="remove-icon-svg" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z" fill="#050038"/>
</svg>`;

export default class emailsEditor {
  constructor(config) {
    config = config || {};

    if (!config || !config.container) {
      console.log('invalid config exiting...');
      return;
    }

    this
      .initValues(config)
      .renderMainContainer()
      .initListeners();
  }

  destroy() {
    // todo!
    // remove listeners
  }

  initValues(config) {
    this.emails = {};
    this.onChange = config.onChange;
    this.container = config.container;
    return this;
  }

  initListeners() {
    const {container} = this;
    const input = container.querySelector('input');
    const ballonsContainer = container.querySelector('.ballons-container');
    const keys = {
      ENTER: 13,
      COMMA: 188,
    };
    const keyUpListener = e => {
      const { keyCode, currentTarget, ctrlKey, metaKey } = e || {};
      if (keyCode === keys.COMMA || keyCode === keys.ENTER) {
        this
          .renderEmails(currentTarget.value)
          .cleanInput();
      }
      if (metaKey || ctrlKey) {
        return false;
      }
      return e;
    };
    const pasteListener = e => {
      const { currentTarget, clipboardData } = e || {};
      const clipBoardText = clipboardData.getData('text');

      this
        .renderEmails(currentTarget.value+clipBoardText)
        .cleanInput();

      e.preventDefault();
    };
    input.addEventListener('paste', pasteListener);
    input.addEventListener('keyup', keyUpListener);

    ballonsContainer.addEventListener('click', (e) => {
      const isClickOnSvg = e.target.getAttribute('class') === 'remove-icon-svg';
      const target = isClickOnSvg ? e.target.parentElement : e.target;

      if (target.className === 'remove-icon') {
        alert(e.target);
        ballonsContainer.removeChild(target.parentElement);
      }
    });
    return this;
  }

  renderEmail(string, valid) {
    const removeIconDiv = document.createElement('div');
    removeIconDiv.className = !valid ? 'invalid ballon' : 'ballon';
    // TODO: turn this into createElement
    removeIconDiv.innerHTML = `${string} <div class="remove-icon">${REMOVE_SVG}</div>`;
    return removeIconDiv;
  }

  renderEmails(stringValue) {
    // eslint-disable-next-line max-len
    const emailRegx = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
    const blocks = (stringValue || '').split(',');
    const ballonsBlockFrag = document.createDocumentFragment();

    blocks.map((block) => {
      if(!(block + '').trim()) {return;}
      const results = emailRegx.exec(block);
      ballonsBlockFrag.appendChild(this.renderEmail(block, !!results));
    });

    const inputEl = this.container.querySelector('.input-container');
    this.container
      .querySelector('.ballons-container')
      .insertBefore(ballonsBlockFrag, inputEl);

    return this;
  }

  cleanInput() {
    const {container} = this;
    const input = container.querySelector('input');
    input.value = '';
    return this;
  }

  renderMainContainer() {
    const {container} = this;
    // TODO: turn this to createDocumentFragment later
    const template = `
      <div class="container">
        <div class="top">
          <h1>Share <strong>Board name</strong> with others</h1>
          <div class="text-container">
            <div class="ballons-container">
              <div class="input-container"><input placeholder="add more people..."/></div>
            </div>
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
    container.innerHTML = template;
    return this;
  }
}
