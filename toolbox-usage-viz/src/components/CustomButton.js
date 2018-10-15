import React, { Component } from 'react';
import { Button } from 'reactstrap';

class CutomButton extends Component {
    constructor() {
        super();
        this.state = {
            solid_bg: false
        }
    }

    select() {
        this.setState({
            solid_bg: true
        })
    }

    render() {
        return(
            <div>
                <Button outline color="secondary" onClick={this.setState({solid_bg: true})}>
                    Culo!
                </Button>
            </div>
        )
    }
}

export default CutomButton;