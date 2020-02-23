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
      throw new Error('invalid config exiting...');
    }

    this
      .initValues(config)
      .renderMainContainer()
      .initListeners();
  }

  initValues(config) {
    this.emails = [];
    this.onChange = config.onChange;
    this.container = config.container;
    this.onGetCount = config.onGetCount;
    return this;
  }

  getEmails() {
    return this.emails;
  }

  /**
   * It clears emails in view and render only valid ones
   */
  setEmails(emails) {
    if(!emails) {
      return;
    }
    const newEmails = emails.reduce((validEmails, email) => {
      const regexResults = this.isValidEmail(email);
      if (regexResults) {
        validEmails.push(regexResults[0]);
      }
      return validEmails;
    }, []);
    const emailsBefore = [...this.emails];
    this
      .clearEmailBlocks()
      .renderEmailBlocks(null, newEmails)
      .dispatchOnChange(emailsBefore);
  }

  clearEmailBlocks() {
    this.emails = [];
    this.container
      .querySelectorAll('.ballon')
      .forEach(el => el.remove());

    return this;
  }

  dispatchOnChange(emailsBefore) {
    if (this.onChange instanceof Function) {
      this.onChange(emailsBefore, this.emails);
    }
    return this;
  }

  initListeners() {
    const {container} = this;
    const input = container.querySelector('input');
    const ballonsContainer = container.querySelector('.ballons-container');
    const getCountBtn = container.querySelector('.btn-count');
    const addRandomBtn = container.querySelector('.btn-add-random');
    const keys = {
      ENTER: 13,
      COMMA: 188,
    };
    const keyUpListener = e => {
      const { keyCode, currentTarget, ctrlKey, metaKey } = e || {};
      if (keyCode === keys.COMMA || keyCode === keys.ENTER) {
        const emailsBefore = [...this.emails];
        this
          .renderEmailBlocks(currentTarget.value)
          .dispatchOnChange(emailsBefore)
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
      const emailsBefore = [...this.emails];
      this
        .renderEmailBlocks(currentTarget.value+clipBoardText)
        .dispatchOnChange(emailsBefore)
        .cleanInput();

      e.preventDefault();
    };
    const ballonsClickHandler = e => {
      const isClickOnSvg = e.target.getAttribute('class') === 'remove-icon-svg';
      const target = isClickOnSvg ? e.target.parentElement : e.target;

      if (target.className === 'remove-icon') {
        if (target.parentElement.className !== 'invalid ballon') {
          const emailsBefore = [...this.emails];
          this.emails.splice(this.emails.indexOf(target.parentElement.getAttribute('data-email')), 1);
          this.dispatchOnChange(emailsBefore);
        }
        ballonsContainer.removeChild(target.parentElement);
      }
    };

    input.addEventListener('paste', pasteListener);
    input.addEventListener('keyup', keyUpListener);
    input.addEventListener('focusout', (e) => {
      const { currentTarget} = e || {};
      const emailsBefore = [...this.emails];
      this
        .renderEmailBlocks(currentTarget.value)
        .dispatchOnChange(emailsBefore)
        .cleanInput();
    });
    ballonsContainer.addEventListener('click', ballonsClickHandler);

    if (this.onGetCount && this.onGetCount instanceof Function) {
      getCountBtn.addEventListener('click', () => {
        this.onGetCount(this.emails.length);
      });
    }

    addRandomBtn.addEventListener('click', () => {
      const random = `some${(new Date()).getTime()}@random.com`;
      const emailsBefore = [...this.emails];
      this
        .renderEmailBlocks(random)
        .dispatchOnChange(emailsBefore);
    });

    // TODO: losing focus and adding blocks;

    return this;
  }

  renderEmailBlock(string, valid) {
    const removeIconDiv = document.createElement('div');
    removeIconDiv.className = !valid ? 'invalid ballon' : 'ballon';
    // TODO: turn this into createElement
    removeIconDiv.innerHTML = `${valid ? string : `<span>${string}</span>`} <div class="remove-icon">${REMOVE_SVG}</div>`;
    removeIconDiv.setAttribute('data-email', valid ? string : '');
    return removeIconDiv;
  }

  isValidEmail(string) {
    // eslint-disable-next-line max-len
    const emailRegx = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
    return emailRegx.exec(string);
  }

  /**
   * It break string value into blocks by comma, checks if is valid, adds to local copy of valid emails
   * and then renders, all in one go for performance purposes.
   */
  renderEmailBlocks(stringValue, values) {
    const blocks = values || (stringValue || '').split(',');
    const ballonsBlockFrag = document.createDocumentFragment();

    blocks.map((block) => {
      block = (block + '').trim();
      if (!block) {
        return;
      }
      const isEmail = this.isValidEmail(block);
      ballonsBlockFrag.appendChild(this.renderEmailBlock(block, isEmail));

      // validations and saving to local copy
      if (isEmail) {
        this.emails.push(block);
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
          <button class="btn-add-random">
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
