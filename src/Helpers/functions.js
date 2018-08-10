//===============================================
// Title:  To-Do List Functions
// Author: Adil Atalay Hamamcioglu (Recoskyler)
// Date:   August 2018
//===============================================

import Firebase from 'firebase';

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
    const cdate = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear();

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

    let tmp = JSON.parse(JSON.stringify(arr));

    const res = tmp.some((t) => {
        if (t.val === itm) {
            return true;
        } else {
            return false;
        }
    });

    return res;
}

export function loadTasks(pcid) {
    let obj = [];
    const db = Firebase.database();

    return new Promise(function(resolve, reject) {
        db.ref('/tasks/' + pcid.toString()).once("value").then(function(snapshot) {
            obj = snapshot.val();

            if (obj === null || obj === undefined || obj.length === 0) {
                resolve([]);
            } else {
                resolve(obj);
            }
        });
    });
}

export function saveTasks(t, pcid) {
    const db = Firebase.database();
    db.ref('tasks/' + pcid.toString()).set(t);
}

export function saveTags(t, pcid) {
    const db = Firebase.database();
    db.ref('tags/' + pcid.toString()).set(t);
}

export function loadTags(pcid) {
    let obj = [];
    const db = Firebase.database();

    return new Promise(function(resolve, reject) {
        db.ref('/tags/' + pcid.toString()).once("value").then(function(snapshot) {
            obj = snapshot.val();

            if (obj === null || obj === undefined || obj.length === 0) {
                resolve(["Other"]);
            } else {
                resolve(obj);
            }
        });
    });
}

export function tagExists(t, arr) {
    if (arr === undefined || arr === null || arr.length === 0) {
        return false;
    }

    return arr.some((tt) => {
        if (tt.tag === t) {
            return true;
        } else {
            return false;
        }
    });
}

export function getByVal(v, cbid, ROT = false) {
    let res = 0;
    let ddlArray = [];
    const ddl = document.getElementById(cbid);
    for (let i = 0; i < ddl.options.length; i++) {
        ddlArray.push(ddl.options[i].value);
    }

    const tmp = ddlArray.forEach((itm, i) => {
        if (itm.value === v) {
            res = i;
            return true;
        } else {
            return false;
        }
    });

    if (ROT) {
        return res;
    }

    return ddl.options[res].text;
}

export function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function checkCookie(cname) {
    var cdata = getCookie(cname);
    if (cdata !== "") {
        return true;
    } else {
        return false;
    }
}