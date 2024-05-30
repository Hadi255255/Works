var signDiv1 = document.getElementById('signDiv1');
var signDiv = document.getElementById('signDiv');
var images = document.getElementsByClassName('images');
var images = document.getElementsByClassName('checkWork');
var editControl = document.getElementsByClassName('edit');
var editFlex = document.getElementById('editFlex');
var editButton = document.getElementById('edit');
var confirmed = document.getElementById('confirmed');
var users = document.getElementById('users');
var home = document.getElementById('home');
var profile = document.getElementById('profile');
var dashboard = document.getElementById('dashboard');
var file = document.getElementById('file');
var resume = document.getElementById('resume');
var main = document.getElementById('maresumein');
var back = document.getElementById('back');
var education = document.getElementById('education');
var deleteNotes = document.getElementById('deleteNotes');
var update = document.getElementById('update');
var sendMessage = document.getElementById('sendMessage');
var profile = document.getElementById('profile');
var signinAlert = document.getElementById('signinAlert');
var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var smaller = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var capital = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];



li_6.onclick = function () {
    document.body.onclick = 'none'
    if (signDiv.style.display == 'block') {
        signDiv.style.display = 'none'
    } else {
        signDiv.style.display = 'block';
    }
}
li_6.onmouseleave = function () {
    document.body.onclick = function () {
        if (signDiv.style.display == 'block') {
            signDiv.style.display = 'none';
        }
    }
}
if (document.body.innerHTML.includes("Home!")) {
    home.classList.add('open');
    if (profile) {
        profile.classList.remove('open');
        dashboard.classList.remove('open');
    }
    if (users) {
        users.classList.remove('open');
    }

} else if (document.body.innerHTML.includes("Profile!")) {
    home.classList.remove('open');
    profile.classList.add('open');
    dashboard.classList.remove('open');
    if (users) {
        users.classList.remove('open');
    }
} else if (document.body.innerHTML.includes("dashboard!")) {
    home.classList.remove('open');
    profile.classList.remove('open');
    dashboard.classList.add('open');
    if (users) {
        users.classList.remove('open');
    }
} else if (document.body.innerHTML.includes("users!")) {
    users.classList.add('open');
    home.classList.remove('open');
    if (profile) {
        profile.classList.remove('open');
        dashboard.classList.remove('open');
    }
} else if (document.body.innerHTML.includes("contact!")) {
    home.classList.remove('open');
    users.classList.remove('open');
    contact.classList.add('open');
    if (profile) {
        profile.classList.remove('open');
        dashboard.classList.remove('open');
    }
}


if (file) {
    file.onclick = function () { console.log('Click file') }
    file.onchange = function () {
        console.log('This:', this)
        const reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = function () {
            image.src = this.result;
        };
        file.style.display = 'block';
        actionbutton.style.display = 'block';
    }
}

if (resume) {
    console.log('Click file1')
    resume.onclick = function () { console.log('Click file') }
    resume.onchange = function () {
        console.log('This:', this)
        const reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = function () {
            pdf.src = this.result;
        };
        resume.style.display = 'block';
        actionResume.style.display = 'block';
    }
}
if (back) {
    back.onclick = function () {
        history.back()
    }
}

var searchWorks = document.getElementById('searchWorks');
var searchTerm = document.getElementById('searchTerm');
var searchTerm2 = document.getElementById('searchTerm2');
var works = document.getElementById('works');
var formsearch = document.getElementById('formsearch');
// var searchTerm = document.getElementById('searchTerm');
if (searchWorks) {
    searchWorks.onclick = function () {
        console.log('works.value: ', works.value);
        console.log('login.value: ', login.value)
        console.log('thisUserParamsName.value: ', thisUserParamsName.value)
        if (searchTerm.value == '') {
            searchTerm.placeholder = "Cann't be empty";
            searchTerm.style.background = 'lightpink';
        } else if (works.value == 'myWorks' && (login.value == 'false' || login2.value == 'false')) {
            searchTerm.placeholder = "This option needs to sign in";
            searchTerm.style.background = 'lightpink';
            searchTerm.value = '';

        } else if (works.value == 'thisUser' && thisUserParamsName.value == 'signin') {
            // history.back()
            searchTerm.placeholder = "Click user's works";
            searchTerm.style.background = 'lightpink';
            searchTerm.value = '';
        }
    }
}
if (searchTerm) {
    searchTerm.onclick = searchTerm.onmouseenter = function () {
        if (searchTerm.value == '') {
            searchTerm.placeholder = "Search..."
            searchTerm.style.background = 'white';
        }
    }
}

