import React, { Component } from 'react';
// Onsen UI
import { Page, Button, Icon } from 'react-onsenui';
// Packages
import Autocomplete     from 'react-google-autocomplete';
import axios            from 'axios';
// Redux
import { connect }      from 'react-redux';
import {
  updateCoords,
  updateEDP,
  updateGoogleMaps,
  load,
  updateSelectedView,
  updateSelectedViewIndex,
}                       from '../../redux/actions';
// Utils
import { getStore }     from '../../utils/utils';
// Styles
import { bodyStyle, buttonStyle } from '../../styles/styles';
import '../../styles/mapStyle.css';
// Global Components
import  TopBar          from './../../views/_global/topBar.jsx';
import  BottomNav       from './../../views/_global/bottomNav.jsx';
// API Key
import apikey           from './../../../../config/google-maps-api';

const inputField = {
  ...bodyStyle,
  width: '90%',
  display: 'block',
  margin: '0 auto',
};
const title = {
  ...bodyStyle,
  fontSize: 'xx-large',
  textAlign: 'center',
};

const searchForm = {
  alignItems: 'center',
  justifyContent: 'space-around',
};


class LatLonModule extends Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.state = {
      input: '',
      loaded: false,
      userCoords: false,
    };
    window.googleLoaded = () => {
      this.setState({
        loaded: true,
      });
    };
  }

  componentWillMount() {
    // Load cached redux from Session Store
    if (!this.props.loaded) this.props.load(getStore());
    if (!this.props.loadGoogleMaps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apikey.api_key}&libraries=places&callback=googleLoaded`;
      // script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=googleLoaded';
      script.async = true;
      document.body.appendChild(script);
      this.props.updateGoogleMaps(true);
    } else {
      this.setState({ loaded: true });
    }
    this.addClickClass();
    this.geoLocation(this.handlePosition);
  }

  addClickClass() {
    const target = document.getElementsByTagName('body')[0];
    const config = { childList: true };
    // eslint-disable-next-line
    const childObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          node.classList.add('needsclick');
          node.childNodes.forEach((child) => {
            child.classList.add('needsclick');
          });
        });
      });
    });
    // eslint-disable-next-line
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if ([...node.classList].indexOf('pac-container') !== -1) {
            childObserver.observe(node, config);
          }
        });
      });
    });
    this.observer.observe(target, config);
  }

  getInput(e) {
    this.setState({ input: e.target.value });
  }

  handleSelect(address) {
    this.setState({
      address,
      loading: true,
    });
  }

  handleChange(address) {
    this.setState({
      address,
      geocodeResults: null,
    });
  }

  componentDidMount() {
    this.addClickClass();
    this.geoLocation();
  }

  componentWillUnmount() {
    // click handling for google drop down
    this.observer.disconnect();
  }

  request(lat, lng) {
    axios.get(`/eventdata/${lat}/${lng}`)
      .then((response) => {
        if (response) {
          this.props.updateSelectedView('Create');
          this.props.updateSelectedViewIndex(0);
          this.props.updateEDP(response.data);
          // push to next page
          this.props.router.push('/create');
        }
      })
      .catch((e) => {
        console.log('An error occured when accessing data:', e);
      });
  }

  handleBack() {
    this.props.router.push('/home');
  }

  geoLocation() {
    // eslint-disable-next-line no-undef
    if (navigator.geolocation) {
      // eslint-disable-next-line no-undef
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.setState({ userCoords: [pos.coords.latitude, pos.coords.longitude] });
        },
      );
    }
  }

  render() {
    return (
      <Page renderToolbar={TopBar.bind(this, { title: 'Location', handleBack: this.handleBack })}>
        <p style={title}>Where to?</p>
        {
          this.state.loaded ?
            <div style={searchForm}>
              <Autocomplete
                style={inputField}
                onPlaceSelected={(place) => {
                  this.props.updateCoords([
                    place.geometry.location.lat(),
                    place.geometry.location.lng(),
                  ]);
                  this.request(this.props.coords[0], this.props.coords[1]);
                }}
                types={['geocode', 'establishment']}
                componentRestrictions={{ country: 'us' }}
              />
            </div> :
            <div/>
        }
        {
          this.state.userCoords !== false ?
            <Button style={buttonStyle} onClick={() => (
              this.request(this.state.userCoords[0], this.state.userCoords[1]))
            }>
              <Icon icon='fa-compass'/> Use Current Location
            </Button> :
            <Button style={buttonStyle} disabled={true}>Location Not Avaliable</Button>
        }
      <BottomNav router={this.props.router}/>
      </Page>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  load: (state) => {
    dispatch(load(state));
  },
  updateCoords: (coords) => {
    dispatch(updateCoords(coords));
  },
  updateEDP: (edp) => {
    dispatch(updateEDP(edp));
  },
  updateGoogleMaps: (loadGoogleMaps) => {
    dispatch(updateGoogleMaps(loadGoogleMaps));
  },
  updateSelectedView: (loadSelectedView) => {
    dispatch(updateSelectedView(loadSelectedView));
  },
  updateSelectedViewIndex: (loadSelectedViewIndex) => {
    dispatch(updateSelectedViewIndex(loadSelectedViewIndex));
  },
});

const mapStateToProps = state => ({
  loaded: state.loaded,
  coords: state.coords,
  edp: state.edp,
  loadGoogleMaps: state.loadGoogleMaps,
});

export default connect(mapStateToProps, mapDispatchToProps)(LatLonModule);
