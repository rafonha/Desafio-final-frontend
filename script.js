//O que falta fazer: 
// 3. Pegar latutude e longitude de cidade de origem e destino

//Constantes
const numberFormatter = new Intl.NumberFormat('pt-BR');
const moneyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

// Variáveis
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
let children = document.querySelector('#num-criancas');
let costTicketAdult = 0;
let costTicketChild = 0;
let totalCost = 0;
let results = document.querySelector('#resultado');
let countTotalTrips = document.querySelector('#countTotalTrips');
let miles = 0;
let milesCost = 0;

// Funções auxiliares
function helperFormatValue(value) {
    return numberFormatter.format(value);
}
  
function helperFormatMoney(value) {
    return moneyFormatter.format(value);
}

// Funções 
function degreesToRadians(degreeValue) {
    return degreeValue * (Math.PI / 180);
} 

function updateMilesInput(val) {
    miles = val; 
    renderResults();
}

function ticketWithMiles() {
    milesCost = miles * 0.02;
    totalCost = totalCost - milesCost;
    milesCost = helperFormatMoney(milesCost)
}

// Função para iniciar a aplicação
async function start() {
    await fetchCountries()
}

// Pegar as informações do json
async function fetchCountries(){
    const resource = await fetch('http://localhost:3001/countries');
    const json = await resource.json();

    allTrips = json;
    render();
}

// Renderizar as funções
function render() {

    renderCountryOption();
    renderCityOption();
    renderLatAndLon();
    renderDistance();
    renderPrice();
    renderResults();
}

// Pegar as informações do JSON e renderizar os países
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

// Pegar as informações do JSON e renderizar as cidades do país de origem e destino
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
    }

    cityOrigin.innerHTML = cityOriginHTML;
    cityDestination.innerHTML = cityDestinationHTML;

    renderResults();
}

// Pegar as informações do JSON e renderizar a latitude / longitude 
function renderLatAndLon() {

    const cityOrig = allTrips.forEach(country => country.cities.filter(city => city.city === cityOrigin.value))
    latOrigin = cityOrig.latitude
    lonOrigin = cityOrig.longitude

    const cityDest = allTrips.forEach(country => country.cities.filter(city => city.city === cityDestination.value))
    latDestination = cityDest.latitude
    lonDestination = cityDest.longitude
}

//Renderizar a distância 
function renderDistance() {
    const EARTH_RADIUS = 6_371.071; // Earth

    const diffLatitudeRadians = degreesToRadians(
      latDestination - latOrigin
    );
  
    const diffLongitudeRadians = degreesToRadians(
      lonDestination - lonOrigin
    );
  
    const originLatitudeRadians = degreesToRadians(latDestination);
    const destinationLatitudeRadians = degreesToRadians(lonDestination);
  
    const kmDistance =
      2 *
      EARTH_RADIUS *
      Math.asin(
        Math.sqrt(
          Math.sin(diffLatitudeRadians / 2) * Math.sin(diffLatitudeRadians / 2) +
            Math.cos(originLatitudeRadians) *
              Math.cos(destinationLatitudeRadians) *
              Math.sin(diffLongitudeRadians / 2) *
              Math.sin(diffLongitudeRadians / 2)
        )
      );
  
    distance = kmDistance.toFixed(2)
}

// Renderizar o preço
function renderPrice() {    
    countryOrigin.value === countryDestination.value ? costTicketAdult = distance * 0.3 : costTicketAdult = distance * 0.5;
    countryOrigin.value === countryDestination.value ? costTicketChild = distance * 0.15 : costTicketChild = distance * 0.25;

    if (radioFirstClass.checked) {
        costTicketAdult = helperFormatMoney(costTicketAdult * 1.8);
        costTicketChild = helperFormatMoney(costTicketChild * 1.4);
    }

    totalCost = (costTicketAdult * adults.value) + (costTicketChild * children.value);
    
    miles !== 0 && ticketWithMiles();

    costTicketAdult = helperFormatMoney(costTicketAdult)
    costTicketChild = helperFormatMoney(costTicketChild)
    totalCost = helperFormatMoney(totalCost)
    miles = helperFormatValue(miles)
};

//Template literals com os resultados
function renderResults() {
    renderPrice()
    //se cidade igual de origem e destino
    if (cityOrigin.value === cityDestination.value) {
        results.innerHTML = `
        <h2>Atenção</h2>
        <p>Não é possível viajar para a mesma cidade de origem</p>
        `
    } else {
        results.innerHTML = `
        <h2>Resumo da viagem</h2>
        <p>Origem: ${countryOrigin.value}</p>
        <p>Destino: ${countryDestination.value} </p>
        <p>Distância: ${distance}km</p>
        <p>${adults.value} adultos, ${children.value} crianças</span></p>
        <p>Tipo de voo: Classe ${radioFirstClass.checked ? 'Executiva' : 'Econômica'}</p>
        <p>${costTicketAdult} por adulto</p>
        <p>${costTicketChild} por criança</p>
        <p>Valor total das passagens: ${totalCost}</p>
        <p>Quantidade de milhas usadas: ${miles} milhas</p>
        <p>Valor economizado por milhas: ${milesCost}</p>
        `
    }
}

start();