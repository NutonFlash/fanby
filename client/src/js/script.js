
window.onload = () => {
    document.getElementById('btn-add').addEventListener('click', addUser);
    document.getElementById('btn-post').addEventListener('click', postTweet);
    document.getElementById('btn-retweet').addEventListener('click', makeRetweet);
}

function addUser() {
    let req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:3000/addUser');
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            const status = req.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                let res = JSON.parse(req.responseText);
                console.log(res);
                window.authorization.authorize(res.url);
            } else {
                // Oh no! There has been an error with the request!
                console.log('Some erorr occured!');
            }
        }
    }
    req.send();
}

function postTweet() {
    let req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:3000/postTweet');
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            const status = req.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                let res = JSON.parse(req.responseText);
                console.log(res);
            } else {
                // Oh no! There has been an error with the request!
                console.log('Some erorr occured!');
            }
        }
    }
    req.send();
}

function makeRetweet() {
    let req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:3000/makeRetweet');
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            const status = req.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                let res = JSON.parse(req.responseText);
                console.log(res);
            } else {
                // Oh no! There has been an error with the request!
                console.log('Some erorr occured!');
            }
        }
    }
    req.send();
}