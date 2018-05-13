import 'core-js/fn/object/assign';
import ReactDOM from 'react-dom';
import './index.css';
import { makeMainRoutes } from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const routes = makeMainRoutes();

ReactDOM.render(
  routes,
  document.getElementById('app')
);
