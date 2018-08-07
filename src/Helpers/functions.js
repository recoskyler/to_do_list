//===============================================
// Title:  To-Do List Functions
// Author: Adil Atalay Hamamcioglu (Recoskyler)
// Date:   August 2018
//===============================================

import {variables} from './variables';

export function getFormattedCurrentDateTime(COrA = false) {
    const fW = COrA === true ? "Checked  " : "Added  ";
    var datetime = fW + getCurrentDateTime();

    return datetime;
}

export function getCurrentDateTime() {
    const datetime = getCurrentDate() + " at " + getCurrentTime();
    return datetime;
}

export function getCurrentDate() {
    let currentdate = new Date(); 
    const cdate = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear();

    return cdate;
}

export function getCurrentTime() {
    let currentdate = new Date();
    const ctime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    return ctime;
}

export function existsInArray(itm, arr) {
    if (arr === undefined || arr === null || arr.length === 0) {
        return false;    
    }

    let tmp = JSON.parse(JSON.stringify( arr ));

    const res = tmp.some((t) => {
        if (t.val === itm) {
            return true;
        } else {
            return false;
        }
    });

    return res;
}

export function loadTasks() {
    let obj = JSON.parse(localStorage.getItem(variables.keyName));
    
    if (obj === null || obj === undefined || obj.length === 0) {
        return [];
    }
    return obj;
}

export function saveTasks(t) {
    localStorage.setItem(variables.keyName, JSON.stringify(t));
    console.log(JSON.stringify(t));
}