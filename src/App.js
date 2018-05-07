import React, { Component } from 'react';
import './App.css';
import ShopList from './shopList';
import Cover from './cover'
import {Grid} from 'react-bootstrap'
import LogInModal from './login'
import Navbar from './nav'
class App extends Component {
  constructor(){
    super();
    this.state={shoplist:[],showLogInModal:false}
    this.getGeoLocation=this.getGeoLocation.bind(this);
    this.fetchByGeoLocation=this.fetchByGeoLocation.bind(this);
    this.getCityName=this.getCityName.bind(this);
    this.fetchByCityName=this.fetchByCityName.bind(this);
    this.handleGoing=this.handleGoing.bind(this);
    this.responseGoogle=this.responseGoogle.bind(this);
    this.fetchUserGoingToShop=this.fetchUserGoingToShop.bind(this);
    this.handleLogInPanel=this.handleLogInPanel.bind(this);
    this.handleLogOut=this.handleLogOut.bind(this);
    this.fetchServerToken=this.fetchServerToken.bind(this);
  }

  componentDidMount(){
    let token=sessionStorage.getItem('token');
    if(token){
      this.fetchServerToken(token);
    }
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
        this.fetchByGeoLocation(x,y)
      })
    }else{
      alert('Geolocation is not supported by this browser')
    }
  }

  responseGoogle(response){
    console.log(response);
    this.fetchUser(response.tokenObj.access_token);
    //tell server that I am authenticated by google
    //server then will verify if you "actually" authenticated by user
    //if true, server will response with a token that you will saved and use it later
  }

  handleGoing(index,id){
    let shoplist=this.state.shoplist.slice();
    if(this.state.user){
      if(!this.state.shoplist[index].isGoing){
        shoplist[index].going++;
        shoplist[index].isGoing=true
        this.fetchUserGoingToShop(index,id);
      }else{
        shoplist[index].going--;
        shoplist[index].isGoing=false;
        this.fetchUserNotGoingToShop(id);
      }
      this.setState({shoplist});
    }else{
      this.setState({showLogInModal:true})
    }
  }

  handleLogInPanel(){
    if(!this.state.showLogInModal){
      this.setState({showLogInModal:true});console.log('aa')
    }else{
      console.log('bb')
      this.setState({showLogInModal:false})
    }
  }

  handleLogOut(){
    sessionStorage.removeItem('token');
    this.setState({user:null})
  } 

  fetchByCityName(cityName){
    fetch(`/api/shops/${JSON.stringify(cityName)}`)
    .then(res=>res.json())
    .then(res=>{
      let shoplist=res.map(each=>{return {...each,isGoing:false}});
      console.log(shoplist)
      this.setState({shoplist,isFetched:true})
    })
  }

  fetchByGeoLocation(x,y){
    fetch(`/api/shops/${JSON.stringify([x,y])}`)
    .then(res=>res.json())
    .then(res=>{
      let shoplist=res.map(each=>{return {...each,isGoing:false}});
      this.setState({shoplist,isFetched:true})
    })
  }

  fetchServerToken(serverToken){
    fetch('/user',{
      method:'get',
      headers:{
        "Content-Type":"application/json",
        token:serverToken
      }
    })
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
        this.setState({user:{id:res.id, name:res.name}})
    })
  }
  fetchUser(token){
    fetch('/auth/google',{
      method:'get',
      headers:{
        access_token:token,
        'Content-Type':'application/json'
      }
    })
    .then(res=>res.json())
    .then(res=>{
      console.log(res)
      sessionStorage.setItem('token',res.token)
      this.setState({user:{id:res.id, name:res.name},showLogInModal:false})
    })
  }
  fetchUserGoingToShop(index){
    fetch('/users/shops',{
      method:'put',
      headers:{
        "Content-Type":"application/json",
        "token":sessionStorage.getItem('token')
      },
      body:
        JSON.stringify({shop:this.state.shoplist[index]})
    })
    .then(res=>res.json())
    .then(res=>{
      console.log(res)
    })
  }
  fetchUserNotGoingToShop(id){
    fetch('/users/shops',{
      method:'delete',
      headers:{
        'Content-Type':'application/json',
        'token':sessionStorage.getItem('token')
      },
      body:JSON.stringify(
        {
          shop:
            {id,
            deletingDate:Date.now() 
          }
        })
    })
  }

  render() {
    return (
      <div>
        <Navbar 
          handleLogInPanel={this.handleLogInPanel}
          user={this.state.user}
           handleLogOut={this.handleLogOut}
        />
        <Cover getGeoLocation={this.getGeoLocation}
                getCityName={this.getCityName}
        />
        <LogInModal 
          responseGoogle={this.responseGoogle}
          showLogInModal={this.state.showLogInModal}
          handleLogInPanel={this.handleLogInPanel}
        />
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
