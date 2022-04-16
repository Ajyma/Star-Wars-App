const $container = document.querySelector('.container');
const $prev = document.querySelector('.prev');
const $next = document.querySelector('.next');
const $allPages = document.querySelector('.allPages');
const $currentPage = document.querySelector('.currentPage');
const $search = document.querySelector('.search');
const $page_input = document.querySelector('.page_input');
const $btn_go = document.querySelector('.btn_go');

const BASE_URL = 'https://swapi.dev/api/'
const COUNT = 82
const ALL_PAGES = Math.ceil(COUNT / 10)
let CURRENT_PAGE = 1
let selectPage = 1

function getUrl(url, query, cb) {
  fetch( `${url}?${query}`)
  .then(res => res.json())
  .then(res => cb(res))
}



window.addEventListener('load', () => {
  getUrl(`${BASE_URL}people/`, 'page=1', cb => {
    console.log(cb);
    return cardTemplate(cb.results)
  })
})

function cardTemplate(base) {
  const template = base.map(item => {
    return `
      <div class="card" onclick="More('${item.url}')">
        <h3 class="title">${item.name}</h3>
        <div class="card-image">
          <img src="https://avatanplus.com/files/resources/original/56821c6b565a7151ec3f035a.png">
        </div>
      </div>
    `
  }).join('')
  $container.innerHTML = template
}

function More(url) {
  getUrl(url, '', cb => {
    $container.innerHTML = `
      <div class="more-block">
        <div class="wrapper">
          <div class="header">
            <div class="more-header">
              <h1>${cb.name}</h1>
              <img src="https://avatanplus.com/files/resources/original/56821c6b565a7151ec3f035a.png">
            </div>
            <ul class="list">
              <li>Height: <span>${cb.height} cm</span></li>
              <li>Weight: <span>${cb.mass} kg</span></li>
              <li>Hair Color: <span>${cb.hair_color}</span></li>
              <li>Eye Color: <span>${cb.eye_color}</span></li>
              <li>Birth Year: <span>${cb.birth_year}</span></li>
              <li>Gender: <span style="${cb.gender == 'male' ? 'color: blue' : 'color: red'}">${cb.gender == 'male' ? 'male' : 'female'}</span></li>
            </ul>
          </div>
          <button onclick="goBack()">Go back</button>
        </div>
      </div>
    `
  })
}

function goBack(){
  window.location.reload()
}

window.addEventListener('load', () => {
  $prev.setAttribute('disabled', true)
  $currentPage.innerHTML = CURRENT_PAGE
  $allPages.innerHTML = ALL_PAGES
})


$next.addEventListener('click', e => {
  e.preventDefault()
  CURRENT_PAGE++

  if (CURRENT_PAGE === ALL_PAGES) {
    $next.setAttribute('disabled', true)
  }
  $prev.removeAttribute('disabled')

  changePage()

  getUrl(`${BASE_URL}/people`, `page=${CURRENT_PAGE}`, cb => {
    cardTemplate(cb.results)
  })
})
$prev.addEventListener('click', e => {
  e.preventDefault()
  console.log('kbkh');
  CURRENT_PAGE--

  if (CURRENT_PAGE === 1) {
    $prev.setAttribute('disabled', true)
  }

  $next.removeAttribute('disabled')

  changePage()

  getUrl(`${BASE_URL}/people`, `page=${CURRENT_PAGE}`, cb => {
    cardTemplate(cb.results)
  })
})


function changePage() {
  $currentPage.innerHTML = CURRENT_PAGE
}

$search.addEventListener('input', e => {
  let val = e.target.value
  getUrl(`${BASE_URL}/people`, `page=${CURRENT_PAGE}`, cb => {
    const filtered = cb.results.filter(item => item.name.includes(val))
    console.log(filtered);
    if(val === filtered[0].name){
      cardTemplate(filtered)
    }else{
      cardTemplate(filtered)
    }
  })
})

$page_input.addEventListener('change', e => {
  selectPage = e.target.value
})

$btn_go.addEventListener('click', e => {
  e.preventDefault();
  if (selectPage.trim() > ALL_PAGES || selectPage.trim() < 1 || selectPage.trim() === CURRENT_PAGE){
    alert('Введите корректную страницу!');
    $page_input.value = ''
  } else {

    CURRENT_PAGE = selectPage.trim()

    $currentPage.innerHTML = selectPage.trim()

    if (selectPage.trim() != 1){
      $prev.removeAttribute('disabled')
    } else {
      $prev.setAttribute('disabled', true)
    }

    if (selectPage.trim() !== ALL_PAGES){
      $next.removeAttribute('disabled')
    } else {
      $next.setAttribute('disabled', true)
    }

    $page_input.value = ''

    getUrl(`${BASE_URL}/people`, `page=${CURRENT_PAGE}`, cb => {
      cardTemplate(cb.results)
    })
  }
  
})
