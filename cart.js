const incrementar =  document.getElementById("add-count");
const remover =  document.getElementById("remove-count");
let pedido = [];
import {token} from "./config.js";
import {chat_id} from "./config.js";
const input = document.querySelector(".input-number");
const errorMessage = document.querySelector(".error");
const form = document.querySelector(".form");
const sendBtn = document.querySelector(".submit-btn");
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  var number_value = document.querySelector(".input-number").value;
  if(number_value == '' || number_value<0 || number_value == 0 || number_value[0] == 0 || number_value % 1 != 0) {
    input.classList.add("error--input");
    errorMessage.classList.add("mostrar");
  }
  else{
    input.classList.remove("error--input");
    errorMessage.classList.remove("mostrar");
    form.style.display = "none";
    localStorage.setItem("number_value", JSON.stringify(number_value));
  }
});

const createCart = ()=> {
  modalContainer.classList.remove("cart-hidden");
  modalContainer.innerHTML = "";
  const modalHeader = document.createElement('div');
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `<p class="modal-title"><ion-icon name="restaurant"></ion-icon>Su pedido</p>`;
  modalContainer.append(modalHeader);

  const formInfo = document.createElement("form");
  formInfo.className = "form-info";
  formInfo.innerHTML = `
      <form class="fomr-info">
        <textarea class="input-textarea" placeholder="Haga aclaraciones sobre su pedido (OPCIONAL)"></textarea>
      </form>`;
  modalContainer.append(formInfo);



  const modalbutton = document.createElement('buttom');
  modalbutton.className = "modal-btn-close";
  modalbutton.innerHTML = '<ion-icon name="close"></ion-icon>';
  modalHeader.append(modalbutton);

  cart.forEach((product)=>{
      let cartContent = document.createElement('div');
      cartContent.className = "modal-content";
      cartContent.innerHTML = `
      <img src="${product.image}" alt="product-Img" class="img-mini">
      <p class="product-name-cart">${product.nombre}</p>
      <div class="caja">
        <p class="product-amount">x ${product.cantidad}</p>
      </div>
      <p class="product-price-cart">${product.cantidad * product.precio}<ion-icon name="logo-euro"></ion-icon></p>
      `;

      modalContainer.append(cartContent);

      let amountContent = document.createElement("div");
      amountContent.className = "box-arrow";
      cartContent.append(amountContent);


      let less = document.createElement("span");
      less.className = "restar";
      less.innerHTML = `<p class="restar"><ion-icon name="caret-back-circle-outline"></ion-icon></p>`;
      amountContent.append(less);

      less.addEventListener("click", ()=> {
        const foundId = cart.find((element) => element.id === product.id)
        console.log(foundId);
        if(product.cantidad == 0){
          product.cantidad == 1;
        }
        else {
          product.cantidad--;
        }
        console.log(product.cantidad);
        cartCounter();
        createCart();
      });


      let more = document.createElement("span");
      more.className = "sumar";
      more.innerHTML = `<p class="sumar"><ion-icon name="caret-forward-circle-outline"></ion-icon></p>`;
      amountContent.append(more);


      more.addEventListener("click", ()=> {
        const foundId = cart.find((element) => element.id === product.id)
        console.log(foundId);
        product.cantidad++;
        console.log(product.cantidad);
        cartCounter();
        createCart();
      });

      let eliminar = document.createElement("buttom");
      eliminar.className = "btn-delete";
      eliminar.innerHTML = `<ion-icon name="trash"></ion-icon>`;
      cartContent.append(eliminar);

      eliminar.addEventListener("click", eliminarProducto);



  });

  const total =cart.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
  const totalBuying = document.createElement('div');
  totalBuying.className = "total-content";

  totalBuying.innerHTML = `
  <p class="total">Total a pagar: ${total}<ion-icon name="logo-euro"></ion-icon></p>`;

  modalContainer.append(totalBuying);


  //Logica para enviar el pedido por Telegram
  //Contenedor del pedido
  let message = [];
  const enviarPedido = document.createElement("a");
  enviarPedido.innerHTML = `<buttom class="btn-pedido"><ion-icon name="checkmark-circle"></ion-icon>Completar<ion-icon name="checkmark-circle"></ion-icon></buttom>`;
  const sendBtn = document.querySelector(".btn-pedido");

  enviarPedido.addEventListener("click", () => {
    if(cart != ''){
      cart.forEach((product) => {
        let nombreProducto = product.nombre;
        let unidades =  "*x*" + product.cantidad;
        let precioPorcantidad = ': ' + (product.cantidad * product.precio) + '€';
        pedido ="\u2705" +' '+ nombreProducto+ '  ' + unidades+ '  ' + precioPorcantidad;
        message = message +'%0A'+ pedido;
        console.log(message);
      });


      var textInfo_ = document.querySelector(".input-textarea").value;
      console.log(textInfo_);
      if(textInfo_ != ''){
        const Transalte = async (textInfo_) => {
          const encodedParams = new URLSearchParams();
          encodedParams.append("source_language", "en");
          encodedParams.append("target_language", "es");
          encodedParams.append("text", textInfo_);

          const OPTIONS = {
            method: 'POST',
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'X-RapidAPI-Key': '160450d500mshd58d3f2536f0599p10d7a2jsnbdf903c72e4a',
              'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
            },
            body: encodedParams
          };

          var res = await fetch("https://text-translator2.p.rapidapi.com/translate", OPTIONS);
          var textInfoTransalte = await res.json();
          console.log(textInfoTransalte);
          var textInfo = "\u26A0" + "*Aclaraciones: *" + "\u26A0" + "%0A" + textInfoTransalte;
          return textInfo;
        }

        var textInfo = Transalte(textInfo_);

      }
      else{
        textInfo = "\u26A0" + "*Aclaraciones: *"+ "\u26A0" + "%0ANo%20hay%20aclaraciones%20por%20parte%20del%20cliente";
      }


      var now = new Date();
      now = now.toString();
      var day = now.slice(4,15);
      var hour = now.slice(16,24);
      var time = "\uD83D\uDDD3" + "*Fecha:* " + day + "%0A" + "\u23F0" + "*Hora:* " + hour;
      var mesa = localStorage.getItem("number_value");
      //var token = "5698810751:AAHgHB_dnM9HLNIzHWzhcj3IijFDbDqg3YM";
      //var chat_id = -797402909;
      var address = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=\u2757*PEDIDO%20DE%20MARYS%20CAFE*\u2757%0A%0A${time}%0A%0A\uD83D\uDC49\uD83C\uDFFB*Para%20Mesa:*%20${mesa}\uD83D\uDC48\uD83C\uDFFB%0A${message}%0A%0A${textInfo}%0A%0A\uD83E\uDD11*Total a pagar:*%20${total}%20€\uD83E\uDD11&parse_mode=markdown`;
      let api = new XMLHttpRequest();
      api.open("GET", address, true);
      api.send();


      $(".cofirm-content").addClass("show");
      $(".modal-container").addClass("cart-hidden");
      resetCart();
    }
    else {
      $(".alert-content").addClass("visible");
    }

  })


  totalBuying.append(enviarPedido);


  //Ocular verCarrito
  const btnClose = document.querySelector(".modal-btn-close");
  btnClose.addEventListener("click", () =>{
    modalContainer.classList.add("cart-hidden");
  });


};


verCarrito.addEventListener("click",createCart);

//Funcion de eliminar producto por ID
const eliminarProducto = () => {
  const foundId = cart.find((element) => element.id);
  console.log(foundId);
  cart = cart.filter((cartId) => {
    return cartId !== foundId;
  });
  cartCounter();
  createCart();
};

const resetCart = () => {
  cart = [];
  cartCounter();
  return cart;
  createCart();
}

//Aumentar productos
const aumentar = () => {
  const foundId = cart.find((element) => element.id === product.id)
  console.log(foundId);
  cart.filter((cartId) => {
    return cartId !== foundId;
  });
  //cartCounter();
  //createCart();
}


//Cart counter
const cartCounter = () => {
  cantCarrito.style.display = "block";
  const itemSelect =cart.reduce((acc, el) => acc + el.cantidad, 0);
  cantCarrito.innerHTML = itemSelect;
}
