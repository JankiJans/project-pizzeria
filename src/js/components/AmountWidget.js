import {settings, select} from './settings.js';

class AmountWidget {
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
      


      //console.log('AmountWidget:', thisWidget);
      //console.log('constructor arguments:', element);
    }

    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      //console.log('AmountWidget:', thisWidget.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      //console.log('AmountWidget:', thisWidget.linkIncrease);

    }

    setValue(Value){
      const thisWidget = this;

      const newValue = parseInt(Value); //paraseInt zmienia ciąg znaków na liczbe całkowitą, jeśli podany ciąg znaków nie jest ciągiem liczbowym funkcji zwróci NaN
      //console.log(newValue);

      /* TODO: Add validation */

      if(thisWidget.value !== newValue && !isNaN(newValue)) { //pętla w której `thisWidget.value` zmieni się tylko wtedy jeśl nowa wpisana w input wartość będzie inna niż obecna

        if (newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){

          thisWidget.value = newValue;
        }

      } 
    

      thisWidget.input.value = thisWidget.value;

      //console.log('setValue:', newValue);

      thisWidget.announce();
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

    announce(){
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }

  }

  export default AmountWidget;