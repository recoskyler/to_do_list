import React from 'react';
import '../index.css';
import tCanImg from '../Images/tCan.png';

const checkedStyle = {textDecoration:"line-through",fontStyle:"italic",color:"#9e9e9e"};
const regularStyle = {textDecoration:"none",fontStyle:"normal",color:"#424242"};

export class Item extends React.Component {
    constructor(props) {
        super(props);
        this.id = 0;
        this.handleChange = this.handleChange.bind(this);
        this.handleDel = this.handleDel.bind(this);
    }

    handleChange(e) {
        this.props.onChange(this.props.cs, this.props.id);
    }

    handleDel(e) {
        console.log("DEL");
        this.props.onDel(this.props.id);
    }

    render() {
        let labelStyle = {};
        let dt = this.props.time;

        if (this.props.cs === "regularStyle") {
            labelStyle = regularStyle;
        } else {
            labelStyle = checkedStyle;    
        }
        
        if (this.props.checkedState) {
            dt = this.props.checkTime;
        }

        return (
            <div className="lDiv">
            <div className="lDiv">
            <label style={labelStyle} className="container"  key={this.props.id.toString()}>{this.props.value}
            <input checked={this.props.checkedState} type="checkbox" onChange={this.handleChange}/>
                <span className="checkmark"></span>
                    </label>
                    </div>
                    <div className="lDiv">
                    <img onClick={this.handleDel} className="tCan" src={tCanImg} alt="Delete"/>
                        </div>
                        <div className="dateBox">
                        {dt}
                        </div>
                        </div>
                    );
}
}