import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { 
    getUser
} from './../redux/actions/actions'

class Profile extends Component {

    componentDidMount() {
        document.body.className = 'users show'
    }
    componentWillUnmount() {
        document.body.className = ''
    }
    componentWillMount() {
        this.props.getUserProfile(this.props.match.params.id)
    }

    render() {

        return ( 
            <div>
            {Object.keys(this.props.profile).length > 0 ? <ItemList items ={this.props} /> : ''}
            </div>
        );
    }
}

function ItemList ({items}) {
    return (
            <div className="users show">
            <div className="container-fluid main-container">
            <div className="banner-container animated fadeInUp-small" data-animation="fadeInUp-fadeOutDown-slow">
                <div className="hero-wrapper">
                    <header className="hero">
                        <div className="profile-info">
                            <h1 className="hero-title">{items.profile.user.name}</h1>
                            <p className="hero-description">{items.profile.user.email}</p>
                        </div>
                    </header>
                </div>
            </div>

            </div>
            </div>
    )
}


const mapStateToProps = state => {
    return {
        _post: state.posts.post,
        user: state.authUser.user,
        profile: state.authUser.profile
    }
}
export default connect(mapStateToProps, {
    getUser
})(Profile);