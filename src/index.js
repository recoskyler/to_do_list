//===============================================
// Title:  To-Do List Main ReactJS Components
// Author: Adil Atalay Hamamcioglu (Recoskyler)
// Date:   August 2018
//===============================================

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Item} from './Scripts/Item';
import {Tag} from './Scripts/Tag'
import listImage from './Images/listPic.png';
import {variables} from './Helpers/variables';
import {getFormattedCurrentDateTime, existsInArray, saveTasks, loadTasks, saveTags, loadTags, tagExists, getByVal} from './Helpers/functions';

let currentTaskId = 0;
let editMode      = false;
let tagEditMode   = 1;

export class List extends React.Component {
    constructor(props) {
        super(props);
        this.changeStyle = this.changeStyle.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.addTask = this.addTask.bind(this);
        this.state = {tasks:[], tags:[]};
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
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));
        document.getElementById(variables.inputBoxId).value = tmp[tid].val;
        document.getElementById(variables.buttonId).innerHTML = "Save";
        document.getElementById(variables.tagComboId).value = tmp[tid].tag;
        document.getElementById(variables.buttonId).onClick = this.saveChanges;
        document.getElementById(variables.inputBoxId).addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById(variables.buttonId).click();
            }
        });
    }
    
    saveChanges(tsk) {        
        if (tsk.replace(/ /g,'') === "" || tsk === null || tsk === undefined) {
            document.getElementById(variables.inputBoxId).value = "";
            document.getElementById(variables.inputBoxId).placeholder = variables.invalidEditPlaceholder;
            document.getElementById(variables.inputBoxId).className = variables.invalidTaskClassName;
            setTimeout(function(){ 
                document.getElementById(variables.inputBoxId).placeholder = variables.defaultEditPlaceholder; 
                document.getElementById(variables.inputBoxId).className = "";
            }, 3000);
            editMode = true;
            return false;
        } else {
            document.getElementById(variables.inputBoxId).placeholder = variables.defaultEditPlaceholder;
        }
        
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));
        let e = document.getElementById(variables.tagComboId);
        tmp[currentTaskId].val = tsk;
        tmp[currentTaskId].tag = e.options[e.selectedIndex].value;
        this.setState({tasks:tmp});
        document.getElementById(variables.inputBoxId).value = "";
        document.getElementById(variables.buttonId).innerHTML = "Add";
        document.getElementById(variables.buttonId).onClick = this.handleClick;
        document.getElementById(variables.inputBoxId).placeholder = variables.savedPlaceholder;
        document.getElementById(variables.inputBoxId).className = variables.savedClass;
        document.getElementById(variables.tagComboId).value = "0";
        editMode = false; 
        setTimeout(function(){ 
                document.getElementById(variables.inputBoxId).placeholder = variables.defaultPlaceholder; 
                document.getElementById(variables.inputBoxId).className = "";
        }, 1000);
        
        saveTasks(tmp);
    }
    
    deleteTask(tid) {
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));     
        tmp.splice(tid, 1);
        this.setState({tasks:tmp});
        saveTasks(tmp);
    }
    
    componentDidMount() {
        this.addListener();
        this.setState({tasks: loadTasks(), tags: loadTags()});

        document.getElementById(variables.tagComboId).value = "0";
    }

    addListener() {
        var input = document.getElementById(variables.inputBoxId);
        input.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById(variables.buttonId).click();
            }
        });

        input = document.getElementById(variables.tagBoxId);
        input.addEventListener("keyup", function(event) {
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
    
    render() {
        const i = this.getTasks(this.state.tasks);
        let t = this.getTags(this.state.tags);

        if (t === null || t === undefined) {
            t = null;
        }

        console.log(t);
        
        return (
            <div id="gridCont">
                <div id="pageTitle" className="box">
                    <img src={listImage} alt="To-Do List" />
                    <h1>My To-Do List</h1>
                    <span><a href={variables.recoskylerLink} target="_blank">by Recoskyler</a></span>
                </div>
                <div id="newContainer">
                    <div>
                        <input id={variables.inputBoxId} type="text" placeholder={variables.defaultPlaceholder} />
                        <select id={variables.tagComboId} onChange={this.checkEdit}>
                            {t}
                            <option value="edit">Edit Tags</option>
                        </select>
                        <button id={variables.buttonId} onClick={this.handleClick}>Add</button>
                    </div>
                </div>
                <div id="newTagContainer">
                    <div>
                        <input id={variables.tagBoxId} type="text" placeholder={variables.defaultTagPlaceholder} />
                        <select id={variables.tagEditComboId} onChange={this.changeTagEditMode}>
                            {t}
                            <option value="addnew">Add New</option>
                        </select>
                        <button id={variables.tagButtonId} onClick={this.handleTagClick}>Delete Tag</button>
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
        let tmp = JSON.parse(JSON.stringify( this.state.tags ));
        e = document.getElementById(variables.tagEditComboId);
        const index = e.selectedIndex

        if (tagExists(e.options[index].text, this.state.tasks, this.state.tags) || e.options[index].value === "other") {
            document.getElementById(variables.tagBoxId).value = "";
            document.getElementById(variables.tagBoxId).placeholder = variables.invalidTagDelPlaceholder + " " + e.options[index].text;
            document.getElementById(variables.tagBoxId).className = variables.invalidTaskClassName;
            setTimeout(function(){ 
                document.getElementById(variables.tagBoxId).placeholder = variables.defaultTagPlaceholder; 
                document.getElementById(variables.tagBoxId).className = "";
            }, 4000);
            return false;
        } else {
            document.getElementById(variables.tagBoxId).placeholder = variables.defaultPlaceholder;
            document.getElementById(variables.tagBoxId).value = "";
        }
        tmp.splice(index, 1);
        this.setState({tags:tmp});
        saveTags(tmp);
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
        let func    = tagEditMode === 2 ? this.deleteTag : this.addTag;
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
        let tmp = JSON.parse(JSON.stringify( this.state.tags ));
        console.log(tmp);
        console.log(e.value);
        if (e.value === "" || e.value === null || e.value === undefined || tmp.includes(e.value.toString())) {
            document.getElementById(variables.tagBoxId).value = "";
            document.getElementById(variables.tagBoxId).placeholder = variables.invalidTagPlaceholder;
            document.getElementById(variables.tagBoxId).className = variables.invalidTaskClassName;
            setTimeout(function(){ 
                document.getElementById(variables.tagBoxId).placeholder = variables.defaultTagPlaceholder; 
                document.getElementById(variables.tagBoxId).className = "";
            }, 3000);
            return false;
        } else {
            document.getElementById(variables.tagBoxId).placeholder = variables.defaultPlaceholder;
        }

        tmp.push(e.value);
        console.log(tmp);
        this.setState({tags:tmp});
        saveTags(tmp);
        document.getElementById(variables.tagBoxId).value = "";
    }

    changeStyle(s, k) {
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));
        tmp[k].style = s === "regularStyle" ? "checkedStyle" : "regularStyle";
        tmp[k].checked = s === "checkedStyle" ? false : true;
        tmp[k].checkedTime = getFormattedCurrentDateTime(tmp[k].checked);
        this.setState({tasks:tmp});
        saveTasks(tmp);
    }
    
    addTask(tsk) {
        if (existsInArray(tsk.toLowerCase().replace(/ /g,''), this.state.tasks)) {
            document.getElementById(variables.inputBoxId).value = "";
            document.getElementById(variables.inputBoxId).placeholder = variables.invalidPlaceholder;
            document.getElementById(variables.inputBoxId).className = variables.invalidTaskClassName;
            setTimeout(function(){ 
                document.getElementById(variables.inputBoxId).placeholder = variables.defaultPlaceholder; 
                document.getElementById(variables.inputBoxId).className = "";
            }, 1000);
            return false;
        } else {
            document.getElementById(variables.inputBoxId).placeholder = variables.defaultPlaceholder;
        }
        
        if (tsk.replace(/ /g,'') === "" || tsk === null || tsk === undefined) {
            document.getElementById(variables.inputBoxId).value = "";
            return false;
        }
        
        let e = document.getElementById(variables.tagComboId);
        let itemTag = e.options[e.selectedIndex].value;
        
        if (itemTag === null || itemTag === undefined || itemTag === "-1") {
            itemTag = 3;
        }
        
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));
        tmp.push({val:tsk, checked:false, style:"regularStyle", added:getFormattedCurrentDateTime(false), checkedTime:getFormattedCurrentDateTime(true), tag:itemTag});
        this.setState({tasks:tmp});
        document.getElementById(variables.inputBoxId).value = "";
        document.getElementById(variables.inputBoxId).placeholder = variables.addedPlaceholder;
        document.getElementById(variables.inputBoxId).className = variables.addedClass;
        
        setTimeout(function(){ 
                document.getElementById(variables.inputBoxId).placeholder = variables.defaultEditPlaceholder; 
                document.getElementById(variables.inputBoxId).className = "";
        }, 1000);
        
        saveTasks(tmp);
    }
    
    getTasks(items) {
        const tempItems = items.map((itm, i) => {
            return (
                <Item onEdit={this.editItem} time={itm.added} onDel={this.deleteTask} value={itm.val} cs={itm.style} onChange={this.changeStyle} checkedState={itm.checked} key={i} id={i} checkTime={itm.checkedTime} tag={itm.tag}/>
            );
        });
        
        if (tempItems.length >= 1) {
            return tempItems;
        } else {
            return [];
        }
        
    }

    componentDidUpdate() {
        this.checkEdit();
        this.changeTagEditMode();
    }
    
    getTags(items) {
        const tempTags = items.map((t, i) => {
            if (t === "Other") {
                i = "other";
            }

            return (
                <Tag val={t} id={i} key={i}/>
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

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<List />, document.getElementById('cont'));
registerServiceWorker();