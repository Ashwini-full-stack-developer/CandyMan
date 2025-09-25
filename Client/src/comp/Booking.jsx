import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Demo4 from '/Demo4.jpg'

export default function Booking() {
  const { productId } = useParams();
  const [product, setProduct] = useState([]);

  const [ProductID,SetProductID]=useState(0);
  const [UserName,SetUserName]=useState('');
  const [State,SetState]=useState('');
  const [District,SetDistrict]=useState('');
  const [Taluk,SetTaluk]=useState('');
  const [Vilage,SetVilage]=useState('');
  const [Street,SetStreet]=useState('');
  const [HousNumber,SetHousNumber]=useState('');
 

  useEffect((e)=>{
     async function getProductInfo() {
       try {
         const respons = await fetch(`https://localhost:7077/api/Product/getProductByID?ProductID=${productId}`, {
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
           setProduct(data);
         }
       } catch (err) {
         console.error('Fetch error:', err);
         //setError(err.message);
       }
     }
     getProductInfo();
   },[])
 

    const token = localStorage.getItem("token");
    const username=localStorage.getItem("user");


    

    async function InsertOrderInfo() {
      
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      
      try {
        const respons = await fetch('https://localhost:7077/api/User/InsertOrderInformation', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body:JSON.stringify({productID:productId,userName:username,state:State,district:District,taluk:Taluk,vilage:Vilage,street:Street,housNumber:HousNumber})
        });

        if (!respons.ok) {
          const errorData = await respons.json();
          throw new Error(errorData.title || 'Failed to fetch admin info.');
        } else {
          const data = await respons.json();
          SetAdminInfo(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    }



  return (
    <div style={{width:'100vw',height:'100vh',backgroundImage:`url(${Demo4})`,backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
      <div style={{width:'100vw',height:'10vh',fontSize:'3rem',fontFamily: 'cursive',color:'#FF3E80'}}>Book You'r Favorates</div>
      <div style={{width:'100vw',height:'90vh',display:'flex',flexDirection:'row'}}>
        <div style={{width:'40%',padding:'5%',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
          <div style={{fontFamily: 'cursive',fontSize:'2rem',margin:'3%',color:'#FF3E80'}}>Product</div>
          {
              product.map(e=>(
                <div style={{width:'70%',border:'2px solid black',borderRadius:'5%',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                  <img src={`data:image/png;base64,${e.productImage}`} alt={product.productName} style={{width:'100%',borderTopRightRadius:'5%',borderTopLeftRadius:'5%' }} />
                  <div style={{width:'100%',textAlign:'start'}}>
                      <div style={{color:'#FF3E80',fontSize:'1.5rem',fontFamily: 'cursive'}}>{e.productName}</div>
                      <p style={{margin:'0px',fontSize:'1.2rem',color:'green'}}>Cost: ${e.productCost}</p>
                      <p style={{margin:'0px',padding:'0.5rem',color:'black'}}>Your everyday moments become special as our chocolates add a touch of indulgence to your daily life</p>
                  </div>
                  
               </div>
            ))
          }
        </div>
        <div style={{ padding: '20px', border: '2px solid #FF3E80', borderRadius: '8px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
          <h2 style={{color:'#FF3E80'}}>Fill The address:</h2>
          <form>
            <input value={State} onChange={(e)=>SetState(e.target.value)} style={{marginBottom: '10px', width: '50%', padding: '10px', boxSizing: 'border-box' }} type='text'name='state'/>
            <input value={District} onChange={(e)=>SetDistrict(e.target.value)} style={{marginBottom: '10px', width: '50%', padding: '10px', boxSizing: 'border-box' }} type='text' name='district'/>
            <input value={Taluk} onChange={(e)=>SetTaluk(e.target.value)} style={{marginBottom: '15px', width: '50%', padding: '10px', boxSizing: 'border-box' }} type='text' name='taluk'/>
            <input value={Vilage} onChange={(e)=>SetVilage(e.target.value)} style={{marginBottom: '15px', width: '50%', padding: '10px', boxSizing: 'border-box' }} type='text' name='vilage'/>
            <input value={Street} onChange={(e)=>SetStreet(e.target.value)} style={{marginBottom: '15px', width: '50%', padding: '10px', boxSizing: 'border-box' }} type='text' name='street'/>
            <input value={HousNumber} onChange={(e)=>SetHousNumber(e.target.value)} style={{marginBottom: '15px', width: '50%', padding: '10px', boxSizing: 'border-box' }} type='text' name='housnumber'/>
            <button style={{backgroundColor:'green'}} onClick={InsertOrderInfo}>Book Now</button>
          </form>
        </div>
      </div>
      
      
    </div>
  );
}