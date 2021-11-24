class ToDo {
    todoList = []
    archiveList = []

    constructor() {}
    
    render(){
        const todo = document.querySelector('.todo')
        todo.innerHTML = `
            <div class='tasks' id='tasks'><ul class='tasksList' id='tasksList'></ul></div>
            <button class='btn' id="addTaskBtn">Add Task</button>
            <div>
                <button class='btn' id="viewAllBtn">View All</button>
                <button class='btn' id="viewArchiveBtn">View Archive</button>
            </div>
            <div id="modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <form>
                        <input type='text' id='task' />
                        <button type='submit' class='btn' id='submitBtn'>Add Task</button>
                    </form>
                </div>
            </div>
        `
        const modal = document.getElementById('modal');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const submitBtn = document.getElementById('submitBtn')
        const span = document.getElementsByClassName('close')[0];
        const tasksList = document.getElementById('tasksList')
        const viewAll = document.getElementById('viewAllBtn')
        const viewArchive = document.getElementById('viewArchiveBtn')

        let createListElement = (item) => {
            let taskLi = document.createElement('li')
            let taskDiv = document.createElement('div')
            taskDiv.setAttribute('class', 'task-card')
            let textP = document.createElement('p')
            let buttonDiv = document.createElement('div')
            buttonDiv.setAttribute('class', 'buttonDiv')
            let deleteTask = document.createElement('input')
            let archiveTask = document.createElement('input')

            taskLi.appendChild(taskDiv)
            taskDiv.appendChild(textP)
            textP.innerHTML = item
            buttonDiv.appendChild(deleteTask)
            buttonDiv.appendChild(archiveTask)

            deleteTask.setAttribute('type', 'button')
            deleteTask.setAttribute('value', 'X')
            deleteTask.setAttribute('id', 'deleteBtn')
            deleteTask.addEventListener('click', event => {
                taskLi.parentNode.removeChild(taskLi)
                let item = textP.innerHTML
                const index = this.todoList.indexOf(item);
                    if (index > -1) {
                    this.todoList.splice(index, 1);
                    }
                localStorage.setItem('todoList', JSON.stringify(this.todoList))
            }, false);

            archiveTask.setAttribute('type', 'button')
            archiveTask.setAttribute('value', '\u2713')
            archiveTask.setAttribute('id', 'archiveBtn')
            archiveTask.addEventListener('click', event => {
                taskLi.parentNode.removeChild(taskLi)
                let item = textP.innerHTML
                this.archiveList.push(item)

                const index = this.todoList.indexOf(item);
                if (index > -1) {
                this.todoList.splice(index, 1);
                }

                localStorage.setItem('todoList', JSON.stringify(this.todoList))
                localStorage.setItem('archiveList', JSON.stringify(this.archiveList))
            }, false)
            taskDiv.appendChild(buttonDiv)
            
            tasksList.appendChild(taskLi)
        }

        if (localStorage.getItem('todoList') != null) {
            this.todoList = JSON.parse(localStorage.getItem('todoList'))
                this.todoList.forEach(element => {
                createListElement(element)
            })
        } 

        if (localStorage.getItem('archiveList') != null) {
            this.archiveList = JSON.parse(localStorage.getItem('archiveList'))
                this.archiveList.forEach(element => {
            })
        } 
    
        addTaskBtn.addEventListener('click', event => {
            modal.style.display = "block";
        })

        submitBtn.addEventListener('click', event => {
            event.preventDefault()

            let input = document.getElementById('task').value
            this.todoList.push(input)
            createListElement(input)
            localStorage.setItem('todoList', JSON.stringify(this.todoList))
            modal.style.display = "none"
        })

        viewAll.addEventListener('click', event => {
            event.preventDefault()


        })

        // close on X
        span.onclick = function() {
            modal.style.display = "none";
        }

        // close on outside window click
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
}

export default ToDo;