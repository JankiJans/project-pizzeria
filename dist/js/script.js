/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

//const { Input } = require("postcss");

//const { Value } = require("sass");

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

  class Product {
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;  //odnośnik do id produktu w data.js czyli np breakfast
      thisProduct.data = data; //odnośnik do opisu produktu który znajduję się pod id czyli class, name, price itd

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderFrom();
      thisProduct.inintAmountWidget();
      thisProduct.proccesOrder();
      

      console.log('new Product:', thisProduct);
    }

    renderInMenu(){ //metoda która ma tworzyć produkty na stronie

      const thisProduct = this;

      /* generate HTML based on template */

      const generatedHTML = templates.menuProduct(thisProduct.data);  //generujemy kod na podstawie templatea który jest zapisany wyżej i ma id `template-menu-product`

      /* create element using utils.createElementFromHtml */

      thisProduct.element = utils.createDOMFromHTML(generatedHTML); //tworzenie elementu DOM czyli obiektu wygenerowanego przez przeglądarke na podstaiwe kodu HTML

      /* find menu container */

      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      
      menuContainer.appendChild(thisProduct.element);

    }

    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); //odpowiada za nagłówek elementów(pozycji na stronie)
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form); //odpowiada za skłaniki po rozwinięciu
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs); //elemnt który odpowiada za ilość dodanych albo odjętych elemnetów
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton); //odpowiada za przycisk add to cart po rozwinęciu
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem); //opowiada za cenę TOTAL po rozwinięciu
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper); //szuka obazków
      console.log('thisProduct.imageWrapper:', thisProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      console.log('amountWidgetElem:', thisProduct.amountWidgetElem);
    }

    initAccordion(){
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */

      //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); // stała która szuka konkretnego elementu z `thisProduct.element` znaleziona została w stałej `select` poźniej w menuProduct` i na końcu `clikable`

      /* START: add event listener to clickable trigger on event click */

      //clickableTrigger.addEventListener('click', function(event){
      thisProduct.accordionTrigger.addEventListener('click', function(event){

        /* prevent default action for event */

        event.preventDefault(); //to pozwala zapobiec domyślnej akcji dla zdarzenia np. blokuje przekierowanie na inną stronę.

        /* find active product (product that has active class) */

        const activeProduct = document.querySelector(select.all.menuProductsActive);
        console.log('activeProduct', activeProduct);

        /* if there is active product and it's not thisProduct.element, remove class active from it */

        if(activeProduct && activeProduct !== thisProduct.element) {

          activeProduct.classList.remove('active');
        }

        /* toggle active class on thisProduct.element */

        thisProduct.element.classList.toggle('active');

      });

    }

    initOrderFrom(){
      const thisProduct = this;
      console.log('initOrderFrom:', thisProduct);

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.proccesOrder();
  
      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.proccesOrder();

        });

      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.proccesOrder();

      });

    }

    proccesOrder(){  //średnio ogarniam 
      const thisProduct = this;
      console.log('proccesOrder:', thisProduct);

      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}

      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData:', formData);

      // set price to default price

      let price = thisProduct.data.price;

      // for every category (param)...

      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }

        const param = thisProduct.data.params[paramId];
        console.log(paramId, param);

        // for every option in this category

        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }

          const option = param.options[optionId];
          console.log(optionId, option);

          // check if there is param with a name of paramId in formData and if it includes optionId
          if(formData[paramId] && formData[paramId].includes(optionId)) {
            // check if the option is not default
            if(!option.default){
              // add option price to price variable
              
              price += option.price;
            }
            // check if the option is default
          } else if(option.default) {

            // reduce price variable
            
            price -= option.price;

          } 

          const optionImages = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          console.log(optionImages);


          //for (let image of optionImages) {
            //image.addEventListener('click', function() {
              //this.classList.toggle('active');
            //});
          //}
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

          if(optionImages) {
            if(optionSelected) {
              optionImages.classList.add('active');
              
            } else {
              optionImages.classList.remove('active');
            }
          }

        }

      }

      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;
    }

    inintAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    }
    
  }

  class AmountWidget {
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();


      console.log('AmountWidget:', thisWidget);
      console.log('constructor arguments:', element);
    }

    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      console.log('AmountWidget:', thisWidget.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      console.log('AmountWidget:', thisWidget.linkIncrease);

    }

    setValue(Value){
      const thisWidget = this;

      const newValue = parseInt(Value);
      console.log(newValue);

      /* TODO: Add validation */

      thisWidget.value = newValue;
      thisWidget.input.value = thisWidget.value;

      if(thisWidget.value !== newValue && !isNaN(newValue)) { //pętla w której `thisWidget.value` zmieni się tylko wtedy jeśl nowa wpisana w input wartość będzie inna niż obecna
        thisWidget.value = newValue;
        console.log('setValue:', newValue);

        if (thisWidget.input.newValue < 0){
          thisWidget.linkDecrease = 0;
        }  
      }

    }

    initActions(){
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();

        thisWidget.setValue(thisWidget.value -1);
      });

      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();

        thisWidget.setValue(thisWidget.value +1);
      });
      
    }

  }

  const app = {
    initMenu: function(){
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
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
