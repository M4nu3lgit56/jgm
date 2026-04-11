
let c=0;
let textos={};

function agregar(){
    c++;
    let div=document.createElement('div');
    div.className='card';
    div.innerHTML=`
        <div class="row">
            <input id="color${c}" placeholder="Color">
            <input id="cant${c}" type="number" placeholder="Cantidad">
        </div>
    `;
    document.getElementById('gorras').appendChild(div);
}

agregar();

function formato(num){
    return num.toLocaleString('es-CO');
}

function medida(valor){
    if(valor < 1){
        return (valor * 100).toFixed(0) + " cm";
    }
    return valor.toFixed(2) + " mt";
}

function calcular(){

let totalInv=0;
let totalGan=0;
let html="";
textos={};

let precios={
tela:+tela.value,
lino:+lino.value,
pimpon:+pimpon.value,
visera:+visera.value,
correa:+correa.value,
boton:+boton.value,
marquilla:+marquilla.value,
bandera:+bandera.value,
etiqueta:+etiqueta.value,
sesgoE:+sesgoE.value,
sesgoT:+sesgoT.value,
tira:+tira.value
};

for(let i=1;i<=c;i++){

let cant=+document.getElementById(`cant${i}`).value;
let color=document.getElementById(`color${i}`).value;

if(!cant) continue;

// conversiones
let telaMt = cant / 10;
let linoMt = cant / 55;
let pimponMt = cant / 55;
let viseras = cant;
let correas = cant;
let botones = cant;
let marquillas = cant;
let banderas = cant;
let etiquetas = cant;
let sesgoEMt = cant;
let sesgoTMt = cant / 4;
let tiraMt = (cant * 60) / 100;
let inputPrecioVenta = document.getElementById('precioVenta');

// costos
let costoUnitario = Object.values(precios).reduce((a,b)=>a+b,0);
let inversion = costoUnitario * cant;
let precioVenta = costoUnitario + (+inputPrecioVenta.value || 0);
let ganancia = (precioVenta - costoUnitario) * cant;

totalInv += inversion;
totalGan += ganancia;

// guardar texto individual
textos[i] = `
Color: ${color}
Cantidad: ${cant}

Inversión: $${formato(inversion)}
Precio unitario: $${formato(costoUnitario)}
Precio venta: $${formato(precioVenta)}
Ganancia: $${formato(ganancia)}
`;

html+=`
<div class="result" id="bloque${i}">

<h3>Color: ${color}</h3>

<p><b>Materiales:</b></p>
<ul>
<li>Tela: ${medida(telaMt)}</li>
<li>Lino Flex: ${medida(linoMt)}</li>
<li>Pimpón: ${medida(pimponMt)}</li>
<li>Viseras: ${viseras} und</li>
<li>Correas: ${correas} und</li>
<li>Botones: ${botones} und</li>
<li>Marquillas: ${marquillas} und</li>
<li>Banderas: ${banderas} und</li>
<li>Etiquetas: ${etiquetas} und</li>
<li>Sesgo estampado: ${medida(sesgoEMt)}</li>
<li>Sesgo trasero: ${medida(sesgoTMt)}</li>
<li>Tira: ${medida(tiraMt)}</li>
</ul>

<p>Inversión: $${formato(inversion)}</p>
<p>Precio unitario: $${formato(costoUnitario)}</p>
<p>Precio de venta: $${formato(precioVenta)}</p>
<p>Ganancia: $${formato(ganancia)}</p>

<div class="actions">
<button class="copy" onclick="copiarBloque(${i})">Copiar</button>
<button class="img" onclick="descargarBloque(${i})">Imagen</button>
</div>

</div>
`;
}

html+=`
<div class="result">
<h2>Total</h2>
<p>Inversión: $${formato(totalInv)}</p>
<p>Ganancia: $${formato(totalGan)}</p>
</div>
`;

document.getElementById('resultado').innerHTML=html;

}

function copiarBloque(i){
    const bloque = document.getElementById(`bloque${i}`);
    navigator.clipboard.writeText(bloque.innerText);
    alert("Copiado");
}

function descargarBloque(i){
    let boton1=document.querySelector(`#bloque${i} .img`);
        let boton2=document.querySelector(`#bloque${i} .copy`);
        boton1.style.display='none';
        boton2.style.display='none';
    html2canvas(document.getElementById(`bloque${i}`)).then(canvas=>{
        let link=document.createElement('a');
        link.download=`color_${i}.png`;
        link.href=canvas.toDataURL();
        link.click();
        boton1.style.display='inline-block';
        boton2.style.display='inline-block';
    });
}
