import React from 'react'
import '../css/stylesheet.css'
import withAuth from '../hocs/withAuth';
import ListingCard from './ListingCard'
import ListingFilterBar from './ListingFilterBar'
import {connect} from 'react-redux'
import { Dimmer, Segment, Loader, Image} from 'semantic-ui-react'

import MyFancyComponent from './Map'

class ListingsSearchContainer extends React.Component{

  constructor(){
    super()

    this.state = {
      loading: false,
    }
  }

  componentWillReceiveProps(nextProps){
    nextProps.listings.length ? this.setState({loading: false}) : null
  }

  showLoadingBar = () => {
    this.setState({loading: true})
  }

  hideLoadingBar = () => {
    this.setState({loading: false})
  }

  buildOriginsString(listings){
    let destinations = ''
    listings.forEach((l) => {
      destinations += `${l.street_address}, ${l.zip}|`
    })
    return destinations.slice(0, -1)
  }

  addDistanceToListings = (listings, inputOrigin, filters=[]) => {
    const origin = inputOrigin.replace(/[\s]+/g, '+')
    const urlRoot = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
    const key = 'AIzaSyBISW6GubT1FZyI10G3-wifH_rm5eQZrdk'
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const METER_TO_MILE = 0.000621371
    const listingsWithDistance = []

    const num_of_slices = listings.length % 25 === 0 ? listings.length / 25 : Math.floor(listings.length / 25) + 1
    console.log(num_of_slices)

    for (let i = 0; i < num_of_slices; i++) {
      setTimeout( () => {
        let slice = listings.slice(i * 25, (i + 1) * 25)
        let destinations = this.buildOriginsString(slice)
        const apiRoute = `${urlRoot}origins=${origin}&destinations=${destinations}&key=${key}&units=imperial&mode=walking`
          fetch(proxyUrl + apiRoute)
            .then(res => res.json())
            .then(data => {
              let j = 0
              data.rows[0].elements.forEach((e) => {
                try {
                  let dist_text = e.distance.text
                  let dist_value = parseInt(e.distance.value)
                  let newListing = Object.assign({}, slice[j], {distance_text: dist_text, distance_value: dist_value})
                  listingsWithDistance.push(newListing)
                  j++
                }
                catch(err) {
                  listingsWithDistance.push(slice[j])
                }

              })
            }).then(() => {
              listingsWithDistance.length === listings.length ? this.props.filterListings(listingsWithDistance, filters) : null
            })}, 500)
    }
  }

  componentDidMount(){
    this.setState({loading: true})
  }



  render(){

    const listingCards = this.props.filteredListings.filtered ?
    this.props.filteredListings.listings.map(listing => <ListingCard key={listing.id} listing={listing}/>) :
    (this.props.listings.length ? this.props.listings.map(listing => <ListingCard key={listing.id} listing={listing}/>) : null)
    return(
      <div >
    {  // <MyFancyComponent/>
  }

      <img alt='' className="background" src={"https://static.pexels.com/photos/606540/pexels-photo-606540.jpeg"}></img>

        <div className="main-content">

          <div style={{'padding-right': '11.3%', 'padding-left': '11.3%'}}>
            <div className='clear-div'>
              <h1 style={{'color': 'white', 'text-shadow': '2px 2px #000'}} className='bring-to-front'>Filter Results</h1>
            </div>
          <div>
            <ListingFilterBar showLoadingBar={this.showLoadingBar} hideLoadingBar={this.hideLoadingBar} addLocation={this.addDistanceToListings}/>
            </div>

            {this.state.loading && !this.state.filteredListings || !listingCards ? <Loader active inline='centered' size='large'>Loading</Loader> :
              <div className='clear-div'>
                {listingCards.length ? null : <h1 className='bring-to-front' style={{'color': 'white', 'text-shadow': '2px 2px #000'}}> Sorry, no listings matched your search</h1>}
                <div className="ui link cards">
                  {listingCards}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {user: state.user, listings: state.listings, filteredListings: state.filteredListings}
}

export default withAuth(connect(mapStateToProps, null)(ListingsSearchContainer))
