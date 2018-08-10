//===============================================
// Title:  To-Do List Pre-Loading GIF
// Author: Adil Atalay Hamamcioglu (Recoskyler)
// Date:   August 2018
//===============================================

import React from 'react';
import loadingImage from '../Images/loading.gif';

export class LoadingImage extends React.Component {
    render() {
        return (<img id="loadingImg" src={loadingImage} alt="loading"/>);
    }
}