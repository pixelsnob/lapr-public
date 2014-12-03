/**
 * product_categories view
 * 
 */
define([
  'views/base',
  'views/admin/category',
  'cms/views/modal/base',
  'cms/views/modal/form',
  'template'
], function(
  BaseView,
  CategoryView,
  ModalView,
  ModalFormView,
  template
) {

  return BaseView.extend({

    events: {
    },
    
    initialize: function(opts) {
      this.setElement(template.render('admin/categories'));
      this.listenTo(this.collection, 'change', this.render);
    },
    
    render: function() {
      var obj    = this
          $table = this.$el.find('table');
      $table.empty();
      this.collection.each(function(category) {
        var view = new CategoryView({ model: category });
        $table.append(view.render().el);
      });
      return this;
    },

    renderModal: function(opts) {
      var modal_view = new ModalView;
      modal_view.modal({
        title: 'Edit Product Categories',
        body: this.render().el,
        save_label: 'Save'
      });
    }
    
  });
});
