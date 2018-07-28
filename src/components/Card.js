import React, { Component } from 'react';
import Report from '../images/report.png';
import { Link } from 'react-router-dom';

class Card extends Component {
    render() {
        return (
            <Link
                to={this.props.to}
                style={{ textDecoration: 'none' }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#FF5B5B',
                        padding: '8px 16px',
                        borderRadius: 10,
                        ...this.props.style
                    }}
                >
                    <h2
                        style={{
                            color: '#FFF',
                            paddingRight: 8
                        }}
                    >
                        {this.props.children || 'Some content here'}
                    </h2>
                    <img src={this.props.img || Report} style={{ width: 72, height: 72 }}/>
                </div>
            </Link>
        );
    }
}

export default Card;
