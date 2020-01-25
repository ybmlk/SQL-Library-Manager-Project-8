const tableList = document.getElementsByTagName('table')[0].childNodes[1];
// an array of table rows
const books = tableList.childNodes;
const pageDiv = document.querySelector('.page');
// number of items listed per page
const numItems = 10;

// General funtion to create, append and add a property to elements
const createElement = (elementName, parentNode, property, value) => {
  const element = document.createElement(elementName);
  element[property] = value;
  parentNode.appendChild(element);
  return element;
};

// Hides all the list items except for ones in a given page
const showPage = (list, page) => {
  const startIndex = page * numItems - numItems;
  let endIndex;
  // Makes sure the last page contains the rest of the items
  page <= Math.floor(list.length / numItems)
    ? (endIndex = page * numItems)
    : (endIndex = list.length);

  for (let i = 0; i < list.length; i++) {
    list[i].style.display = 'none';
  }
  for (let i = startIndex; i < endIndex; i++) {
    list[i].style.display = '';
  }
};

// Generates, appends, and adds functionality to the pagination buttons
const appendPageLinks = list => {
  const paginationDiv = createElement('div', pageDiv, 'className', 'pagination');
  const ul = createElement('ul', paginationDiv);

  // Assigns number of pages based on the length of the list
  for (let i = 1; i <= Math.ceil(list.length / numItems); i++) {
    const li = createElement('li', ul);
    const a = createElement('a', li, 'href', `#page-${i}`);
    a.textContent = i;
  }

  // when page first loads, it shows page 1 and link '1' is highlited
  if (ul.firstChild != null) {
    ul.firstChild.firstChild.className = 'active';
  }
  showPage(list, 1);

  // Changes the class name of the target link to active
  // Displays the list items in the target page
  ul.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      const activeLink = ul.querySelector('.active');
      activeLink.className = '';
      event.target.className = 'active';
      const pageNum = event.target.textContent;
      showPage(list, pageNum);
    }
  });
};

const searchBar = () => {
  const searchForm = document.querySelector('.search-form');
  const errorMessage = document.querySelector('.no-result');
  errorMessage.style.display = 'none';

  books.length === 0
    ? (errorMessage.style.display = 'block')
    : (errorMessage.style.display = 'none');

  searchForm.addEventListener('submit', () => {
    pageDiv.removeChild(pageDiv.querySelector('.pagination'));
  });
};

searchBar();
appendPageLinks(books);
