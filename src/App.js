import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { AdsList } from "./features/Ads/AdsList";
import { SearchResult } from "./features/Ads/SearchResult";
import { Home } from "./features/Home/Home";
import { Nav } from "./components/Nav/Nav";
import { Auth } from "./features/Auth/Auth";
import { AuthContextProvider } from "./features/Auth/Auth.context";
import { AdsDetails } from "./features/Ads/AdsDetails";
import { UserProfile } from "./components/Profile/UserProfile";
import { EditAd } from "./features/Ads/EditAd";
import { EditProfile } from "./components/Profile/EditProfile";
import { UserDelete } from "./components/Profile/UserDelete";
import { NewAd } from "./features/Ads/NewAd";

import "./App.css";

function App() {
  return (
    <div className="container">
      <AuthContextProvider>
        <Router>
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/ads" component={AdsList} />
            <Route path="/newad" component={NewAd} />
            <Route exact path="/ads/:id" component={AdsDetails} />
            <Route exact path="/ads/edit/:id" component={EditAd} />
            <Route path="/searchresult" component={SearchResult} />
            <Route path="/login" component={Auth} />
            <Route path="/signup" component={Auth} />
            <Route path="/profile" component={UserProfile} />
            <Route exact path="/users/:id" component={EditProfile} />
            <Route exact path="/users/delete/:id" component={UserDelete} />
            <Route path="*" component={() => <h1>404 Page not found</h1>} />
          </Switch>
        </Router>
      </AuthContextProvider>
    </div>
  );
}

export default App;