var search2 = document.getElementById('search2');
if (search2) {
    search2.onclick = function () {
        if (searchTerm2.value == '') {
            searchTerm2.placeholder = "Cann't be empty";
            searchTerm2.style.background = 'lightpink';
        }
    }
}
if (searchTerm2) {
    searchTerm2.onclick = searchTerm2.onmouseenter = function () {
        if (searchTerm2.value == '') {
            searchTerm2.placeholder = "Search..."
            searchTerm2.style.background = 'white';
        }
    }
}

// _____________________________ Align of the work ___________________________________
var left = document.getElementById('left');
var right = document.getElementById('right');
var center = document.getElementById('center');
var body1 = document.getElementById('body1');
var bodyNew = document.getElementById('bodyNew');
if (left) {
    left.onclick = right.onclick = center.onclick = function () {
        if (left) {
            if (left.checked == true) {
                if (body1) { body1.style.textAlign = 'left'; } else {
                    bodyNew.style.textAlign = 'left'
                }
            }
            else if (right.checked == true) {
                if (body1) { body1.style.textAlign = 'right'; } else {
                    bodyNew.style.textAlign = 'right'
                }
            }
            else if (center.checked == true) {
                if (body1) { body1.style.textAlign = 'center'; } else {
                    bodyNew.style.textAlign = 'center'
                }
            }
        }
    }
    left.onclick();
}
// ______________________ Text Direction ______________________________
var ltr = document.getElementById('ltr');
var rtl = document.getElementById('rtl');
if (ltr) {
    ltr.onclick = rtl.onclick = function () {
        if (ltr.checked == true) {
            if (title1) {
                title1.style.direction = 'ltr';
                body1.style.direction = 'ltr';
            } else if (titleNew) {
                titleNew.style.direction = 'ltr';
                bodyNew.style.direction = 'ltr';
            }
        }
        else if (rtl.checked == true) {
            if (title1) {
                title1.style.direction = 'rtl';
                body1.style.direction = 'rtl';
            } else if (titleNew) {
                titleNew.style.direction = 'rtl';
                bodyNew.style.direction = 'rtl';
            }
        }
    }
    ltr.onclick();
}
//_________________________ Edit Works Button ___________________________
var password = document.getElementById('password');

if (editButton) {
    editButton.onclick = function () {
        for (let i = 0; i < editControl.length; i++) {
            if (editControl[i].style.display == 'block') {
                editControl[i].style.display = 'none';
            } else {
                editControl[i].style.display = 'block'
            }
        }
        if (editFlex.style.display == "grid") {
            editFlex.style.display = "none";
            editButton.innerHTML = "Edit";
        } else {
            editFlex.style.display = "grid";
            editButton.innerHTML = "Cancel"
        }
    }
}
if (password && update != null) {
    update.onclick = function () {
        var n = 0; s = 0; c = 0;
        numbers.forEach((nn) => {
            if (password.value.includes(nn) == true) { n++; console.log("n= ", n) }
        })
        smaller.forEach((ss) => {
            if (password.value.includes(ss) == true) { s++; console.log("s= ", s) }
        })
        capital.forEach((cc) => {
            if (password.value.includes(cc) == true) { c++; console.log("c= ", c) }
        })
        console.log('n,c,s:', n, c, s)
        if (password.value.length < 6 || password.value == '') {
            password.placeholder = "Insert your password here.";
            alertPassword.innerHTML = "Minimum password's length is 6.";
            email.scrollIntoView();
        } else if (n == 0 || s == 0 || c == 0) {
            password.value = '';
            email.scrollIntoView();
            alertPassword.innerHTML = "The password must contain at least one number, one uppercase letter, and one lowercase letter."; return;
        } else { alertPassword.innerHTML = '' }
        if (email.value == '' || email.value.includes('@') == false || email.value.includes('.') == false) {
            email.placeholder = "Insert your email here."
            alertEmail.innerHTML = "Please insert a right email."
        } else { alertEmail.innerHTML = '' }
    }
}
//_______________________ Signup Error ________________________
var passwordNoteSignUp = document.getElementsByClassName('passwordNoteSignUp')[0];
var passwordSignup = document.getElementById('passwordSignup');
var passwordSignupConfirm = document.getElementById('passwordSignupConfirm');
var submit = document.getElementById('submit');

