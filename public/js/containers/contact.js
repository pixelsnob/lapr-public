
import template from 'lib/template';
import events from 'events/app';
import csrf from 'lib/csrf';

export default class {
  
  constructor(context, store) {
    this.context = context;
    this.store = store;
    this.$el = document.createElement('template');

    events.once('connected', this.connected.bind(this));

    document.body.className = 'contact'; // <<<<<,
  }

  connected($el) {
    // Contact form submit handler, form validation
    events.registerDomEvent('click', 'contact:send', ev => {
      ev.stopPropagation();
      ev.preventDefault();

      const field_names = [ 'name', 'email', 'phone', 'comments' ];

      const valid_flags = field_names.map(field_name => {
        const field = document.querySelector(`[name="${field_name}"]`);
        const $field_error = document.querySelector(`[data-error="${field_name}"]`);

        field.style = '';
        $field_error.innerText = '';

        if (!field.validity.valid) {
          field.style = 'border:2px solid red;'; // <<
          if (field.validity.valueMissing && field.required) {
            $field_error.innerText = 'Required';
          } else if (field_name == 'email' && field.validity.typeMismatch) {
            $field_error.innerText = 'Email address is not valid';
          }
        }
        return field.validity.valid;
      });

      if (valid_flags.every(valid => valid)) {
        const contact = new this.store.Contact;
        field_names.forEach(field_name => {
          //contact.set(field_name, .value);
          const field_value = document.querySelector(`[name="${field_name}"`).value;
          contact.set(field_name, field_value);
        });
        contact.save().then(() => {
          console.log('?');
        });
        /*this.model.save().then(function() {
          //this.model.clear();
          console.log('?');
        });*/
        //}).catch(this.showServerError);
      }
    });
  }

  render() {
    this.$el.innerHTML = template.render('partials/contact', {});
    // add csrf
    this.$el.content.querySelector('.form').innerHTML = `
      <form action="/contact" method="post" novalidate>
        <div data-fieldsets="">
          <fieldset data-fields="">
            <div>
              <label for="c2_name">Name</label>
              <div>
                <span data-editor="">
                  <input tabindex="1" id="c2_name" name="name" type="text" autocomplete="name" aria-live="polite" required>
                </span>
                <div data-error="name" class="error">
                </div>
                <div></div>
              </div>
              <div>
                <label for="c2_email">Email</label>
                <div>
                  <span data-editor="">
                    <input tabindex="2" id="c2_email" name="email" type="email" autocomplete="email" aria-live="polite" required>
                  </span>
                  <div data-error="email" class="error"></div>
                  <div></div>
                </div>
              </div>
              <div>
                <label for="c2_phone">Phone</label>
                  <div>
                    <span data-editor="">
                      <input tabindex="3" id="c2_phone" name="phone" type="text" autocomplete="tel" aria-live="polite">
                    </span>
                    <div data-error="phone" class="error"></div>
                    <div></div>
                  </div>
              </div>
              <div>
                <label for="c2_comments" required>Comments</label>
                <div>
                  <span data-editor="comments">
                    <textarea tabindex="4" id="c2_comments" name="comments" aria-live="polite" required></textarea>
                  </span>
                  <div data-error="comments" class="error"></div>
                  <div></div>
                </div>
              </div>
            </fieldset>
          </div>
        <button class="send" data-action="contact:send">Send</button>
        <input type="hidden" name="csrf" value=""></input>
      </form>
    `;
    this.$el.content.querySelector('[name="csrf"]').value = csrf.getParam();
    return this.$el.content.cloneNode(true);
  }
}

