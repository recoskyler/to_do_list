//===============================================
// Title:  To-Do List Item Component
// Author: Adil Atalay Hamamcioglu (Recoskyler)
// Date:   August 2018
//===============================================

import React from 'react';
import '../index.css';
import {variables} from '../Helpers/variables';
import tCanImg from '../Images/tCan.png';
import editImg from '../Images/editPic.png';
import { getByVal } from '../Helpers/functions';

export class Item extends React.Component {
    constructor(props) {
        super(props);
        this.id = 0;
        this.handleChange = this.handleChange.bind(this);
        this.handleDel = this.handleDel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleChange(e) {
        this.props.onChange(this.props.cs, this.props.id);
    }

    handleDel(e) {
        this.props.onDel(this.props.id);
    }
    
    handleEdit(e) {
        this.props.onEdit(this.props.id);
    }

    render() {
        let labelStyle = {};
        let dt = this.props.time;
        let tagClass = "tagLbl";

        if (this.props.cs === "regularStyle") {
            labelStyle = variables.regularStyle;
        } else {
            labelStyle = variables.checkedStyle;    
        }

        if (this.props.checkedState) {
            dt = this.props.checkTime;
            tagClass += " checkedTagLbl";
        }

        return (
            <div className="lDiv">
                <div>
                    <label style={labelStyle} className="container"  key={this.props.id.toString()}>{this.props.value}
                        <input checked={this.props.checkedState} type="checkbox" onChange={this.handleChange}/>
                        <span className="checkmark"></span>
                    </label>
                </div>
                <div className={tagClass}>
                    <span>{getByVal(this.props.tag, variables.tagComboId, false)}</span>
                </div>
                <div>
                    <img onClick={this.handleEdit} className="ePen" src={editImg} alt="Edit"/>   
                </div>
                <div>
                    <img onClick={this.handleDel} className="tCan" src={tCanImg} alt="Delete"/>
                </div>
                <div className={variables.dateBoxId}>
                    {dt}
                </div>
            </div>
        );
    }
}