import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { MdStars } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { FcDebian } from "react-icons/fc";
import { Link } from 'react-router-dom';
import Demo3 from '/Demo3.webp'




export default function HomePage() {

  const [allProducts, setAllProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [enteredProduct, setEnteredProduct] = useState('');
  const [UserInfo,SetUserInfo]=useState([]);

  const Navigater=useNavigate();

  const token = localStorage.getItem("token");
  const username=localStorage.getItem("user")


  function FilterProduct(Products){
    setEnteredProduct(Products);

    if (Products === '') {
        setFilteredProducts(allProducts);
    } else {
        const filtered = allProducts.filter(e => e.productName.toLowerCase().includes(Products.toLowerCase()));
        setFilteredProducts(filtered);
    }
  }

  


  useEffect((e)=>{
    //e.preventDefault();
    async function getProductInfo() {
      try {
        const respons = await fetch("https://localhost:7077/api/Product/getAllProducts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!respons.ok) {
          const errorData = await respons.json();
          throw new Error(errorData.title || 'Failed to fetch admin info.');
        } else {
          const data = await respons.json();
          setAllProducts(data);
          setFilteredProducts(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    }
    getProductInfo();
  },[])


  useEffect(() => {
    async function getUserInfo() {
      
  

      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      
      try {
        const respons = await fetch(`https://localhost:7077/api/User/getUserInfo?UserName=${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!respons.ok) {
          const errorData = await respons.json();
          throw new Error(errorData.title || 'Failed to fetch admin info.');
        } else {
          const data = await respons.json();
          SetUserInfo(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    getUserInfo(); 
  }, []); 

  





  return (
    <div style={{width:'100vw',height:'100%'}}>
      <div style={{width:'100vw',height:'15vh',backgroundColor:'pink',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
        <div style={{fontFamily: 'cursive',fontSize:'10vh',color:'#FF3E80'}}><FcDebian/>Candy Man</div>
        <div style={{width:'30%',height:'40%',backgroundColor:'white',borderRadius:'10px',display:'flex',alignItems:'center'}}>
          
          <input onChange={(e)=>FilterProduct(e.target.value)}  value={enteredProduct} placeholder='Search' style={{width:'90%',height:'100%',backgroundColor:'white',borderRadius:'5px',border:'none',color:'black'}} type='search'/>
          <FaSearch style={{color:'black',width:'10%',fontSize:'1.2rem'}}/>
          </div>
          
        <button onClick={()=>Navigater('/login')}>Login</button>
        {
          UserInfo.map(e=>(
              <div >
                <img style={{width:'50px',borderRadius:'50%'}} src={`data:image/png;base64,${e.bioImage}`} alt="Profile Pic" />
                <div style={{color:'black'}}>{e.bioName}</div>
            </div>
          ))  
        }
        
      </div>
      <div style={{display:'grid',backgroundImage:`url(${Demo3})`,backgroundRepeat:'no-repeat',backgroundSize:'cover',gridTemplateColumns: '20% 20% 20% 20% ',gridGap: '5vw',padding:'5%',}}>
          {filteredProducts.map(ele=>(
            <div className='card' style={{color:'black', borderRadius:'5%',backgroundColor:'pink',border:'2px solid black',textAlign:'left'}}>
              
              <img style={{width:'100%', borderTopLeftRadius:'5%',borderTopRightRadius:'5%'}} src={`data:image/png;base64,${ele.productImage}`} alt='Their is an Image'/>
              <div style={{fontFamily: 'cursive',fontSize:'4vh',color:'#FF3E80',margin:'2%'}}>{ele.productName}</div>
              <div style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                <div>
                    <div style={{margin:'2%'}}><FaDollarSign/>Cost : {ele.productCost}</div>
                  <div style={{margin:'2%'}}>{ele.isAvailable?<div style={{color:'green'}}><MdStars/>Available</div>:<div style={{color:'red'}}><MdStars/>Not Available</div>}</div>
                </div>
                {/* <Link to={{
                  pathname: '/booking',
                  state: ele
                 }}><button style={{height:'50%',backgroundColor:'green'}}>Buy</button></Link> */}
                 <Link to={`/booking/${ele.productId}`}>
                    <button style={{ height: '50%', backgroundColor: 'green' }}>Buy</button>
                 </Link>
              </div>

            </div>
          ))}
      </div>
        
    </div>
  )
}
