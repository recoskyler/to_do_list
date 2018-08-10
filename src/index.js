//===============================================
// Title:  To-Do List Main ReactJS Components
// Author: Adil Atalay Hamamcioglu (Recoskyler)
// Date:   August 2018
//===============================================

import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';
import './index.css';
import App from './App';
import { Login } from './Login';
import registerServiceWorker from './registerServiceWorker';
import { Item } from './Scripts/Item';
import { Tag } from './Scripts/Tag'
import listImage from './Images/listPic.png';
import {LoadingImage} from './Scripts/LoadingImage';
import { variables } from './Helpers/variables';
import { setCookie, getFormattedCurrentDateTime, existsInArray, saveTasks, loadTasks, saveTags, loadTags, tagExists, checkCookie, getCookie } from './Helpers/functions';

var config = {
    apiKey: "AIzaSyAP7eU0WPfyUpatPg43iPUwjLiFaUHwWM0",
    authDomain: "to-do-list-47d73.firebaseapp.com",
    databaseURL: "https://to-do-list-47d73.firebaseio.com",
    projectId: "to-do-list-47d73",
    storageBucket: "to-do-list-47d73.appspot.com",
    messagingSenderId: "221523978697"
};

Firebase.initializeApp(config);

let currentTaskId = 0;
let editMode = false;
let tagEditMode = 1;
let pcid = 0;

