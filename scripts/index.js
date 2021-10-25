// const generatePaginationLi(index) => {
//     return `
//     <li class="pagination-element">${index}
//     </li>`;
// }

// const generatePagination = (heros) =>{
//     let cntOfItems = Math.ceil(heros.length/3);
//     for(let i = 0; i < cntOfItems; i++)
//     {
//         pagination_list.insertAdjacentHTML("beforeend", generatePaginationLi(i+1));
//     }



  let herosList = document.querySelector("#heros");
const IMG_BASE_URL = 'https://starwars-visualguide.com/assets/img/characters/${id}.jpg'
let heros = []
let currentPage;
let notesOnPages = 3;
let paginationUl = document.querySelector("#pagination");
let paginItems = [];

const generateButtons = (index) => {
    return `
        <div id="list_element_${index}" class="list_element">
            <input type="text" id="input_${index}" />

            <button>
                Change name
            </button>
        </div>
    `
}

const generateHeroLayout = (heroData, index) => {
    const heroUrl = heroData.url
    const splitted = heroUrl.split('/');
    const heroId = splitted[splitted.length - 2];

    const heroImgUrl = IMG_BASE_URL.replace('${id}', heroId);

  return `<li class="hero-element">
    <div>
        <img src="${heroImgUrl}" alt=""/>
    </div>
    <div class="hero-details">
        <span>
        name: ${heroData.name}
        </span>
        <span>
            age: ${heroData.gender}
        </span>
        <span>
            age: ${heroData.birth_year}
        </span>

        ${generateButtons(index)}
    </div>
    </li>`;
};

const generateList = (heros) => {
    herosList.innerHTML = '';
  for (let i = 0; i < heros.length; i++) {
    herosList.insertAdjacentHTML("beforeend", generateHeroLayout(heros[i], i));
  }
};

const handleInputChange = (event) => {
    console.log(event.target.value)
}

const handleBtnClick = (heroName, index) => {
    const hero = heros[index]
    hero.name = heroName;
    generateList(heros)
    const lis = document.querySelectorAll('#heros li')
    const toChangeLi = lis[index]

    toChangeLi.classList.add('red');
}

const generateLi = (innerLi) => {
    paginationUl.insertAdjacentHTML(`beforeend`, `<li>${innerLi}</li>`);
}

const generateLiList = (heros) => {

    for(let i = 1; i < Math.ceil(heros.length / notesOnPages); i++)
    {
        generateLi(i);
    }

    paginItems = document.querySelectorAll(`#pagination li`);

    paginationUl.insertAdjacentHTML(`afterbegin`, `<li class ="disabled">prev</li>`);
    paginationUl.insertAdjacentHTML(`beforeend`, `<li>next</li>`);

}

const createPagination = (heros) => {
    generateLiList(heros);

    paginationUl.firstElementChild.addEventListener('click', function(){

            let start = currentPage.innerHTML-4 * notesOnPages;
            let end = start + notesOnPages;

            currentPage.classList.remove('active');
            currentPage = paginItems[currentPage.innerHTML-2];
            currentPage.classList.add('active');

            checkPrevNext();


            let notes = Array.from(heros).slice(start,end);
            generateList(notes);

    })

    const checkPrevNext = () => {
            if(paginItems[currentPage.innerHTML]==undefined) paginationUl.lastElementChild.classList.add('disabled');
            else paginationUl.lastElementChild.classList.remove('disabled');
            if(paginItems[currentPage.innerHTML-2]==undefined) paginationUl.firstElementChild.classList.add('disabled');
            else paginationUl.firstElementChild.classList.remove('disabled');
    }

    for(let item of paginItems){
        item.addEventListener('click', function() {
            if(currentPage) {
                currentPage.classList.remove('active');
            }

            currentPage = this;
            currentPage.classList.add('active');

            let start = (currentPage.innerHTML - 1 ) * notesOnPages;
            let end = start + notesOnPages;

            checkPrevNext();

            let notes = Array.from(heros).slice(start,end);
            generateList(notes);
        })
    }

    paginationUl.lastElementChild.addEventListener('click', function(){

            let start = currentPage.innerHTML * notesOnPages;
            console.log(currentPage.innerHTML)
            let end = start + notesOnPages;

            currentPage.classList.remove('active');
            currentPage = paginItems[currentPage.innerHTML];
            currentPage.classList.add('active');

            checkPrevNext();

            let notes = Array.from(heros).slice(start,end);
            generateList(notes);
    })
}

fetch("https://swapi.dev/api/people")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    heros = data.results;
    createPagination(heros);
    paginItems[0].click();

    const listElements = document.querySelectorAll('.list_element') 
    
    for(let i = 0; i < listElements.length; i++) {
        const el = listElements[i];
        const [input, button] = el.children

        button.addEventListener('click', () => handleBtnClick(input.value, i))
    }

  });