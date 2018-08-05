import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Item} from './Scripts/Item';
import listImage from './Images/listPic.png';

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
        this.findTask = this.findTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.getCTime = this.getCTime.bind(this);
    }
    
    getCTime(COrA) {
        const fW = COrA === true ? "Checked  " : "Added  ";
        var currentdate = new Date(); 
        var datetime = fW + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " at "  
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
        
        return datetime;
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
        var input = document.getElementById("inputBox");
        input.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("inputBtn").click();
            }
        });
    }

    handleClick(e) {
        this.addTask(document.getElementById("inputBox").value.toString());
    }
    
    render() {
        const t = this.getTasks(this.state.tasks);
        
        return (
            <div id="gridCont">
                <div id="pageTitle" className="box">
                    <img src={listImage} alt="To-Do List" />
                    <h1>My To-Do List</h1>
                </div>
                <div id="newContainer">
                    <div>
                        <input id="inputBox" type="text" placeholder="Type task here" />
                        <button id="inputBtn" onClick={this.handleClick}>Add</button>
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
        tmp[k].checkedTime = this.getCTime(tmp[k].checked);
        this.setState({tasks:tmp});
    }
    
    addTask(tsk) {
        if (this.findTask(tsk.trim().toLowerCase())) {
            document.getElementById("inputBox").value = "";
            document.getElementById("inputBox").placeholder = "Already added";
            return false;
        } else {
            document.getElementById("inputBox").placeholder = "Type task here";
        }
        
        console.log(tsk);
        
        if (tsk.trim() === "" || tsk === null || tsk === undefined) {
            document.getElementById("inputBox").value = "";
            return false;
        }
        
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));
        tmp.push({val:tsk, checked:false, style:"regularStyle", added:this.getCTime(false), checkedTime:this.getCTime(true)});
        this.setState({tasks:tmp});
        document.getElementById("inputBox").value = "";
    }
    
    findTask(tsk) {
        let tmp = JSON.parse(JSON.stringify( this.state.tasks ));
        
        const res = tmp.some((t) => {
            if (t.val.trim().toLowerCase() === tsk) {
                return true;
            } else {
                return false;
            }
        });
        
        return res;
    }
    
    getTasks(items) {
        const tempItems = this.state.tasks.map((itm, i) => {
            return (
                <Item time={itm.added} onDel={this.deleteTask} value={itm.val} cs={itm.style} onChange={this.changeStyle} checkedState={itm.checked} key={i} id={i} checkTime={itm.checkedTime}/>
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