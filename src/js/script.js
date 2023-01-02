/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;  //odnośnik do id produktu w data.js czyli np breakfast
      thisProduct.data = data; //odnośnik do opisu produktu który znajduję się pod id czyli class, name, price itd

      thisProduct.renderInMenu();

      console.log('new Product:', thisProduct);
    }

    renderInMenu(){ //metoda która ma tworzyć produkty na stronie
      const thisProduct = this;

      /* generate HTML based on template */

      const generatedHTML = templates.menuProduct(thisProduct.data);  //generujemy kod na podstawie templatea który jest zapisany wyżej i ma id `template-menu-product`
      console.log(generatedHTML);

      /* create element using utils.createElementFromHtml */

      thisProduct.element = utils.createDOMFromHTML(generatedHTML); //tworzenie elementu DOM czyli obiektu wygenerowanego przez przeglądarke na podstaiwe kodu HTML

      /* find menu container */

      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      
      menuContainer.appendChild(thisProduct.element);

    }
  }

  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;
  
      thisApp.data = dataSource; //odnośnik do data.js/dataSource
    },
  
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData(); //wyołanie `initData` przez `thisApp`
      thisApp.initMenu(); //wyołanie `initMenu` przez `thisApp`
    },  
  };

  app.init();

}
