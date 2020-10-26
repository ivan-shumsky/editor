const editor = document.querySelector(".editor");
const tools = document.querySelectorAll(".tool");
const notesUl = document.querySelector(".notes-ul");
const notesBlock = document.querySelector('.notes-block');
const saveBtn = document.getElementById('saveBtn');
const addBtn = document.getElementById('addBtn');
const modalContainer = document.querySelector('.modal-container');
const newNoteForm = document.querySelector('#newNoteForm');
const removeBtn = document.querySelector('#removeBtn');
const editorBlock = document.querySelector('.editor-block');

let currentID;

let dropdownIsOpened = false;

let notesArr = [
    // {
    //     id: 530853989584,
    //     title: "My first note",
    //     description: "this is my first title",
    //     html: "guigui<div><b>iyfgyufyu'</b></div><div><b><i>fyuy</i></b></div><div><b><i><br></i></b></div><div><b><i>h</i></b></div>",
    //     publishdate: "22.10.2020"
    // },

    // {
    //     id: 789689688969,
    //     title: "My second note",
    //     description: "this is my second title",
    //     html: "second<div><b>note'</b></div><div><b><i>fyuy</i></b></div><div><b><i><br></i></b></div><div><b><i>content!!!!!!!!!</i></b></div>",
    //     publishdate: "22.10.2020"
    // }
]

function format(command, value) {
    document.execCommand(command, false, value);
}

function addNotesToPage(){
    notesUl.innerHTML = "";
    notesArr = JSON.parse(localStorage.getItem("notes"));
    for(let i = notesArr.length - 1; i >= 0; i--){
        const newNoteEl = document.createElement("div");
        newNoteEl.innerHTML = `<div data-id="${notesArr[i].id}" class="note-el">
        <span class="note-title">${notesArr[i].title}</span>
        <br>
        <span class="note-description">${notesArr[i].description}</span>
        <br>
        <span class="publish-date">${notesArr[i].publishdate}</span>
    </div>`;
    newNoteEl.setAttribute("id", "1id");
    notesUl.appendChild(newNoteEl);
    
}}

function updateEditorContent(){
    let noteEl = document.querySelectorAll(".note-el");

    noteEl.forEach(el => {
      el.addEventListener("click", function(){     
         notesArr.forEach(note => {
             if(note.id == el.getAttribute("data-id")){
                 editor.innerHTML = note.html;
                 currentID = note.id;
                 console.log(note.html);
             }
         })
      })
    })

}

function saveNoteToStorage(){
    let newHTML = editor.innerHTML;
    notesArr.forEach(el => {
        if(el.id == currentID){
            el.html = newHTML;
            localStorage.setItem("notes", JSON.stringify(notesArr));
        }
    })
}

function storage(){
    if(localStorage.getItem("notes")){
        notesArr = JSON.parse(localStorage.getItem("notes"));
    } else {
        localStorage.setItem("notes", JSON.stringify(notesArr));
    }
}

function showFormModal(){
    modalContainer.classList.toggle("active");
}

function submitForm(e){
    e.preventDefault();
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;

    if(!title || !description){
        return false;
    }

    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    let random = Math.round(Math.random() * 10000000000);
    let newItem = {
        id: random,
        title: `${title}`,
        description: `${description}`,
        html: "",
        publishdate: `${day}.${month}.${year}`
    }

    title = "";
    description = "";

    notesArr.push(newItem);
    localStorage.setItem("notes", JSON.stringify(notesArr));
    addNotesToPage();
    showFormModal();
    updateEditorContent();
    handleScrollbar();
    
}

function removeNote(){
   let newConfirm = confirm("Вы действительно хотите удалить это?");
   if(newConfirm){
    notesArr = JSON.parse(localStorage.getItem("notes"));
    notesArr.forEach((el, index) => {
        if(el.id == currentID){
            notesArr.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(notesArr));
            
        }
    })
    editor.innerHTML = "";
    addNotesToPage();
    updateEditorContent();
    handleScrollbar();
   }
}

function handleScrollbar(){
    if(notesBlock.clientHeight > document.body.clientHeight){
        notesBlock.style.overflowY = "scroll";
    } else {
        notesBlock.style.overflowY = "none";
    }
}

function handleSidebar(){
    document.body.classList.toggle("active");
}

// function handleDropDown(){
//     if(dropdownIsOpened = false){

//     }
// }

// event listeners
saveBtn.addEventListener("click", saveNoteToStorage);
addBtn.addEventListener("click", showFormModal);
tools.forEach(tool => {
    tool.addEventListener("click", function(){
        let editor = document.querySelector(".editor");
        editor.focus();
    })
})
modalContainer.addEventListener("click", function(e){
    if(e.target.classList.contains("modal-container")){
        showFormModal();    
    }
});
newNoteForm.addEventListener("submit", submitForm);
window.addEventListener("keydown", function(e){
if(e.ctrlKey && e.which == 81){
   saveNoteToStorage();
}
})
removeBtn.addEventListener("click", removeNote);

// on load
addNotesToPage();
updateEditorContent();
// addOrRemoveOverflow();
storage();
handleScrollbar();
editor.innerHTML = JSON.parse(localStorage.getItem("notes"))[0].html;