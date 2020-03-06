// variable declaration
let colorTabs = document.querySelectorAll(".point");

// object for chache
const cacheDom = new Map();

// get element from object or dom (...and add element to chache)
function getElement(selector, useCache) {
    if (useCache && cacheDom.has(selector)) {
        return validateNode(cacheDom.get(selector));
    }
    let domElement = document.querySelector(selector);
    domElement && cacheDom.set(selector, domElement);
    return validateNode(domElement);
}

// validate node element
function validateNode(element) {
    if (document.body.contains(element)) {
        return element;
    }
    return false;
}

// main array with tasks
let items;

// set main color
// localStorage.setItem("color", "black-attr");

// set empty array in localstorage
if (!JSON.parse(localStorage.getItem("itemsToLocalStorage"))) {
    items = [];
    addItemsToLocalStorage(items);
}

// set array in localstorage
function addItemsToLocalStorage(items) {
    localStorage.setItem("itemsToLocalStorage", JSON.stringify(items));
}

// get array from localstorage
function parseItemsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("itemsToLocalStorage"));
}
/* ****** */

// template to add tasks on page(html)
const generateTemplateTask = item => ` 
            <div class="one-checkbox-wrap ${item.colorAttr}" data-attr="${
    item.id
}">
                <label class="container-checkbox"><input type="checkbox" onclick="doneTask(event)" ${
                    !item.done ? "" : "checked='checked'"
                }>
                <span class="checkmark ${
                    !item.done ? "" : item.backgroundCheckmark
                }"></span><span class="added-task${
    !item.done ? "" : " done-task"
}">${item.description}</span></label>
            </div> 
    `;

// add tasks
function addUserTask() {
    items = parseItemsFromLocalStorage();
    getElement(".checkboxes-block").innerHTML = items
        .map(mappedItem => {
            if (mappedItem.colorAttr === localStorage.getItem("color")) {
                return generateTemplateTask(mappedItem);
            }
        })
        .join("");
}

// initialization add tasks
addUserTask();

// Color
function getColorAttrInLocalStorage() {
    const colorAttr = this.getAttribute("data-color");
    localStorage.setItem("color", colorAttr);
}

// click on button "Add Tasks"
function clickOnAddTaskBtn() {
    const userValue = getElement("#user-task").value.trim();
    if (userValue) {
        getElement(".error-info-block").style.display = "none";
        getElement(".plus-block").style.display = "block";
        getElement(".add-task-block").style.display = "none";
        let id = items.length - 1;
        const colorAttr = localStorage.getItem("color");
        const regularExp = /-attr/;
        const backgroundCheckmark = colorAttr.replace(regularExp, "");
        items = [
            ...items,
            {
                id: ++id,
                description: userValue,
                colorAttr,
                done: false,
                backgroundCheckmark
            }
        ];
        getElement(".checkboxes-block").innerHTML += generateTemplateTask(
            items[items.length - 1]
        );
        addItemsToLocalStorage(items);
    } else {
        getElement(".error-info-block").style.display = "inline-block";
    }
}

// click on button "Plus"
function clickOnPlus() {
    getElement(".plus-block").style.display = "none";
    getElement(".add-task-block").style.display = "block";
}

// "click" on task in html and to assign status true or false(and add/remove new class)
function doneTask(event) {
    const element = event.target.parentElement;
    const parentIndex = element.parentElement.getAttribute("data-attr");
    const preParentElement = element.lastElementChild;
    if (!preParentElement.classList.contains("done-task")) {
        preParentElement.classList.add("done-task");
        items[parentIndex].done = true;
        element.firstChild.setAttribute("checked", "checked");
        event.target.nextElementSibling.classList.add(
            items[parentIndex].backgroundCheckmark
        );
        addItemsToLocalStorage(items);
    } else {
        preParentElement.classList.remove("done-task");
        items[parentIndex].done = false;
        element.firstChild.removeAttribute("checked");
        event.target.nextElementSibling.classList.remove(
            items[parentIndex].backgroundCheckmark
        );
        addItemsToLocalStorage(items);
    }
}

// set bottom line on lists
function setActiveColor(event) {
    clearBottom();
    event.target.parentElement.style.borderBottom = "2px solid grey";
    addUserTask();
}

// clear bootom before next clicks
function clearBottom() {
    const lists = document.querySelectorAll("li");
    for (let i = 0; i < lists.length; i++) {
        lists[i].removeAttribute("style");
    }
}

/* initialization click's on buttons */
getElement("#plus-img").onclick = clickOnPlus;
getElement("#btn-for-task").onclick = clickOnAddTaskBtn;
for (let i = 0; i < colorTabs.length; i++) {
    colorTabs[i].onclick = getColorAttrInLocalStorage;
}
/* ************ */
