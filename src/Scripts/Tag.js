import React from 'react';

export class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.id = 0;
        this.val = "--";
    }
    
    render() {
        return (
            <option value={this.props.id}>{this.props.val}</option>
        );
    }
}