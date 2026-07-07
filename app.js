let data={
shops:[],
products:[]
};

let currentUser=null;

function register(){

let user=document.getElementById("user").value;
let pass=document.getElementById("pass").value;

if(!user || !pass){

alert("Bitte Daten eingeben");
return;

}

localStorage.setItem(
"account",
JSON.stringify({
user:user,
pass:pass
})
);

alert("Registrierung erfolgreich");

}

function login(){

let account=
JSON.parse(localStorage.getItem("account"));

let user=document.getElementById("user").value;
let pass=document.getElementById("pass").value;

if(account &&
account.user===user &&
account.pass===pass){

currentUser=user;

document.getElementById("login").style.display="none";

document.getElementById("app").style.display="block";

document.getElementById("username").textContent=user;

loadData();

}

else{

alert("Login fehlgeschlagen");

}

}

function loadData(){

let saved=
localStorage.getItem(
"shopping_"+currentUser
);

if(saved){

data=JSON.parse(saved);

}

render();

}

function save(){

localStorage.setItem(
"shopping_"+currentUser,
JSON.stringify(data)
);

}

function addShop(){

let name=prompt("Name des Ladens:");

if(!name)return;

data.shops.push(name);

save();

render();

}

function addProduct(){

if(data.shops.length===0){

alert("Bitte zuerst einen Laden erstellen");
return;

}

let name=prompt("Produktname:");

let amount=prompt("Anzahl:");

let shop=prompt(
"Laden auswählen:\n\n"+
data.shops.join("\n")
);

if(!name ||
!amount ||
!data.shops.includes(shop)) return;

data.products.push({

name:name,
count:Number(amount),
shop:shop

});

save();

render();

}

function changeAmount(index,value){

data.products[index].count+=value;

if(data.products[index].count<=0){

data.products.splice(index,1);

}

save();

render();

}

function removeProduct(index){

data.products.splice(index,1);

save();

render();

}

function render(){

let shops=document.getElementById("shops");

shops.innerHTML="";

data.shops.forEach(shop=>{

let div=document.createElement("div");

div.className="shop";

div.textContent=shop;

shops.appendChild(div);

});

let products=document.getElementById("products");

products.innerHTML="";

data.products.forEach((p,index)=>{

let div=document.createElement("div");

div.className="product";

div.innerHTML=

` <span>
${p.name} (${p.count})<br>
🏪 ${p.shop} </span>

<div class="actions">

<button onclick="changeAmount(${index},1)">
+
</button>

<button onclick="changeAmount(${index},-1)">
-
</button>

<button onclick="removeProduct(${index})">
🗑
</button>

</div>
`;

products.appendChild(div);

});

}

function showPage(page){

document.querySelectorAll(".page")
.forEach(p=>p.classList.add("hidden"));

document.getElementById(page)
.classList.remove("hidden");

}

function logout(){

currentUser=null;

document.getElementById("app").style.display="none";

document.getElementById("login").style.display="block";

}
