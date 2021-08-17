const taskContainer = document.querySelector(".task__container");

let globalTaskData = [];

const cardGenerator = (cardData) => {
    return `
        <div id=${cardData.id} class="col-lg-4 col-md-6 col-sm-12 my-4">
            <div class="card">
                <div class="card-header d-flex justify-content-end gap-2">
                    <button class="btn btn-outline-info" onclick="updateCard.apply(this, arguments)" name=${cardData.id}><i class="fa fa-pen"  name=${cardData.id} onclick="updateCard.apply(this, arguments)"></i></button>
                    <button class="btn btn-outline-danger" onclick="deleteCard.apply(this, arguments)" name=${cardData.id}><i class="fa fa-trash" name=${cardData.id} onclick="deleteCard.apply(this, arguments)"></i></button>
                </div>
                <div class="card-body">
                    <img src=${cardData.image} alt="" class="card-img">
                    <h5 class="card-title mt-2">${cardData.title}</h5>
                    <p class="card-text">${cardData.description}</p>
                    <span href="#" class="badge bg-primary pointer">${cardData.type}</span>
                </div>
                <div class="card-footer text-muted">
                    <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#taskModal" onClick="openTaskInfo.apply(this, arguments)" name=${cardData.id}>Open Task</button>
                </div>
            </div>
        </div>
    `;
};





const addNewCard = () => {
    //selecting elements

    let inputImageUrl = document.querySelector("#imageUrl");
    let inputTaskTitle = document.querySelector("#taskTitle");
    let inputTaskType = document.querySelector("#taskType");
    let inputTaskDescription = document.querySelector("#taskDescription");

    //task data
    const taskData = {
        id: `${Date.now()}`,
        image: inputImageUrl.value,
        title: inputTaskTitle.value,
        type: inputTaskType.value,
        description: inputTaskDescription.value,
    };

    //push to global data
    globalTaskData.push(taskData);

    //update the localstorage
    localStorage.setItem("todoist", JSON.stringify({ cards: globalTaskData }));

    //generate HTML

    const newCard = cardGenerator(taskData);

    //Inject into DOM

    taskContainer.insertAdjacentHTML("beforeend", newCard);

    //clear the form
    inputImageUrl.value = "";
    inputTaskTitle.value = "";
    inputTaskType.value = "";
    inputTaskDescription.value = "";
};

const loadExistingCards = () => {
    // check local Storage
    const getData = localStorage.getItem("todoist");

    //parse JSON data if exist
    if (!getData) return;

    const taskCards = JSON.parse(getData);
    // console.log('taskCards: ', taskCards);

    const newCard = taskCards.cards.map((taskData) => {
        let newCardHtml = cardGenerator(taskData);

        taskContainer.insertAdjacentHTML("beforeend", newCardHtml);
    });

    globalTaskData = taskCards.cards;
};

const deleteCard = (event) => {
    const targetID = event.target.getAttribute("name");
    console.log(typeof targetID);

    const elementType = event.target.elementType;

    const removeTask = globalTaskData.filter((task) => task.id !== targetID);
    globalTaskData = removeTask;
    console.log("removeTask: ", removeTask);
    console.log("globalTaskData: ", globalTaskData);

    localStorage.setItem("todoist", JSON.stringify({ cards: globalTaskData }));

    if (elementType == "BUTTON") {
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode
        );
    } else {
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode.parentNode
        );
    }
};

const updateCard = (event) => {
    const targetID = event.target.getAttribute("name");

    const elementType = event.target.tagName;

    let parentElement, taskTitle, taskDescription, taskType, saveButton;

    
    if (elementType === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
        console.log("parent: ", parentElement);
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
        console.log("parent: ", parentElement);
    }

    taskTitle = parentElement.childNodes[3].childNodes[3];
    taskDescription = parentElement.childNodes[3].childNodes[5];
    taskType = parentElement.childNodes[3].childNodes[7];
    saveButton = parentElement.childNodes[5].childNodes[1];
    
    
    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    saveButton.innerHTML = "Save Changes";
    saveButton.setAttribute("data-bs-toggle" , "null")
    saveButton.setAttribute("onclick", "saveEditedData.apply(this, arguments)")
    
};


const saveEditedData = (event) => {
    
    const targetID = event.target.getAttribute("name");
    const elementType = event.target.tagName;
    
    let parentElement, taskTitle, taskDescription, taskType, saveButton;
    
    
    if (elementType === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
        console.log("parent: ", parentElement);
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
        console.log("parent: ", parentElement);
    }
    
    taskTitle = parentElement.childNodes[3].childNodes[3].innerHTML;   
    taskDescription = parentElement.childNodes[3].childNodes[5].innerHTML;
    taskType = parentElement.childNodes[3].childNodes[7].innerHTML;
    saveButton = parentElement.childNodes[5].childNodes[1];
    
    saveButton.innerHTML = "Open Task";
    saveButton.setAttribute("data-bs-toggle", "modal");
    
    updatedData = {
        title : taskTitle,
        type : taskDescription,
        description : taskType,
    }
    
    console.log(updatedData)
    
    updatedArray = globalTaskData.map(task => {
        
        if (task.id == targetID) {
            return {...task, ...updatedData}
        } else {
            return task;
        }
        
    });
    
    globalTaskData = updatedArray;
    
    console.log(globalTaskData);
    
    localStorage.setItem("todoist", JSON.stringify({ cards: globalTaskData }));
    

}

const openTaskInfo = (event) => {
 
    //get the ID through the click
    const taskID = event.target.getAttribute("name");

    //fetch the data
    const localData = JSON.parse(localStorage.getItem("todoist"));

    const requiredData = localData.cards.filter((task) => task.id == taskID)[0];
    console.log('requiredData: ', requiredData);

    const date = new Date(parseInt(requiredData.id))

    document.querySelector(".open-task-date").innerHTML = date.toUTCString()
    document.querySelector(".open-task-type").innerHTML = requiredData.type
    document.querySelector(".open-task-title").innerHTML = requiredData.title
    document.querySelector(".open-task-description").innerHTML = requiredData.description
    document.querySelector(".open-task-image").setAttribute("src", requiredData.image )
}




