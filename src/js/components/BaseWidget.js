class BaseWidget {
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {}; 
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  get value(){
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  set value(value){
    const thisWidget = this;

    const newValue = thisWidget.pareseValue(value); //paraseInt zmienia ciąg znaków na liczbe całkowitą, jeśli podany ciąg znaków nie jest ciągiem liczbowym funkcji zwróci NaN
    //console.log(newValue);

    /* TODO: Add validation */

    if(newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) { //pętla w której `thisWidget.value` zmieni się tylko wtedy jeśl nowa wpisana w input wartość będzie inna niż obecna

      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }

    

    thisWidget.renderValue();

    //console.log('setValue:', newValue);

  }

  setValue(value){
    const thisWidget = this;

    thisWidget.value = value;
  }

  pareseValue(value){
    return parseInt(value);
  
  }
  
  isValid(value){
    return !isNaN(value)

  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;

  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });

    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;