export class List extends React.Component {
    constructor(props) {
        super(props);
        this.changeStyle = this.changeStyle.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.addTask = this.addTask.bind(this);
        this.state = { tasks: [], tags: [] };
        this.setState = this.setState.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addListener = this.addListener.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.editItem = this.editItem.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.addTag = this.addTag.bind(this);
        this.checkEdit = this.checkEdit.bind(this)
        this.changeTagEditMode = this.changeTagEditMode.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this);
    }

    editItem(tid) {
        editMode = true;
        currentTaskId = tid;
        let tmp = JSON.parse(JSON.stringify(this.state.tasks));
        let e = document.getElementById(variables.tagComboId).options;
        let index = 0;

        for (let i = 0; i < e.length; i++) {
            if (e[i].text === tmp[tid].tag) {
                index = e[i].value;
                break;
            }
        }

        document.getElementById(variables.inputBoxId).value = tmp[tid].val;
        document.getElementById(variables.buttonId).innerHTML = "Save";
        document.getElementById(variables.tagComboId).value = index;
        document.getElementById(variables.buttonId).onClick = this.saveChanges;
        document.getElementById(variables.inputBoxId).addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById(variables.buttonId).click();
            }
        });
    }

    saveChanges(tsk) {
        if (tsk.replace(/ /g, '') === "" || tsk === null || tsk === undefined) {
            document.getElementById(variables.inputBoxId).value = "";
            document.getElementById(variables.inputBoxId).placeholder = variables.invalidEditPlaceholder;
            document.getElementById(variables.inputBoxId).className = variables.defaultClasses + " " + variables.invalidTaskClassName;
            setTimeout(function () {
                document.getElementById(variables.inputBoxId).placeholder = variables.defaultEditPlaceholder;
                document.getElementById(variables.inputBoxId).className = variables.defaultClasses;
            }, 3000);
            editMode = true;
            return false;
        } else {
            document.getElementById(variables.inputBoxId).placeholder = variables.defaultEditPlaceholder;
        }

        let tmp = JSON.parse(JSON.stringify(this.state.tasks));
        let e = document.getElementById(variables.tagComboId);
        tmp[currentTaskId].val = tsk;
        tmp[currentTaskId].tag = e.options[e.selectedIndex].text;
        this.setState({ tasks: tmp });
        document.getElementById(variables.inputBoxId).value = "";
        document.getElementById(variables.buttonId).innerHTML = "Add";
        document.getElementById(variables.buttonId).onClick = this.handleClick;
        document.getElementById(variables.inputBoxId).placeholder = variables.savedPlaceholder;
        document.getElementById(variables.inputBoxId).className = variables.defaultClasses + " " + variables.savedClass;
        editMode = false;
        setTimeout(function () {
            document.getElementById(variables.inputBoxId).placeholder = variables.defaultPlaceholder;
            document.getElementById(variables.inputBoxId).className = variables.defaultClasses;
        }, 1000);

        saveTasks(tmp, pcid);
    }

    deleteTask(tid) {
        let tmp = JSON.parse(JSON.stringify(this.state.tasks));
        tmp.splice(tid, 1);
        this.setState({ tasks: tmp });
        saveTasks(tmp, pcid);
    }

    componentDidMount() {
        this.addListener();

        loadTasks(pcid).then((res) => {
            this.setState({ tasks: res });        
        });

        loadTags(pcid).then((res) => {
            this.setState({ tags: res })
        });

        document.getElementById(variables.tagComboId).value = "0";
    }

    addListener() {
        var input = document.getElementById(variables.inputBoxId);
        input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById(variables.buttonId).click();
            }
        });

        input = document.getElementById(variables.tagBoxId);
        input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById(variables.tagButtonId).click();
            }
        });
    }

    handleClick(e) {
        if (editMode) {
            this.saveChanges(document.getElementById(variables.inputBoxId).value.toString())
        } else {
            this.addTask(document.getElementById(variables.inputBoxId).value.toString());
        }
    }

    logout() {
        setCookie("remember", "", new Date(2019,1,1,1,1,1,1));
        window.location.reload(true); 
    }

    render() {
        const i = this.getTasks(this.state.tasks);
        let t = this.getTags(this.state.tags);

        if (t === null || t === undefined) {
            t = null;
        }

        return (
            <div id="gridCont">
                <div id="pageTitle" className="box">
                    <img src={listImage} alt="To-Do List" />
                    <h1>My To-Do List</h1>
                    <span onClick={this.logout}>Logout</span>
                </div>
                <div id="newContainer">
                    <div>
                        <input className={variables.defaultClasses} id={variables.inputBoxId} type="text" placeholder={variables.defaultPlaceholder} />
                        <select className="roundBox comboBox" id={variables.tagComboId} onChange={this.checkEdit}>
                            {t}
                            <option value="edit">Edit Tags</option>
                        </select>
                        <button className="roundBox roundButton" id={variables.buttonId} onClick={this.handleClick}>Add</button>
                    </div>
                </div>
                <div id="newTagContainer">
                    <div>
                        <input className={variables.defaultClasses} id={variables.tagBoxId} type="text" placeholder={variables.defaultTagPlaceholder} maxLength={variables.tagMaxLength} />
                        <select className="roundBox comboBox" id={variables.tagEditComboId} onChange={this.changeTagEditMode}>
                            {t}
                            <option value="addnew">Add New</option>
                        </select>
                        <button className="roundBox roundButton" id={variables.tagButtonId} onClick={this.handleTagClick}>Delete Tag</button>
                    </div>
                </div>
                <div id="listContainer">
                    {i}
                </div>
            </div>
        );
    }

    handleTagClick(e) {
        if (tagEditMode === 1) {
            this.deleteTag("");
        } else {
            this.addTag("");
        }
    }

    deleteTag(e) {
        let tmp = JSON.parse(JSON.stringify(this.state.tags));
        e = document.getElementById(variables.tagEditComboId);
        const index = e.selectedIndex

        if (tagExists(e.options[index].text, this.state.tasks) || e.options[index].value === "other") {
            document.getElementById(variables.tagBoxId).value = "";
            document.getElementById(variables.tagBoxId).placeholder = variables.invalidTagDelPlaceholder + " " + e.options[index].text;
            document.getElementById(variables.tagBoxId).className = variables.defaultClasses + " " + variables.invalidTaskClassName;
            setTimeout(function () {
                document.getElementById(variables.tagBoxId).placeholder = variables.defaultTagPlaceholder;
                document.getElementById(variables.tagBoxId).className = variables.defaultClasses;
            }, 4000);
            return false;
        } else {
            document.getElementById(variables.tagBoxId).placeholder = variables.defaultTagPlaceholder;
            document.getElementById(variables.tagBoxId).value = "";
        }
        tmp.splice(index, 1);
        this.setState({ tags: tmp });
        saveTags(tmp, pcid);
    }

    checkEdit(e) {
        e = document.getElementById(variables.tagComboId);
        if (e.options[e.selectedIndex].value === "edit") {
            document.getElementById("newTagContainer").style.display = "block";
            document.getElementById(variables.inputBoxId).disabled = true;
            document.getElementById(variables.buttonId).disabled = true;
            this.changeTagEditMode("");
        } else {
            document.getElementById("newTagContainer").style.display = "none";
            document.getElementById(variables.inputBoxId).disabled = false;
            document.getElementById(variables.buttonId).disabled = false;
        }

        if (tagEditMode === 1) {
            document.getElementById(variables.tagBoxId).disabled = true;
        } else {
            document.getElementById(variables.tagBoxId).disabled = false;
        }
    }

    changeTagEditMode(e) {
        e = document.getElementById(variables.tagEditComboId);
        if (e.options[e.selectedIndex].value === "addnew") {
            tagEditMode = 2;
            document.getElementById(variables.tagBoxId).disabled = false;
        } else {
            tagEditMode = 1;
            document.getElementById(variables.tagBoxId).disabled = true;
        }

        let btnText = tagEditMode === 2 ? "Add Tag" : "Delete Tag";
        let func = tagEditMode === 2 ? this.deleteTag : this.addTag;
        document.getElementById(variables.tagButtonId).innerHTML = btnText;
        document.getElementById(variables.tagButtonId).onClick = func;

        if (e.options[e.selectedIndex].value === "other") {
            document.getElementById(variables.tagButtonId).disabled = true;
        } else {
            document.getElementById(variables.tagButtonId).disabled = false;
        }
    }

    addTag(e) {
        e = document.getElementById(variables.tagBoxId);
        let tmp = JSON.parse(JSON.stringify(this.state.tags));

        if (e.value === "" || e.value === null || e.value === undefined || tmp.includes(e.value.toString())) {
            document.getElementById(variables.tagBoxId).value = "";
            document.getElementById(variables.tagBoxId).placeholder = variables.invalidTagPlaceholder;
            document.getElementById(variables.tagBoxId).className = variables.defaultClasses + " " + variables.invalidTaskClassName;
            setTimeout(function () {
                document.getElementById(variables.tagBoxId).placeholder = variables.defaultTagPlaceholder;
                document.getElementById(variables.tagBoxId).className = variables.defaultClasses;
            }, 3000);
            return false;
        } else {
            document.getElementById(variables.tagBoxId).placeholder = variables.defaultTagPlaceholder;
        }

        tmp.push(e.value);
        this.setState({ tags: tmp });
        saveTags(tmp, pcid);
        document.getElementById(variables.tagBoxId).value = "";
    }

    changeStyle(s, k) {
        let tmp = JSON.parse(JSON.stringify(this.state.tasks));
        tmp[k].style = s === "regularStyle" ? "checkedStyle" : "regularStyle";
        tmp[k].checked = s === "checkedStyle" ? false : true;
        tmp[k].checkedTime = getFormattedCurrentDateTime(tmp[k].checked);
        this.setState({ tasks: tmp });
        saveTasks(tmp, pcid);
    }

    addTask(tsk) {
        if (existsInArray(tsk.toLowerCase().replace(/ /g, ''), this.state.tasks)) {
            document.getElementById(variables.inputBoxId).value = "";
            document.getElementById(variables.inputBoxId).placeholder = variables.invalidPlaceholder;
            document.getElementById(variables.inputBoxId).className = variables.defaultClasses + " " + variables.invalidTaskClassName;
            setTimeout(function () {
                document.getElementById(variables.inputBoxId).placeholder = variables.defaultPlaceholder;
                document.getElementById(variables.inputBoxId).className = variables.defaultClasses;
            }, 1000);
            return false;
        } else {
            document.getElementById(variables.inputBoxId).placeholder = variables.defaultPlaceholder;
        }

        if (tsk.replace(/ /g, '') === "" || tsk === null || tsk === undefined) {
            document.getElementById(variables.inputBoxId).value = "";
            return false;
        }

        let e = document.getElementById(variables.tagComboId);
        let itemTag = e.options[e.selectedIndex].text;

        if (itemTag === null || itemTag === undefined || itemTag === "-1") {
            itemTag = 3;
        }

        let tmp = JSON.parse(JSON.stringify(this.state.tasks));
        tmp.push({ val: tsk, checked: false, style: "regularStyle", added: getFormattedCurrentDateTime(false), checkedTime: getFormattedCurrentDateTime(true), tag: itemTag });
        this.setState({ tasks: tmp });
        document.getElementById(variables.inputBoxId).value = "";
        document.getElementById(variables.inputBoxId).placeholder = variables.addedPlaceholder;
        document.getElementById(variables.inputBoxId).className = variables.defaultClasses + " " + variables.addedClass;

        setTimeout(function () {
            document.getElementById(variables.inputBoxId).placeholder = variables.defaultEditPlaceholder;
            document.getElementById(variables.inputBoxId).className = variables.defaultClasses;
        }, 1000);

        saveTasks(tmp, pcid);
    }

    getTasks(items) {
        const tempItems = items.map((itm, i) => {
            return (
                <Item onEdit={this.editItem} time={itm.added} onDel={this.deleteTask} value={itm.val} cs={itm.style} onChange={this.changeStyle} checkedState={itm.checked} key={i} id={i} checkTime={itm.checkedTime} tag={itm.tag} />
            );
        });

        if (tempItems.length >= 1) {
            return tempItems;
        } else {
            return [];
        }

    }

    componentDidUpdate() {
        this.changeTagEditMode();
    }

    getTags(items) {
        const tempTags = items.map((t, i) => {
            if (t === "Other") {
                i = "other";
            }

            return (
                <Tag val={t} id={i} key={i} />
            );
        });

        if (tempTags.length >= 1) {
            return tempTags;
        } else {
            return null;
        }

    }
}

//Uncomment this to clear local storage

//localStorage.clear();

//

function renderList(pid) {
    pcid = pid;
    document.getElementById("loginDiv").style.display = "none";
    ReactDOM.render(<List />, document.getElementById('cont'));
}

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<LoadingImage />, document.getElementById('cont'))

if (!checkCookie("remember")) {
    ReactDOM.render(<Login onLogin={renderList}/>, document.getElementById('cont'));
} else {
    let db = Firebase.database();
    let disfr = getCookie("remember").split('-');
    let disuser = disfr[2];
    let dispcid = disfr[0];
    let disrem = disfr[1];

    db.ref('/users/').once("value").then((snapshot) => {
        const res = snapshot.val();
        
        if (snapshot.hasChild(disuser)) {
            if (res[disuser].rem.toString() === disrem.toString()) {
                pcid = dispcid;
                ReactDOM.render(<List />, document.getElementById('cont'));
            } else {
                ReactDOM.render(<Login onLogin={renderList}/>, document.getElementById('cont'));
            }
        } else {
            ReactDOM.render(<Login onLogin={renderList}/>, document.getElementById('cont'));
        }
    });
}

registerServiceWorker();