if (passwordSignup) {
    submit.onclick = function () {
        var n = s = c = 0;
        numbers.forEach((num) => {
            if (passwordSignup.value.includes(num) == true) { n++ }
        })
        smaller.forEach((num) => {
            if (passwordSignup.value.includes(num) == true) { s++ }
        })
        capital.forEach((num) => {
            if (passwordSignup.value.includes(num) == true) { c++ }
        })
        console.log('n,c,s,passwordSignup.value.length  :', n, c, s, passwordSignup.value.length)
        if (passwordSignup.value.length < 6 || n == 0 || s == 0 || c == 0) {
            passwordNoteSignUp.innerHTML = "The password must contain at least one number, one uppercase letter, and one lowercase letter, and minimum length is 6."
            passwordNoteSignUp.style.backgroundColor = 'lightpink';
            passwordNoteSignUp.style.color = 'black';
            passwordSignup.value = passwordSignupConfirm.value = '';
            return;
        } else if (passwordSignup.value != passwordSignupConfirm.value) {
            passwordNoteSignUp.style.backgroundColor = 'lightpink';
            passwordNoteSignUp.style.color = 'black';
            passwordNoteSignUp.innerHTML = "Confirm password is not equal to password."
            passwordSignup.value = passwordSignupConfirm.value = '';
            return;
        }
        else {
            passwordNoteSignUp.innerHTML = "The password must contain at least one number, one uppercase letter, and one lowercase letter."
            passwordNoteSignUp.style.backgroundColor = 'transparent';
        }
    }
}




