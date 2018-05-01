import React, { Component } from 'react';
import './App.css';
import ShopList from './shopList';
import Cover from './cover'
import {Grid} from 'react-bootstrap'
import GoogleLogIn from './login'
class App extends Component {
  constructor(){
    super();
    this.state={shoplist:[]}
    this.getGeoLocation=this.getGeoLocation.bind(this);
    this.fetchByGeoLocation=this.fetchByGeoLocation.bind(this);
    this.getCityName=this.getCityName.bind(this);
    this.fetchByCityName=this.fetchByCityName.bind(this);
    this.handleGoing=this.handleGoing.bind(this);
    this.responseGoogle=this.responseGoogle.bind(this);
  }

  componentDidMount(){
    this.fetchByCityName('paris')
  }

  getCityName(e){
    e.preventDefault();
    this.setState({isFetched:false})
    const cityName =document.getElementsByTagName('input')[0].value;
    this.fetchByCityName(cityName)
  }

  getGeoLocation(){
    this.setState({isFetched:false})
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position=>{
        const x=position.coords.latitude;
        const y=position.coords.longitude;
        console.log(x,y)
        this.fetchByGeoLocation(x,y)
      })
    }else{
      alert('Geolocation is not supported by this browser')
    }
  }

  fetchByCityName(cityName){
    fetch(`/api/${JSON.stringify(cityName)}`)
    .then(res=>res.json())
    .then(res=>{
      this.setState({shoplist:res,isFetched:true})
    })
  }

  fetchByGeoLocation(x,y){
    fetch(`/api/${JSON.stringify([x,y])}`)
    .then(res=>res.json())
    .then(res=>{
      this.setState({shoplist:res,isFetched:true})
    })
  }

  fetchUser(token){
    fetch('/auth/google',{
      method:'get',
      headers:{
        // Authorization: `Bearer ${token}`,
        access_token:token,
        'Content-Type':'application/json'
      }
    })
  }

  fetchtest(token){
    fetch('/hello',{
      method:'get',
      headers:{
        // Authorization: `Bearer ${token}`,
        access_token:token,
        'Content-Type':'application/json'
      }
    })
    .then(res=>res.json())
    .then(res=>{console.log(res)})
  }

  responseGoogle(response){
    console.log(response);
    this.fetchUser(response.tokenObj.access_token+1)
    this.setState({token:response.tokenObj.access_token})
  }
  handleGoing(index){
    let shoplist=this.state.shoplist.slice();
    shoplist[index].going++;
    this.setState({shoplist});
  }
  render() {
    return (
      <div>
        <Cover getGeoLocation={this.getGeoLocation}
                getCityName={this.getCityName}
        />
        <button onClick={()=>this.fetchtest(this.state.token)}>test</button>
        <GoogleLogIn responseGoogle={this.responseGoogle}/>
        {this.state.isFetched?
          <Grid className="App" fluid>
            <ShopList 
              shoplist={this.state.shoplist} 
              handleGoing={this.handleGoing}
            />
          </Grid>:
          <div className="loader"></div>
        }
      </div>
    );
  }
}

export default App;
