import { BrowserRouter as Router } from 'react-router-dom';
import { FoodsContextProvider } from './hooks/UseFoods';

import Routes from './routes';

import GlobalStyle from './styles/global';

const App = () => (
  <FoodsContextProvider>
    <GlobalStyle />
    <Router>
      <Routes />
    </Router>
  </FoodsContextProvider>
);

export default App;