//____________ sendMessage _____________________________________
if (sendMessage != null) {
    sendMessage.onclick = function () {
        if (message.value == '') {
            alert('Write your message please.')
        }
    }
}
// ____________________________ Background Color ___________________________
if (1) {
    var backgroundImg = document.getElementById('backgroundImg');
    var title1 = document.getElementById('title');
    var addNoteTitle = document.getElementById('addNoteTitle');
    var viewTitle = document.getElementById('viewTitle');
    var titleNew = document.getElementById('titleNew');
    var backgroundButton = document.getElementById('backgroundButton');
    var addLink = document.getElementById('addLink');
    var allusers = document.getElementsByClassName('allusers');
    var tableFrame = document.getElementsByClassName('tableFrame');
    var tableBody = document.getElementsByClassName('tableBody');
    var tableTitles = document.getElementsByClassName('tableTitles');
    var nav_link = document.getElementsByClassName('nav-link');
    var open = document.getElementsByClassName('open');
    var note_a = document.getElementsByClassName('note_a');
    var footer_a = document.getElementsByClassName('footer_a');
    var signupForm = document.getElementsByClassName('signupForm');
    var modal_content = document.getElementsByClassName('modal-content');
    var viewTitle = document.getElementsByClassName('viewTitle');
    var body_work = document.getElementsByClassName('body_work');
    var counts = document.getElementsByClassName('counts');


    backgroundButton.onclick = function () {
        document.body.classList.toggle('backgroundBlack');
        if (document.body.classList[0] != 'backgroundBlack') {
            backgroundLight()
        } else {
            backgroundNight()
        }
    }

    for (let i = 0; i < footer_a.length; i++) {
        footer_a[i].style.backgroundColor = 'lightgrey';
        footer_a[i].style.color = 'black';
    };
    if (localStorage.backgroundWorks == 'light') { backgroundLight() }
    if (localStorage.backgroundWorks == 'night') { backgroundNight() }

    function backgroundLight() {
        localStorage.backgroundWorks = 'light';
        document.body.classList.remove('backgroundBlack');
        if (title1) {
            title1.style.backgroundColor = 'white';
            body1.style.backgroundColor = 'white';
            title1.style.color = 'black';
            body1.style.color = 'black';
        } else if (titleNew) {
            addNoteTitle.style.backgroundColor = 'white';
            titleNew.style.backgroundColor = 'white';
            bodyNew.style.backgroundColor = 'white';
            titleNew.style.color = 'black';
            bodyNew.style.color = 'black';
        }
        if (counts[0]) {
            counts[0].style.backgroundColor = 'lightgrey';
            counts[0].style.color = 'black';
        }
        if (allusers[0]) {
            allusers[0].style.color = 'black';
            tableBody[0].style.color = 'black';
            for (let i = 0; i < tableFrame.length; i++) {
                tableFrame[i].style.backgroundImage = 'repeating-linear-gradient(45deg, white 5%, rgb(235, 235, 235) 20%)';
            };
            for (let i = 0; i < tableBody.length; i++) {
                tableBody[i].style.backgroundColor = 'white';
                tableTitles[i].style.backgroundColor = 'white';
                tableTitles[i].style.color = 'black';
            };
        }
        if (open[0]) {
            open[0].style.backgroundImage = 'repeating-linear-gradient(45deg, white 65%, rgb(235, 235, 235))';
        }
        if (signupForm[0]) {
            signupForm[0].style.backgroundColor = 'rgb(230, 230, 230)';
            signupForm[0].style.color = 'black';
        }
        backgroundImg.src = '/img/night.png';

        for (let i = 0; i < nav_link.length; i++) {
            nav_link[i].style.backgroundColor = 'white';
            nav_link[i].style.color = 'black';
        };
        for (let i = 0; i < note_a.length; i++) {
            note_a[i].style.backgroundColor = 'white';
            note_a[i].style.color = 'black';
        };
        for (let i = 0; i < footer_a.length; i++) {
            footer_a[i].style.backgroundColor = 'lightgrey';
            footer_a[i].style.color = 'black';
        };
        for (let i = 0; i < modal_content.length; i++) {
            modal_content[i].style.backgroundColor = 'lightgrey';
        };
        for (let i = 0; i < viewTitle.length; i++) {
            viewTitle[i].style.backgroundColor = 'white';
        };
        if (show1) {
            passwordSignin.type = 'password';
            show1.style.color = 'black';
            show1.style.textDecoration = 'none'
        }
        if (show) {
            passwordSignup.type = passwordSignupConfirm.type = 'password';
            show.style.color = 'black';
            show.style.textDecoration = 'none'
        }
        if (showProfile) {
            password.type = 'password';
            showProfile.style.color = 'black';
            showProfile.style.textDecoration = 'none'
        }
        if (addLink) {
            addLink.style.backgroundColor = "lightgrey"
            addLink.style.color = 'black'
        }
    }
    function backgroundNight() {
        localStorage.backgroundWorks = 'night';
        document.body.classList.add('backgroundBlack');
        if (title1) {
            title1.style.backgroundColor = 'rgb(30,30,30)';
            body1.style.backgroundColor = 'rgb(30,30,30)';
            title1.style.color = 'rgb(240,240,240)';
            body1.style.color = 'rgb(240,240,240)';

        } else if (titleNew) {
            titleNew.style.backgroundColor = 'rgb(30,30,30)';
            bodyNew.style.backgroundColor = 'rgb(30,30,30)';
            addNoteTitle.style.backgroundColor = 'rgb(100,100,100)';
            titleNew.style.color = 'rgb(240,240,240)';
            titleNew.style.color = 'rgb(240,240,240)';
            bodyNew.style.color = 'rgb(240,240,240)';
        }
        if (counts[0]) {
            counts[0].style.backgroundColor = 'rgb(100, 100, 100)';
            counts[0].style.color = 'white';
        }
        backgroundImg.src = '/img/light.png';
        if (allusers[0]) {
            allusers[0].style.color = 'white';
            tableBody[0].style.color = 'white';
            for (let i = 0; i < tableFrame.length; i++) {
                tableFrame[i].style.backgroundImage = 'repeating-linear-gradient(45deg, black 5%, rgb(35, 35, 35) 20%)';
            }
            for (let i = 0; i < tableBody.length; i++) {
                tableBody[i].style.backgroundColor = 'black';
                tableTitles[i].style.backgroundColor = 'black';
                tableTitles[i].style.color = 'white';
            }
        }
        if (open[0]) {
            open[0].style.backgroundImage = 'repeating-linear-gradient(45deg, black 65%, rgb(85, 85, 85))';
        }
        if (signupForm[0]) {
            signupForm[0].style.backgroundColor = 'rgb(30,30,30)';
            signupForm[0].style.color = 'white';
        }
        for (let i = 0; i < nav_link.length; i++) {
            nav_link[i].style.backgroundColor = 'rgb(100,100,100)';
            nav_link[i].style.color = 'white';
        };
        for (let i = 0; i < note_a.length; i++) {
            note_a[i].style.backgroundColor = 'black';
            note_a[i].style.color = 'white';
        };
        for (let i = 0; i < footer_a.length; i++) {
            footer_a[i].style.backgroundColor = 'rgb(30,30,30)';
            footer_a[i].style.color = 'white';
        };
        for (let i = 0; i < modal_content.length; i++) {
            modal_content[i].style.backgroundColor = 'rgb(50,50,50)';
        };
        for (let i = 0; i < viewTitle.length; i++) {
            viewTitle[i].style.backgroundColor = 'rgb(30,30,30)';
        };
        if (show1) {
            passwordSignin.type = 'password';
            show1.style.color = 'white';
            show1.style.textDecoration = 'none'
        }
        if (show) {
            passwordSignup.type = passwordSignupConfirm.type = 'password';
            show.style.color = 'white';
            show.style.textDecoration = 'none'
        }
        if (showProfile) {
            password.type = 'password';
            showProfile.style.color = 'white';
            showProfile.style.textDecoration = 'none'
        }
        if (addLink) {
            addLink.style.backgroundColor = "grey"
            addLink.style.color = 'white'
        }
    };

}
//___________________________ CSS ____________________________________________
var addDiv = document.getElementsByClassName('addDiv');
var viewHead = document.getElementsByClassName('viewHead');
var searchWorksDiv = document.getElementById('searchWorksDiv')


