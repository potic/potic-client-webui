import 'core-js/fn/object/assign';
import ReactDOM from 'react-dom';
import { makeMainRoutes } from './routes';
import './index.css';

const routes = makeMainRoutes();

ReactDOM.render(
  routes,
  document.getElementById('app')
);
