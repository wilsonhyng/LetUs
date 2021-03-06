// import { AppContainer } from 'react-hot-loader';
import React            from 'react';
import { render }       from 'react-dom';
import { Router, browserHistory, Route, IndexRoute } from 'react-router';
// Redux
import { createStore }  from 'redux';
import { Provider }     from 'react-redux';
import { reducer }      from './redux/reducer';
// CSS
import '../../node_modules/onsenui/css/onsenui.css';
import '../../node_modules/onsenui/css/onsen-css-components-dark-theme.css';
import './styles/mapStyle.css';
// Views
import Home             from './views/home/home.jsx';
import HomeEvent        from './views/home/components/event.jsx';
import Create           from './views/plan/create.jsx';
import Collaborate      from './views/plan/collaborate.jsx';
import Loading          from './views/plan/loading.jsx';
import Invite           from './views/plan/invite.jsx';
import Login            from './views/login/login.jsx';
import LiveList         from './views/plan/liveList.jsx';
import Event            from './views/event/event.jsx';
import Profile          from './views/profile/profile.jsx';
import Friends          from './views/profile/friends.jsx';
import About            from './views/profile/about.jsx';
import LatLonModule     from './views/plan/latlonmodule.jsx';

const store = createStore(reducer);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={Login}>
        <IndexRoute component={Login} />
      </Route>
      <Route>
        <Route path='home'   component={Home} />
        <Route path='homeevent' component={HomeEvent} />
        <Route path='invite' component={Invite} />
        <Route path='create' component={Create} />
        <Route path='search' component={LatLonModule} />
        <Route path='collaborate' component={Collaborate} />
        <Route path='c/*' component={Loading} />
        <Route path='live' component={LiveList} />
        <Route path='event' component={Event} />
        <Route path='profile' component={Profile} />
        <Route path='friends' component={Friends} />
        <Route path='about' component={About} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'),
);
