const supabaseClient = supabase.createClient(
"https://alzdmqmzaoglexlalrzd.supabase.co",
"sb_publishable_sJT2Vrd4lvQDD2GiqLMQYA_oS-4WF7f"
);


// ===================================
// TEST SUPABASE
// ===================================

async function testSupabase(){

const { data, error } =
await supabaseClient
.from("products")
.select("*");

console.log("Supabase Daten:", data);
console.log("Supabase Fehler:", error);

}

testSupabase();


// ===================================
// DATEN
// ===================================

let data = {
shops: [],
products: []
};

let currentUser = null;


// ===================================
// REGISTRIEREN
// ===================================

// ===================================
// REGISTRIEREN
// ===================================

async function register(){

let username =
document.getElementById("user").value;

let password =
document.getElementById("pass").value;


if(!username || !password){

alert(
"Bitte Benutzername und Passwort eingeben"
);

return;

}


// interne E-Mail erzeugen
let email =
username + "@app.local";


const { data, error } =
await supabaseClient.auth.signUp({

email: email,

password: password

});


if(error){

console.log(error);

alert(error.message);

return;

}


console.log("User erstellt:", data.user);


// Benutzername speichern

const { error: profileError } =
await supabaseClient
.from("profiles")
.insert({

id: data.user.id,

username: username

});


if(profileError){

console.log(profileError);

alert(profileError.message);

return;

}


alert(
"Registrierung erfolgreich"
);


}
// ===================================
// LOGIN
// ===================================

async function login(){

let username =
document.getElementById("user").value;


let password =
document.getElementById("pass").value;


// interne E-Mail wieder erzeugen
let email =
username + "@app.local";


const {
data: loginData,
error
} =
await supabaseClient.auth.signInWithPassword({

email: email,

password: password

});


if(error){

console.log(error);

alert(
"Login fehlgeschlagen"
);

return;

}


currentUser =
loginData.user.id;


document.getElementById("login")
.style.display="none";


document.getElementById("app")
.style.display="block";


document.getElementById("username")
.textContent=username;


await loadData();


showPage("home");


}
// ===================================
// DATEN LADEN (SUPABASE)
// ===================================

async function loadData(){

const { data: products, error } =
await supabaseClient
.from("products")
.select("*")
.eq(
"user_id",
currentUser
);



if(error){

console.log(error);

return;

}



data.products = products || [];


data.shops = [
...new Set(
data.products.map(
p => p.shop
)
)
];


data.shops.sort(
(a,b)=>a.localeCompare(b)
);


render();

}
// ===================================
// LEERE ALTE SPEICHERFUNKTION
// ===================================

function saveData(){

// nicht mehr benötigt

}


// ===================================
// LADEN HINZUFÜGEN
// ===================================

function addShop(){

let name =
prompt(
"Name des Ladens:"
);


if(!name)
return;


name = name.trim();


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


render();

}


// ===================================
// LADEN LÖSCHEN
// ===================================

async function deleteShop(index){

let shopName =
data.shops[index];


const { error } =
await supabaseClient
.from("products")
.delete()
.eq(
"shop",
shopName
)
.eq(
"user_id",
currentUser
);


if(error){

console.log(error);
return;

}


await loadData();

}
// ===================================
// PRODUKT FENSTER ÖFFNEN
// ===================================

function addProduct(){

if(data.shops.length === 0){

alert(
"Bitte zuerst einen Laden erstellen"
);

return;

}


let select =
document.getElementById(
"productShop"
);


select.innerHTML = "";


data.shops.forEach(shop => {

let option =
document.createElement("option");


option.value = shop;
option.textContent = shop;


select.appendChild(option);

});


document.getElementById(
"productModal"
)
.classList.remove("hidden");


}


// ===================================
// MENGE ÄNDERN
// ===================================

async function changeAmount(index,value){

let product =
data.products[index];


if(
value === -1 &&
product.count <= 1
){

return;

}


let newAmount =
product.count + value;


const { error } =
await supabaseClient
.from("products")
.update({
count: newAmount
})
.eq(
"id",
product.id
)
.eq(
"user_id",
currentUser
);

if(error){

console.log(error);
return;

}


await loadData();

}


// ===================================
// PRODUKT LÖSCHEN
// ===================================

async function removeProduct(index){

let product =
data.products[index];


const { error } =
await supabaseClient
.from("products")
.delete()
.eq(
"id",
product.id
)
.eq(
"user_id",
currentUser
);


if(error){

console.log(error);
return;

}


await loadData();

}


// ===================================
// RENDER
// ===================================

function render(){

let shopsBox =
document.getElementById("shops");


let shopList =
document.getElementById("shopList");


let productsBox =
document.getElementById("products");


shopsBox.innerHTML = "";
shopList.innerHTML = "";
productsBox.innerHTML = "";



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
data.products.findIndex(
p => p.id === product.id
);



let item =
document.createElement("div");


item.className="product";


item.innerHTML=


`

<div class="product-line">

<b>
${product.produktname}
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
 
// ===================================
// SEITE WECHSELN
// ===================================

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



if(page==="home")
title.textContent="Liste";


if(page==="shopsPage")
title.textContent="Meine Läden";


if(page==="settings")
title.textContent="Einstellungen";


}


// ===================================
// LOGOUT
// ===================================

async function logout(){

await supabaseClient.auth.signOut();


currentUser = null;


document.getElementById("app")
.style.display = "none";


document.getElementById("login")
.style.display = "block";

}
// ===================================
// MODAL SCHLIESSEN
// ===================================

function closeProductModal(){

document.getElementById("productName").value="";
document.getElementById("productAmount").value="";
document.getElementById("productNote").value="";


document.getElementById("productModal")
.classList.add("hidden");


}


// ===================================
// PRODUKT SPEICHERN
// ===================================

async function saveProduct(){

    let name = 
    document.getElementById("productName").value.trim();


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


    // Prüfen welcher User angemeldet ist
    const { data: userData, error: userError } =
    await supabaseClient.auth.getUser();


    console.log("Supabase User:", userData.user);
    console.log("currentUser:", currentUser);


    if(userError || !userData.user){

        alert(
            "Kein Benutzer angemeldet"
        );

        console.log(userError);

        return;

    }


    const { error } =
    await supabaseClient
    .from("products")
    .insert({

        user_id: userData.user.id,

        produktname: name,

        count: amount,

        unit: unit,

        shop: shop,

        note: note

    });



    if(error){

        console.log("SUPABASE FEHLER:", error);

        alert(error.message);

        return;

    }


    console.log("Produkt erfolgreich gespeichert");


    await loadData();



    document.getElementById("productName").value="";
    document.getElementById("productAmount").value="";
    document.getElementById("productNote").value="";


    document.getElementById("productModal")
    .classList.add("hidden");


}
