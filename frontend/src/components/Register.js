import React from 'react'
import '../css/stylesheet.css'
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Message, Form, Icon} from 'semantic-ui-react'


class Register extends React.Component {
  constructor(){
    super()

    this.state = {
      email: '',
      username: '',
      password: '',
      streetAddress: '',
      zipCode: '',
      showError: false,
    }
  }


  handleSubmit = (event) => {
    event.preventDefault()
    const data = {email: this.state.email, username: this.state.username, password: this.state.password, street_address: this.state.streetAddress, zip: this.state.zipCode}
    this.props.registerUser(data, this.props.history);
    this.setState({email: '', username: '', password: '', streetAddress: '', zipCode: '', showError: true})
    this.props.registerError.isError ? this.props.clearOutRegisterErrors() : null
  }

  handleChange = (e) => {
    const field = e.target.name
    const value = e.target.value
    this.setState({[field]: value, showError: false})
  }

  render(){

    const backendErrors =
      <Message
        error
        header='Please Fix the Error(s) Below'
        content={this.props.registerError.errors.map(error => <li>{error}</li>).concat(' ')}
      />

    return(
      <div>
        <img alt='' className="background" src={"https://static.pexels.com/photos/606540/pexels-photo-606540.jpeg"}></img>
        <div className="main-content">
            <div id='welcomeForm' className="ui middle aligned center aligned grid">
              <div className="column">

                <Form onSubmit={this.handleSubmit}>

                  <div className='sheer-div'>


                    <h2 className="ui image header">
                      <div className="content">
                        Register For An Account
                      </div>
                    </h2>

                    {this.props.registerError.isError && this.state.showError ? backendErrors : null}

                    <div className="field">
                      <div className="ui left icon input">
                        <i className="mail icon"></i>
                        <input required type="email" name="email" placeholder="E-mail" value={this.state.email} onChange={this.handleChange}/>
                      </div>
                    </div>

                    <div className="field">
                      <div className="ui left icon input">
                        <i className="user icon"></i>
                        <input required type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange} onBlur={this.handleBlur}/>
                      </div>
                    </div>

                    <div className="field">
                      <div className="ui left icon input">
                        <i className="lock icon"></i>
                        <input required type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} onBlur={this.handleBlur}/>
                      </div>
                    </div>

                    <div className="field">
                      <div className="ui left icon input">
                        <i className="home icon"></i>
                        <input required type="text" name="streetAddress" placeholder="Street Adddress" value={this.state.streetAddress} onChange={this.handleChange} onBlur={this.handleBlur}/>
                      </div>
                    </div>


                  <div className="field">
                    <div className="ui left icon input">
                      <i className="marker icon"></i>
                      <input required type="number" name="zipCode" placeholder="Zip Code" value={this.state.zipCode} onChange={this.handleChange} onBlur={this.handleBlur}/>
                    </div>
                  </div>
                  <button className="ui fluid large black submit button">Register</button>
                </div>

              </Form>
              </div>
            </div>
          </div>
        </div>)
  }

}

const mapStateToProps = (state) => {
  return {registerError: state.registerError}
}

export default connect(mapStateToProps, actions)(Register)
