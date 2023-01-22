import { templates, select } from "../settings.js";
import AmountWidget from './AmountWidget.js';
import utils from '../utils.js';

class Booking {
    constructor(element){
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.initWidgets();
    }

    render(element){
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget(); //generuje kod HTML z szablonu bookingWidget z pliku settings.js
        const generatedDOM = utils.createDOMFromHTML(generatedHTML); //tworzy DOM z kodu HTML
        const bookingWrapper = document.querySelector(select.containerOf.booking);
        bookingWrapper.appendChild(generatedDOM);



        thisBooking.dom = { //tworzy obiekt thisBooking.dom, który będzie przechowywał wszystkie elementy DOM, które będą potrzebne do działania klasy Booking
            wrapper: element,
            peopleAmount: element.querySelector(select.booking.peopleAmount),
            hoursAmount: element.querySelector(select.booking.hoursAmount),

        }; 

        
    }

    initWidgets(){
        const thisBooking = this;
  
        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);


        thisBooking.dom.wrapper.addEventListener('updated', function(){

        });

        
    }
}



export default Booking;
