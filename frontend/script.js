//O que falta fazer: 
// 1. Fazer com que as informações se alterem quando o valor é alterado
// 2. Remover cidade igual quando viagem para mesmo país
// 3. Pegar latutude e longitude de cidade de origem e destino
// 4. Fazer milhas funcionar

let countryOrigin = document.querySelector('#pais-origem');
let countryDestination = document.querySelector('#pais-destino');
let cityOrigin = document.querySelector('#cidade-origem');
let cityDestination = document.querySelector('#cidade-destino');
let distance = 0;
let latOrigin = null;
let lonOrigin = null;
let latDestination = null;
let lonDestination = null;
let radioEconomicClass = document.querySelector('#classe-economica');
let radioFirstClass = document.querySelector('#classe-executiva');
let adults = document.querySelector('#num-adultos');
let childrem = document.querySelector('#num-criancas');
let costTicketAdult = 0;
let costTicketChild = 0;
let totalCost = 0;
let results = document.querySelector('#resultado');
let countTotalTrips = document.querySelector('#countTotalTrips');
let maxMiles = 0;

function increaseAdult() {
    parseInt(adults.value, 10);
    adults = isNaN(adults) ? 0 : adults;
    adults++;
    document.querySelector('#num-adultos').value = adults;
}

function decreaseAdult() {
    parseInt(adults.value, 10);
    adults = isNaN(adults) ? 0 : adults;
    adults < 2 ? adults = 2 : '';
    adults--;
    document.querySelector('#num-adultos').value = adults;
}

function increaseChild() {
    parseInt(childrem.value, 10);
    childrem = isNaN(childrem) ? 0 : childrem;
    childrem++;
    document.querySelector('#num-criancas').value = childrem;
}

function decreaseChild() {
    parseInt(childrem.value, 10);
    childrem = isNaN(childrem) ? 0 : childrem;
    childrem < 1 ? childrem = 1 : '';
    childrem--;
    document.querySelector('#num-criancas').value = childrem;
}

function updateMilesInput(val) {
    document.querySelector('#milesValue').value=val; 
  }

async function start() {

    await fetchCountries()
}

async function fetchCountries(){
    const resource = await fetch('http://localhost:3001/countries');
    const json = await resource.json();

    allTrips = json;
    render();
}

function render() {

    renderCountryOption();
    renderCityOption();
    renderDistance();
    renderPrice();
    renderResults();
}

function renderCountryOption() {

    let contriesHTML = ''

    allTrips.forEach(countryOOption => {
        const { country } = countryOOption;

        const contryOHTML = `<option value="${country}">${country}</option>`
        contriesHTML += contryOHTML
    })

    countryOrigin.innerHTML = contriesHTML;
    countryDestination.innerHTML = contriesHTML;
}

function renderCityOption() {
    let cityOriginHTML = ''
    let cityDestinationHTML = ''

    for (let i = 0; i < allTrips.length; i++) {
        if(allTrips[i].country === countryOrigin.value){
            allTrips[i]['cities'].forEach(cityOption => {
                const { city } = cityOption;
        
                const cityOHTML = `<option value="${city}">${city}</option>`
                cityOriginHTML += cityOHTML
            })
        } 

        if(allTrips[i].country === countryDestination.value){
            allTrips[i]['cities'].forEach(cityOption => {
                const { city } = cityOption;
        
                const cityDHTML = `<option value="${city}">${city}</option>`
                cityDestinationHTML += cityDHTML
            })
        } 

        //remover a cidade igual
    }

    cityOrigin.innerHTML = cityOriginHTML;
    cityDestination.innerHTML = cityDestinationHTML;
}

function renderDistance() {
    // pegar latutude e longitude de cidade de origem e destino
    // console.log(allTrips[0].cities[0].latitude)

    for (let i = 0; i < allTrips[i].length; i++) {
        for (let j = 0; j < array.length; j++) {
            if(allTrips[i].cities[j] === cityOrigin.value) {
                latOrigin = allTrips[i].cities[j].latitude
                lonOrigin = allTrips[i].cities[j].longitude
                console.log('latOrigin' + latOrigin + ', lonOrigin' + lonOrigin)
            }
        }
    }

    // teste
    latDestination = -23.54;
    latOrigin = -29.36;
    lonDestination = -50.87;
    lonOrigin = -34.88;

    //cálculo de distância

    var R = 6371.0710; // Radial da terra em quilômetros
    var difflat = latDestination-latOrigin; // Diferença em radial (latitudes)
    var difflon = lonDestination-lonOrigin; // Diferença em radial (longitudes)

    distance = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(latOrigin)*Math.cos(latDestination)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    distance = distance.toFixed(2)
}

function renderPrice() {    
    let totalCostForAdults = 0;
    let totalCostForChildrem = 0;
    // console.log(`distance: ${distance}, countryOrigin: ${countryOrigin.value}, countryDestination: ${countryDestination.value}`)

    if (countryOrigin.value === countryDestination.value) {
        costTicketAdult = parseInt(distance * 0.3).toFixed(2);
        costTicketChild = parseInt(distance * 0.15).toFixed(2);
    } else {
        costTicketAdult = parseInt(distance * 0.5).toFixed(2);
        costTicketChild = parseInt(distance * 0.25).toFixed(2);
    }
    // console.log(`costTicketAdult: ${costTicketAdult}, costTicketChild: ${costTicketChild}`)

    if (radioFirstClass.checked) {
        costTicketAdult = costTicketAdult * 1.8;
        costTicketChild = costTicketChild * 1.4;
    }

    totalCostForAdults = costTicketAdult * parseInt(adults.value);
    totalCostForChildrem = costTicketChild * parseInt(childrem.value);

    totalCost = totalCostForAdults + totalCostForChildrem
    totalCost = totalCost.toFixed(2)
    // console.log(`totalCost ${totalCost}`)
};

function renderResults() {
    // fazer milhas funcionar
    results.innerHTML = `
    <h2>Resumo da viagem</h2>
    <p>Origem: ${countryOrigin.value}</p>
    <p>Destino: ${countryDestination.value} </p>
    <p>Distância: ${distance}km</p>
    <p>${adults.value} adultos, ${childrem.value} crianças</span></p>
    <p>Tipo de voo: Classe ${radioFirstClass.checked ? 'Executiva' : 'Econômica'}</p>
    <p>R$ ${costTicketAdult} por adulto</p>
    <p>R$ ${costTicketChild} por criança</p>
    <p>Valor total das passagens: R$ ${totalCost}</p>
    <label for="miles">Deseja usar milhas?</label>
    <div class="flex">
        <input type="range" name="miles" id="miles" min="0" max="10000" value="0" onchange="updateMilesInput(this.value)";>
        <input type="text" id="milesValue" value="0">
    </div> 
    `
}

function ticketWithMiles(miles, totalCost) {
    return console.log(totalCost - (miles * 0.02));
}

function calcMaxMiles(totalCost) {
    maxMiles = totalCost / 0.02;
}

start();