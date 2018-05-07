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
    this.state={shoplist:[],showLogInModal:false,showUserShops:false};//if userShops==false=>show all Shops
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
    this.userIsGoing=this.userIsGoing.bind(this);
    this.handleUserShops=this.handleUserShops.bind(this);
  }

  componentDidMount(){
    let token=sessionStorage.getItem('token');
    if(token){
      this.fetchServerToken(token);
    }
    this.fetchByCityName('paris');
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
    if(shoplist[index].users&&shoplist[index].users.includes(this.state.user.id)){
      let userIndex=shoplist[index].users.indexOf(this.state.user.id);
      shoplist[index].isGoing=true;
      shoplist[index].users.splice(userIndex,1)
    };
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
      this.setState({showLogInModal:true});
    }else{
      this.setState({showLogInModal:false})
    }
  }

  handleLogOut(){
    sessionStorage.removeItem('token');
    //change all "going" in shoplist state to false
    let shoplist=this.state.shoplist.slice();
    shoplist.forEach(each=>{each.isGoing=false});
    this.setState({user:null,shoplist});
  }

  userIsGoing(userID){//check if user already ticked on Going in a shop
    let shoplist=this.state.shoplist.slice();
    shoplist.forEach(shop=>{
      if (shop.users&&shop.users.includes(userID)){
          shop.isGoing=true;
      }
    });
    this.setState({shoplist})
  } 

  handleUserShops(){
    fetch('https://kd-coffee-shop.glitch.me/users/shops',{
      method:'get',
      headers:{
        'Content-Type':'application/json',
        'token':sessionStorage.getItem('token'),
      }
    })
    .then(res=>res.json())
    .then(res=>{
      console.log(res)
      this.setState({userShops:res,showUserShops:true})
    })
  }

  fetchByCityName(cityName){
    fetch(`https://kd-coffee-shop.glitch.me/api/shops/${JSON.stringify(cityName)}`)
    .then(res=>res.json())
    .then(res=>{
      let shoplist=res.map(each=>{return {...each,isGoing:false}});
      console.log(shoplist)
      this.setState({shoplist,isFetched:true})
    })
  }

  fetchByGeoLocation(x,y){
    fetch(`https://kd-coffee-shop.glitch.me/api/shops/${JSON.stringify([x,y])}`)
    .then(res=>res.json())
    .then(res=>{
      let shoplist=res.map(each=>{return {...each,isGoing:false}});
      this.setState({shoplist,isFetched:true})
    })
  }

  fetchServerToken(serverToken){
    fetch('https://kd-coffee-shop.glitch.me/user',{
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
    fetch('https://kd-coffee-shop.glitch.me/auth/google',{
      method:'get',
      headers:{
        access_token:token,
        'Content-Type':'application/json'
      }
    })
    .then(res=>res.json())
    .then(res=>{
      sessionStorage.setItem('token',res.token)
      this.setState({user:{id:res.id, name:res.name},showLogInModal:false})
    })
  }
  fetchUserGoingToShop(index){
    fetch('https://kd-coffee-shop.glitch.me/users/shops',{
      method:'put',
      headers:{
        "Content-Type":"application/json",
        "token":sessionStorage.getItem('token')
      },
      body:
        JSON.stringify({shop:{...this.state.shoplist[index],going:1}})
    })
    .then(res=>res.json())
    .then(res=>{
      console.log(res)
    })
  }
  fetchUserNotGoingToShop(id){
    fetch('https://kd-coffee-shop.glitch.me/users/shops',{
      method:'delete',
      headers:{
        'Content-Type':'application/json',
        'token':sessionStorage.getItem('token')
      },
      body:JSON.stringify(
        {
          shop:{id}
        })
    }).then(res=>res.json())
    .then(res=>{console.log(res)})
  }

  render() {
    return (
      <div>
        <Navbar 
          handleLogInPanel={this.handleLogInPanel}
          user={this.state.user}
          handleUserShops={()=>this.handleUserShops(this.state.user.id)}
          handleViewAllShops={()=>{this.setState({showUserShops:false})}}
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
              shoplist={this.state.showUserShops&&this.state.user?this.state.userShops: this.state.shoplist} 
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
