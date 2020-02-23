/* eslint-disable no-console */
import './main.scss';
// TODO: turn this into createElement and EXTERNALIZE
const REMOVE_SVG = `<svg class="remove-icon-svg" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z" fill="#050038"/>
</svg>`;

// TODO: add random email

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

  initValues(config) {
    this.emails = {};
    this.onChange = config.onChange;
    this.container = config.container;
    this.onGetCount = config.onGetCount;
    return this;
  }

  getEmails() {
    return Object.keys(this.emails);
  }

  /**
   * It receives list of emails and append valids to the local list plus renders valid emails only
   */
  setEmails(emails) {
    if(!emails || !emails.length) {
      return;
    }
    const emailsTemp = emails.reduce((email, nonRendered) => {
      if(this.isValidEmail(email)) {
        nonRendered.append(email);
        this.emails[email] = true;
      }
      return nonRendered;
    }, []);
    this.renderEmails(emailsTemp.list);
    // [Decided not to do as setEmails, seems to be useful only for appending]
    // TODO: remove preexisting emails
  }

  dispatchOnChange() {
    console.log('hello');
    return this;
  }

  initListeners() {
    const {container} = this;
    const input = container.querySelector('input');
    const ballonsContainer = container.querySelector('.ballons-container');
    const getCountBtn = container.querySelector('.btn-count');
    const keys = {
      ENTER: 13,
      COMMA: 188,
    };
    const keyUpListener = e => {
      const { keyCode, currentTarget, ctrlKey, metaKey } = e || {};
      if (keyCode === keys.COMMA || keyCode === keys.ENTER) {
        const emailsBefore = Object.keys(this.emails);
        this
          .renderEmails(currentTarget.value)
          .dispatchOnChange(emailsBefore, currentTarget.value)
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
    const ballonsClickHandler = e => {
      const isClickOnSvg = e.target.getAttribute('class') === 'remove-icon-svg';
      const target = isClickOnSvg ? e.target.parentElement : e.target;

      if (target.className === 'remove-icon') {
        if (target.parentElement.className !== 'invalid ballon') {
          delete this.emails[target.parentElement.getAttribute('data-email')];
        }
        ballonsContainer.removeChild(target.parentElement);
      }
    };

    input.addEventListener('paste', pasteListener);
    input.addEventListener('keyup', keyUpListener);
    ballonsContainer.addEventListener('click', ballonsClickHandler);

    if (this.onGetCount && this.onGetCount instanceof Function) {
      getCountBtn.addEventListener('click', () => {
        const emails = Object.keys(this.emails);
        this.onGetCount(emails.length);
      });
    }

    return this;
  }

  renderEmailBlock(string, valid) {
    const removeIconDiv = document.createElement('div');
    removeIconDiv.className = !valid ? 'invalid ballon' : 'ballon';
    // TODO: turn this into createElement
    removeIconDiv.innerHTML = `${string} <div class="remove-icon">${REMOVE_SVG}</div>`;
    removeIconDiv.setAttribute('data-email', valid ? string : '');
    return removeIconDiv;
  }

  isValidEmail(string) {
    // eslint-disable-next-line max-len
    const emailRegx = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
    return !!emailRegx.exec(string);
  }

  /**
   * It break string value into blocks by comma, checks if is valid, adds to local copy of valid emails
   * and then renders, all in one go for performance purposes.
   */
  renderEmails(stringValue, values) {
    const blocks = values || (stringValue || '').split(',');
    const ballonsBlockFrag = document.createDocumentFragment();

    blocks.map((block) => {
      if(!(block + '').trim()) {return;}
      const isEmail = this.isValidEmail(block);
      ballonsBlockFrag.appendChild(this.renderEmailBlock(block, isEmail));

      // validations and saving to local copy
      if (isEmail) {
        this.emails[block] = true;
      }
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

  /**
   * Renders main html container for editor
   */
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
          <button class="btn-count">
            Get emails count
          </button>
        </div>
      </div>
    `;
    container.innerHTML = template;
    return this;
  }
}
