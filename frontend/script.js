let countryOrigin = document.querySelector('#pais-origem');
let countryDestination = document.querySelector('#pais-destino');
let cityOrigin = document.querySelector('#cidade-origem');
let cityDestination = document.querySelector('#cidade-origem');
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
let totalcost = 0;
let results = document.querySelector('#resultado');
let countTotalTrips = document.querySelector('#countTotalTrips');

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

countryOrigin.addEventListener('input', (event) => {
    countryOrigin = event.target.value
});

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
    console.log(allTrips)

    renderCountryOptions();
    renderCityOptions();
    // renderPrice();
    renderResults();
}

function renderCountryOptions() {

    let contriesHTML = ''

    allTrips.forEach(countryOption => {
        const { country } = countryOption;

        const contryHTML = `<option value="${country}">${country}</option>`
        contriesHTML += contryHTML
    })

    countryOrigin.innerHTML = contriesHTML;
    countryDestination.innerHTML = contriesHTML;
}

function renderCityOptions() {

    let countryOriginChosen = countryOrigin.value
    let countryDestinationChosen = countryDestination.value
    let cityOriginHTML = ''
    let cityDestinationHTML = ''

    // allTrips.forEach(cityOption => {
    //     const { cities } = cityOption;

    //     const contryHTML = `<option value="${country}">${country}</option>`
    //     contriesHTML += contryHTML
    // })

    cityOrigin.innerHTML = cityOriginHTML;
    cityDestination.innerHTML = cityDestinationHTML;
}

function renderPrice(countryOrigin, countryDestination, latOrigin, latDestination, longOrigin, longDestination, classTicket, totalcost, adults, childrem) {
    let totalCostForAdults = 0;
    let totalCostForChildrem = 0;

    if (countryOrigin === countryDestination) {
        costTicketAdult = distance * 0.3;
        costTicketChild = distance * 0.15;
    } else {
        costTicketAdult = distance * 0.5;
        costTicketChild = distance * 0.25;
    }

    if (radioFirstClass.checked) {
        costTicketAdult = costTicketAdult * 1.8;
        costTicketChild = costTicketChild * 1.4;
    }

    totalCostForAdults = costTicket * adults;
    totalCostForChildrem = costTicket * childrem;

    totalcost = totalCostForAdults + totalCostForChildrem

    return totalCost, costTicketAdult, totalCostForAdults, costTicketChild, totalCostForChildrem;
};

function renderResults() {
    results.innerHTML = `
    <h2>Resumo da viagem</h2>
    <p>Origem: ${countryOrigin.value}</p>
    <p>Destino: ${countryDestination.value} </p>
    <p>${adults.value} adultos, ${childrem.value} crianças</span></p>
    <p>Tipo de voo: Classe ${radioFirstClass.checked ? 'Executiva' : 'Econômica'}</p>
    <p>R$ ${costTicketAdult} por adulto</p>
    <p>R$ ${costTicketChild} por criança</p>
    <p>Valor total das passagems: R$ ${totalcost}</p>
    <label for="miles">Deseja usar milhas?</label>
    <input type="range" name="miles" id="miles" min="0" max="100000" value="0">
    `
}

function ticketWithMiles(miles, totalCost) {
    return console.log(totalCost - (miles * 0.02));
}

function calcMaxMiles(totalCost) {
    return totalCost / 0.02;
}

function calcDistance(latOrigin, lonOrigin, latDestination, lonDestination) {
    var difflat = latDestination-latOrigin; // Radian difference (latitudes)
    var difflon = lonDestination-lonOrigin; // Radian difference (longitudes)

    var distance = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(latOrigin)*Math.cos(latDestination)*Math.sin(difflon/2)*Math.sin(difflon/2)));

    return distance;
}

start();