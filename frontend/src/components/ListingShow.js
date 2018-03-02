import React from 'react'
import '../css/stylesheet.css'
import withAuth from '../hocs/withAuth';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
import { Form, Image, Message, Grid, Loader, Segment } from 'semantic-ui-react'

class ListingShow extends React.Component {

  constructor(){
    super()

    this.state = {
      currListing: {},
      message: '',
      show_message: false
    }
  }

  handleChange = (e) => {
    this.setState({message: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.createMessage({body: this.state.message, user_id: this.props.user.id, sender_id: this.props.user.id, recipient_id: this.state.currListing.user_id})
    this.setState({message: '', show_message: true})
  }

  getListingId(){
    const arr = this.props.history.location.pathname.split('/')
    return arr[arr.length - 1]
  }


  componentWillReceiveProps(nextProps){
    if (!this.props.listings.length && nextProps.listings.length) {
      const listingId = this.getListingId()
      const currListing = nextProps.listings.filter(l => l.id === parseInt(listingId))[0]
      this.setState({currListing})
    }
  }

  componentDidMount(){
    if (this.props.listings.length) {
      const listingId = this.getListingId()
      const currListing = this.props.listings.filter(l => l.id === parseInt(listingId))[0]
      this.setState({currListing})
    }
  }

  render(){
    return(
      <div>
          <img alt='' className="background" src={"https://static.pexels.com/photos/606540/pexels-photo-606540.jpeg"}></img>
        <div className="main-content">
          <div className="ui container">

            <h1>{this.state.currListing.title} </h1>

            <br/>

            <div className="ui horizontal segments" style={{ background: 'rgb(0,0,0)'}}>
              <div className="ui segment" style={{ background: 'rgb(0,0,0)', 'backgroundClip': 'border-box', 'display': 'block', 'margin': 'auto'}}>
                <Image alt='' src={this.state.currListing.img_url_1 ? this.state.currListing.img_url_1 : this.state.currListing.avatar} size='large'/>
              </div>
              <div className="ui segment" style={{ background: 'rgb(0,0,0)', 'background-clip': 'border-box', 'display': 'block', 'margin': 'auto'}}>
                <Image alt='' src={this.state.currListing.img_url_2 ? this.state.currListing.img_url_2 : this.state.currListing.avatar_2} size='large'/>
              </div>
            </div>

            <br/>

          <Segment>
            <Grid columns='equal' divided >
            <Grid.Row stretched>
              <Grid.Column  >

                  <h4>Description</h4>
                  <p>{this.state.currListing.description}</p>

              </Grid.Column>

              <Grid.Column>

                  <h4> More Information</h4>
                  <div className="ui list">
                    <div className="item">
                      <i className="marker icon"></i>
                      <div className="content">
                        Location: {this.state.currListing.street_address}, {this.state.currListing.zip}
                      </div>
                    </div>
                    <div className="item">
                      <i className="dollar icon"></i>
                      <div className="content">
                        Desired Compensation: ${this.state.currListing.dollar_compensation_amount}
                      </div>
                    </div>
                    <div className="item">
                      <i className="percent icon"></i>
                      <div className="content">
                         Desired Compensation: {this.state.currListing.percentage_compensation_amount}% of Crops
                      </div>
                    </div>
                    <div className="item">
                      <i className="sun icon"></i>
                      <div className="content">
                        {this.state.currListing.sunlight_amount} daily hours of direct sun exposure
                      </div>
                    </div>
                    <div className="item">
                      <i className="leaf icon"></i>
                      <div className="content">
                        Desired Garden Type: {this.state.currListing.desired_garden_type}
                      </div>
                    </div>
                  </div>

              </Grid.Column>
            </Grid.Row>
          </Grid>
          </Segment>

              <div className='ui segment'>
                <h4>Message Seller</h4>
                <Form error success>
                  <Form.TextArea required label='Body' value={this.state.message} onChange={this.handleChange} placeholder='Please enter your message' />

                    {this.state.show_message && !this.props.messageError.isError ? <Message
                      success
                      header='Success!'
                      content="Your Message Has Been Sent"
                    /> :
                    null
                    }

                    {this.state.show_message && this.props.messageError.isError === true ?  <Message
                      error
                      header='Please Fix the Following Error(s) and Try Again'
                      content={this.props.messageError.errors.map(e => <li>{e}</li>)}
                    /> :
                    null
                  }

                  <Form.Button color='black' onClick={this.handleSubmit}>Send</Form.Button>
                </Form>
              </div>

          </div>
        </div>
      </div>
    )
  }

}


const mapStateToProps = (state) => {
  return {listings: state.listings, user: state.user, messageError: state.messageError}
}

export default withRouter(withAuth(connect(mapStateToProps, null)(ListingShow)))
