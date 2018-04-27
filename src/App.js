import React, { Component } from 'react';
import './App.css';
import ShopList from './shopList';
import Cover from './cover'
import {Grid} from 'react-bootstrap'
class App extends Component {

  componentDidMount(){
    fetch('/api')
    .then(res=>res.json())
    .then(result=>{
      result.sort((a,b)=>b.rating-a.rating);
      this.setState({shoplist:result})
    })
  }

  render() {
    if (!this.state) return <div>Loading data...</div>
    return (
      <div>
        <Cover />
        <Grid className="App" fluid>
          <ShopList shoplist={this.state.shoplist} />
        </Grid>
      </div>
    );
  }
}

export default App;