document.body.onresize = window.onload = function () {
    if (searchWorksDiv) {
        if (addDiv[0] && searchWorksDiv && +(window.innerWidth) < 501 && +(window.innerWidth) > 380) {
            searchWorksDiv.style.marginTop = '-100px'
        } else {
            searchWorksDiv.style.marginTop = 'auto'
        }
        if (viewHead[0] && searchWorksDiv && +(window.innerWidth) < 501 && +(window.innerWidth) > 380) {
            searchWorksDiv.style.marginTop = '-100px'
        } else {
            searchWorksDiv.style.marginTop = 'auto'
        }
    }
}
//___________________________________________ Show password ____________________
var show = document.getElementById('show');
var show1 = document.getElementById('show1');
var showProfile = document.getElementById('showProfile');
var passwordSignin = document.getElementById('passwordSignin');
var passwordSignup = document.getElementById('passwordSignup');
var passwordSignupConfirm = document.getElementById('passwordSignupConfirm');

if (show) {
    show.onclick = function () {
        if (passwordSignup.type == 'text') {
            passwordSignup.type = passwordSignupConfirm.type = 'password';
            if (localStorage.backgroundWorks == 'light') {
                show.style.color = 'black';
            } else { show.style.color = 'white'; }
            show.style.textDecoration = 'none';
        } else {
            passwordSignup.type = passwordSignupConfirm.type = 'text';
            if (localStorage.backgroundWorks == 'light') {
                show.style.color = 'grey';
            } else { show.style.color = 'grey'; }
            show.style.textDecoration = 'line-through dashed 3px';
        }
    }

}

if (show1) {
    show1.onclick = function () {
        if (passwordSignin.type == 'text') {
            passwordSignin.type = 'password';
            if (localStorage.backgroundWorks == 'light') {
                show1.style.color = 'black';
            } else { show1.style.color = 'white'; }
            show1.style.textDecoration = 'none';
        } else {
            passwordSignin.type = 'text';
            if (localStorage.backgroundWorks == 'light') {
                show1.style.color = 'grey';
            } else { show1.style.color = 'grey'; }
            show1.style.textDecoration = 'line-through dashed 3px';
        }
    }
}
if (showProfile && password) {
    showProfile.onclick = function () {
        if (password.type == 'text') {
            password.type = 'password';
            if (localStorage.backgroundWorks == 'light') {
                showProfile.style.color = 'black';
            } else { showProfile.style.color = 'white'; }
            showProfile.style.textDecoration = 'none';
        } else {
            password.type = 'text';
            if (localStorage.backgroundWorks == 'light') {
                showProfile.style.color = 'grey';
            } else { showProfile.style.color = 'grey'; }
            showProfile.style.textDecoration = 'line-through dashed 3px';
        }
    }
}
//__________________________________________ Add Link _________________________________________
var addLink = document.getElementById('addLink');
var textareaLink = document.getElementById('textareaLink');
var bodyNewDiv = document.getElementById('bodyNewDiv');
if (addLink) {
    addLink.onclick = function () {
        var linkValue = prompt("Add your link here:");
        if (!linkValue) { return }
        if (linkValue.length > 4) {
            var linkTitle = prompt("Add the title of your link:");
        }
        if (!linkTitle) { return }
        if (linkTitle.length < 1) {
            return
        }
        var links = document.createElement('div');
        var link = document.createElement('a');
        var br = document.createElement('br');
        var contentTitle = document.createTextNode(linkTitle);
        var inputValue = document.createElement('input');
        var inputTitle = document.createElement('input');
        inputValue.setAttribute('value', linkValue);
        inputValue.setAttribute('name', 'inputValue');
        inputValue.setAttribute('hidden', true);
        inputTitle.setAttribute('value', linkTitle);
        inputTitle.setAttribute('name', 'inputTitle');
        inputTitle.setAttribute('hidden', true);

        link.appendChild(contentTitle);
        link.setAttribute('href', linkValue);
        links.setAttribute('class', 'links');
        links.appendChild(link);
        links.appendChild(inputValue);
        links.appendChild(inputTitle);
        links.appendChild(br);
        if (textareaLink) {
            textareaLink.appendChild(links)
        } else {
            bodyNewDiv.appendChild(links);
        }

    }
}






