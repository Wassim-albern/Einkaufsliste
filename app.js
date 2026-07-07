let data = {
    shops: [],
    products: []
};


let currentUser = null;





// REGISTRIEREN

function register(){

    let username =
    document.getElementById("user").value;


    let password =
    document.getElementById("pass").value;



    if(!username || !password){

        alert("Bitte Benutzer und Passwort eingeben");
        return;

    }



    localStorage.setItem(
        "account",
        JSON.stringify({
            username:username,
            password:password
        })
    );


    alert("Registrierung erfolgreich");

}







// LOGIN

function login(){


    let account =
    JSON.parse(
        localStorage.getItem("account")
    );



    let username =
    document.getElementById("user").value;


    let password =
    document.getElementById("pass").value;




    if(
        account &&
        account.username===username &&
        account.password===password
    ){


        currentUser=username;


        document.getElementById("login")
        .style.display="none";


        document.getElementById("app")
        .style.display="block";


        document.getElementById("username")
        .textContent=username;



        loadData();


        showPage("home");


    }
    else{

        alert("Login fehlgeschlagen");

    }

}








// DATEN LADEN

function loadData(){


    let saved =
    localStorage.getItem(
        "shopping_"+currentUser
    );



    if(saved){

        data=JSON.parse(saved);

    }



    // alte doppelte Läden entfernen

    data.shops=[
        ...new Set(data.shops)
    ];



    // alphabetisch sortieren

    data.shops.sort(
        (a,b)=>a.localeCompare(b)
    );



    saveData();


    render();


}








// SPEICHERN

function saveData(){


    localStorage.setItem(

        "shopping_"+currentUser,

        JSON.stringify(data)

    );

}








// LADEN HINZUFÜGEN

function addShop(){


    let name =
    prompt(
        "Name des Ladens:"
    );


    if(!name)
        return;



    name=name.trim();



    if(data.shops.includes(name)){


        alert(
            "Dieser Laden existiert bereits"
        );


        return;

    }



    data.shops.push(name);



    data.shops.sort(
        (a,b)=>a.localeCompare(b)
    );



    saveData();

    render();


}










// LADEN LÖSCHEN

function deleteShop(index){


    let shopName =
    data.shops[index];



    data.shops.splice(index,1);



    data.products =
    data.products.filter(
        p=>p.shop!==shopName
    );



    saveData();

    render();


}









// PRODUKT FENSTER ÖFFNEN

function addProduct(){


    if(data.shops.length===0){


        alert(
            "Bitte zuerst einen Laden erstellen"
        );


        return;

    }




    let select =
    document.getElementById(
        "productShop"
    );



    select.innerHTML="";



    data.shops.forEach(shop=>{


        let option =
        document.createElement("option");


        option.value=shop;

        option.textContent=shop;


        select.appendChild(option);


    });




    document.getElementById(
        "productModal"
    )
    .classList.remove("hidden");


}










// MENGE ÄNDERN

function changeAmount(index,value){


    let product =
    data.products[index];



    if(
        value===-1 &&
        product.count<=1
    ){

        return;

    }



    product.count+=value;



    saveData();

    render();


}










// PRODUKT LÖSCHEN

function removeProduct(index){


    data.products.splice(
        index,
        1
    );



    saveData();

    render();


}









// ANZEIGE

function render(){


    let shopsBox =
    document.getElementById("shops");


    let shopList =
    document.getElementById("shopList");


    let productsBox =
    document.getElementById("products");



    shopsBox.innerHTML="";
    shopList.innerHTML="";
    productsBox.innerHTML="";





    // DESKTOP SIDEBAR

    data.shops.forEach(
    (shop,index)=>{


        let div =
        document.createElement("div");


        div.className="shop";


        div.innerHTML=`

        <span>${shop}</span>

        <span onclick="deleteShop(${index})"
        style="cursor:pointer;font-size:22px">
        ❌
        </span>

        `;



        shopsBox.appendChild(div);



        let list =
        div.cloneNode(true);


        shopList.appendChild(list);



    });










    // PRODUKTE

    data.shops.forEach(
    shop=>{


        let products =
        data.products.filter(
            p=>p.shop===shop
        );



        if(products.length===0)
            return;



        let panel =
        document.createElement("div");



        panel.className="shop-panel";



        panel.innerHTML=
        `
        <h2>
        🏪 ${shop}
        </h2>
        `;




        products.forEach(
        product=>{


            let index =
            data.products.indexOf(product);



            let item =
            document.createElement("div");



            item.className="product";



            item.innerHTML=

            `

            <div class="product-line">

            <b>
            ${product.name}
            </b>


            <span>
            ${product.count} ${product.unit}
            </span>


            </div>



            <div class="note">

            ${product.note || ""}

            </div>



            <div class="actions">


            <span onclick="changeAmount(${index},1)">
            ⬆️
            </span>


            <span onclick="changeAmount(${index},-1)">
            ⬇️
            </span>


            <span onclick="removeProduct(${index})">
            ❌
            </span>


            </div>

            `;



            panel.appendChild(item);



        });



        productsBox.appendChild(panel);



    });


}









// SEITE WECHSELN

function showPage(page){



    document.getElementById("home")
    .classList.add("hidden");


    document.getElementById("shopsPage")
    .classList.add("hidden");


    document.getElementById("settings")
    .classList.add("hidden");




    document.getElementById(page)
    .classList.remove("hidden");




    let title =
    document.getElementById(
        "pageTitle"
    );



    if(page==="home"){

        title.textContent="Liste";

    }


    if(page==="shopsPage"){

        title.textContent="Meine Läden";

    }


    if(page==="settings"){

        title.textContent="Einstellungen";

    }


}









// LOGOUT

function logout(){


    currentUser=null;



    document.getElementById("app")
    .style.display="none";


    document.getElementById("login")
    .style.display="block";


}









// MODAL SCHLIESSEN + LEEREN

function closeProductModal(){


    document.getElementById("productName").value="";


    document.getElementById("productAmount").value="";


    document.getElementById("productNote").value="";



    document.getElementById("productModal")
    .classList.add("hidden");


}









// PRODUKT SPEICHERN

function saveProduct(){


    let name =
    document.getElementById("productName").value;


    let shop =
    document.getElementById("productShop").value;


    let amount =
    Number(
        document.getElementById("productAmount").value
    );


    let unit =
    document.getElementById("productUnit").value;



    let note =
    document.getElementById("productNote").value;




    if(!name || !amount || !shop){

        alert(
            "Bitte alle Felder ausfüllen"
        );

        return;

    }





    data.products.push({

        name:name,

        count:amount,

        unit:unit,

        shop:shop,

        note:note

    });





    saveData();

    render();




    // Fenster bleibt offen,
    // Felder werden geleert


    document.getElementById("productName").value="";

    document.getElementById("productAmount").value="";

    document.getElementById("productNote").value="";


}
