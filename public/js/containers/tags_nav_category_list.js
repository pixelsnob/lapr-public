
import template from 'lib/template';
import TagsNavItem from 'components/tags_nav_item';

export default class {
  
  constructor(context, store) {
    this.context = context;
    this.store = store;
    this.$el = document.createElement('template');
  }

  render() {
    this.$el.innerHTML = template.render('partials/tags_nav_category_list', {
      tag_category: this.context.params.tag_category
    });
    const tags = this.store.tags.models.filter(tag => {
      return tag.get('category') == this.context.params.tag_category._id
    });
    tags.forEach(model => {
      const context = {
        ...this.context,
        params: {
          ...this.context.params, tag: model.toJSON()
        }
      };
      const tags_nav_item = new TagsNavItem(context, this.store);
      this.$el.content.querySelector('.tags-list').appendChild(tags_nav_item.render());
    });
    return this.$el.content.cloneNode(true);
  }
}

