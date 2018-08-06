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
import listImage from './Images/listPic.png';
import {variables} from './Helpers/variables';
import {getFormattedCurrentDateTime, existsInArray} from './Helpers/functions';

let currentTaskId = 0;
let editMode      = false;

export class List extends React.Component {
    constructor(props) {
        super(props);
        this.changeStyle = this.changeStyle.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.addTask = this.addTask.bind(this);
        this.state = {tasks:[]};
        this.setState = this.setState.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addListener = this.addListener.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.editItem = this.editItem.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }
    
    editItem(tid) {
        editMode = true;
        currentTaskId = tid;
        const tmp = JSON.parse(JSON.stringify( this.state.tasks ));
        document.getElementById(variables.inputBoxId).value = tmp[tid].val;
        document.getElementById(variables.buttonId).innerHTML = "Save";
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
            }, 2000);
            return false;
        } else {
            document.getElementById(variables.inputBoxId).placeholder = variables.defaultEditPlaceholder;
        }
        
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));     
        tmp[currentTaskId].val = tsk;
        this.setState({tasks:tmp});
        document.getElementById(variables.inputBoxId).value = "";
        document.getElementById(variables.buttonId).innerHTML = "Add";
        document.getElementById(variables.buttonId).onClick = this.handleClick;
        document.getElementById(variables.inputBoxId).placeholder = variables.savedPlaceholder;
        document.getElementById(variables.inputBoxId).className = variables.savedClass;
        
        setTimeout(function(){ 
                document.getElementById(variables.inputBoxId).placeholder = variables.defaultEditPlaceholder; 
                document.getElementById(variables.inputBoxId).className = "";
        }, 2000);
    }
    
    deleteTask(tid) {
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));     
        tmp.splice(tid, 1);
        this.setState({tasks:tmp});      
    }
    
    componentDidMount() {
        this.addListener();
    }

    addListener() {
        var input = document.getElementById(variables.inputBoxId);
        input.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById(variables.buttonId).click();
            }
        });
    }

    handleClick(e) {
        if (editMode) {
            this.saveChanges(document.getElementById(variables.inputBoxId).value.toString())
            editMode = false;
        } else {
            this.addTask(document.getElementById(variables.inputBoxId).value.toString());   
        }
    }
    
    render() {
        const t = this.getTasks(this.state.tasks);
        
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
                        <button id={variables.buttonId} onClick={this.handleClick}>Add</button>
                    </div>
                </div>
                <div id="listContainer">
                    {t}
                </div>
            </div>
        );
    }

    changeStyle(s, k) {
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));
        tmp[k].style = s === "regularStyle" ? "checkedStyle" : "regularStyle";
        tmp[k].checked = s === "checkedStyle" ? false : true;
        tmp[k].checkedTime = getFormattedCurrentDateTime(tmp[k].checked);
        this.setState({tasks:tmp});
    }
    
    addTask(tsk) {
        if (existsInArray(tsk.toLowerCase().replace(/ /g,''), this.state.tasks)) {
            document.getElementById(variables.inputBoxId).value = "";
            document.getElementById(variables.inputBoxId).placeholder = variables.invalidPlaceholder;
            document.getElementById(variables.inputBoxId).className = variables.invalidTaskClassName;
            setTimeout(function(){ 
                document.getElementById(variables.inputBoxId).placeholder = variables.defaultPlaceholder; 
                document.getElementById(variables.inputBoxId).className = "";
            }, 2000);
            return false;
        } else {
            document.getElementById(variables.inputBoxId).placeholder = variables.defaultPlaceholder;
        }
        
        if (tsk.replace(/ /g,'') === "" || tsk === null || tsk === undefined) {
            document.getElementById(variables.inputBoxId).value = "";
            return false;
        }
        
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));
        tmp.push({val:tsk, checked:false, style:"regularStyle", added:getFormattedCurrentDateTime(false), checkedTime:getFormattedCurrentDateTime(true)});
        this.setState({tasks:tmp});
        document.getElementById(variables.inputBoxId).value = "";
    }
    
    getTasks(items) {
        const tempItems = this.state.tasks.map((itm, i) => {
            return (
                <Item onEdit={this.editItem} time={itm.added} onDel={this.deleteTask} value={itm.val} cs={itm.style} onChange={this.changeStyle} checkedState={itm.checked} key={i} id={i} checkTime={itm.checkedTime}/>
            );
        });
        
        if (tempItems.length >= 1) {
            return tempItems;
        } else {
            return [];
        }
        
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<List />, document.getElementById('cont'));
registerServiceWorker();