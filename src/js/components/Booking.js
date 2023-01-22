import { templates, select } from "../settings.js";
import AmountWidget from './AmountWidget.js';

class Booking {
    constructor(element){
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.initWidgets();
    }

    render(element){
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget(); //generuje kod HTML z szablonu bookingWidget z pliku settings.js

        thisBooking.dom = { //tworzy obiekt thisBooking.dom, który będzie przechowywał wszystkie elementy DOM, które będą potrzebne do działania klasy Booking
            wrapper: element,
        }; 

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount); 
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

        thisBooking.dom.wrapper.innerHTML = generatedHTML; 
    }

    initWidgets(){
        const thisBooking = this;

        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount); //tworzy nowy obiekt AmountWidget dla elementu thisBooking.dom.peopleAmount 
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount); //to samo tylko dla hoursAmount

        thisBooking.dom.wrapper.addEventListener('updated', function(){
            
        });

        
    }
}



export default Booking;
