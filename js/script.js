const searchBar = document.querySelector("#searchbar");
const searchButton = document.querySelector("#searchButton");
const searchTitle = document.querySelector("#title");
const searchContent = document.querySelector("#content");

getReq('https://www.reddit.com/r/php/search.json?q=cats&limit=5', processAjax);

let newPosts = [];
function getReq(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function () {
        if (req.readyState === 4 && req.status === 200) {
            callback(JSON.parse(req.responseText));
        } else {
            console.log('error', req.statusText);
        }
    }
    req.send(null);
}

function processAjax(object) {
    const postList = getPostInfo(object);
    loadData();
}

function getPostInfo(postObject) {
    // We will explain the 'postData => {' syntax on Tuesday
    postObject.data.children.forEach(postData => {
        const post = { title: '', url: '' };

        postData = postData.data;
        post.title = postData.title;
        post.url = postData.url;
        newPosts.push(post);
    });

    return newPosts;
}

function loadData() {
    let currentList = document.querySelector("ol");
    if(currentList) {
        searchContent.removeChild(currentList);
    }
    let contentList = document.createElement("ol");
    newPosts.forEach(post => {
        let listItem = document.createElement("li");
        let postTitle = document.createElement("h5");
        let postLink = document.createElement("a");
        postLink.classList.add('link');

        postTitle.textContent = post.title;
        postLink.href = post.url;
        postLink.textContent = post.url;

        listItem.appendChild(postTitle);
        listItem.appendChild(postLink);
        contentList.appendChild(listItem);
    });
    searchContent.appendChild(contentList);
    searchBar.disabled = false;
    searchButton.disabled = false;
}

function search(query) {
    newPosts = [];
    const url = 'https://www.reddit.com/r/php/search.json?q=' + query + '&limit=5';
    searchTitle.textContent = query;
    getReq(url, processAjax);
}

searchBar.addEventListener('keyup', function(event){
    if(event.keyCode === 13) {
        searchBar.disabled = true;
        searchButton.disabled = true;
        search(event.target.value);
    }
});

searchButton.addEventListener('click', function(event){
    if(searchBar.value) {
        searchButton.disabled = true;
        searchBar.disabled = true;
        search(searchBar.value);
    } else {
        alert('Please put something in the box to search for.');
    }
})
