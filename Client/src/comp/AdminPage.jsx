import React, { useEffect, useState } from 'react'
import Demo2 from "/Demo2.jpg"


export default function AdminPage() {

    const [ProductName,SetProductname]=useState('');
    const [ProductCost,SetProductCost]=useState('');
    const [ProductImage,SetProductImage]=useState(null);
    const [AvailableProduct,SetAvailableProduct]=useState(null);
    const [Responce,setResponse]=useState();
    
    const [isHovered, setIsHovered] = useState(false);
    const [animation,SetrAnimation]=useState(true)
    const [users,setUsers]=useState(false)
    const [Orders,setOrders]=useState(false)
    const [product,setProduct]=useState(false)
    const [updateOrders,SetUpdateOrders]=useState(false)


    const [AdminInfo,SetAdminInfo]=useState([]);
    const [UserInfo,SetUserInfo]=useState([]);
    const [ProductINfo,SetProductInfo]=useState([]);
    const [OrderInfo,SetOrderInfo]=useState([]);

    const [error,setError]=useState(null);

      const User_ID = "7d10b864-786f-4b60-b160-b4d1df349ba1";
      const token = localStorage.getItem("token");

  // Admin INformation function
    useEffect(() => {
    async function getAdminInfo() {
      
  

      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      
      try {
        const respons = await fetch(`https://localhost:7077/api/Admin/getAdminInfo?RoleId=${User_ID}`, {
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
          SetAdminInfo(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    }

    getAdminInfo(); 
  }, []); 



    // Product Insert Function
    async function InsertProduct(e) {
      e.preventDefault();
      try {

        if (!ProductImage) {
            console.error('No company image selected.');
            return;
        }
        const formData = new FormData();
        formData.append('ProductName', ProductName);
        formData.append('ProductCost', ProductCost);
        formData.append('ProductImage', ProductImage);
        formData.append('IsAvailable',AvailableProduct)

        const resp = await fetch("https://localhost:7077/api/Product/InsertProductInformation", {
          method: "POST",
          body:formData
        });

        if (resp.ok) {
            console.log("Data uploaded successfully!");
           setResponse("Data uploaded successfully!");
           SetProductname('');
           SetProductCost('');
           SetProductImage(null);
           SetAvailableProduct(null);
            getProductInfo();
        } else {
            console.error("Failed to upload data. Status:", resp.status);
            const errorText = await resp.text();
            console.error("Error from server:", errorText);
             setResponse(errorText)
        }
        console.log("Data Inserted Successfully");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Users Information function
    async function getUsersInfo(e) {
      e.preventDefault();
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      
      try {
        const respons = await fetch("https://localhost:7077/api/Admin/getUserInfo", {
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
          SetrAnimation(false);
          setUsers(true);
          setOrders(false);
          setProduct(false);
          SetUpdateOrders(false);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    }


    // Product Information function
    
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
          SetProductInfo(data);
          SetrAnimation(false);
          setUsers(false);
          setOrders(false);
          setProduct(true);
          SetUpdateOrders(false)
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }finally{

      }
    }
    
    

    // Get all Orders
   async function getOrdersInfo() {
      try {
        const respons = await fetch("https://localhost:7077/api/Admin/getAllOrders", {
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
          SetOrderInfo(data);
          SetrAnimation(false);
          setUsers(false);
          setOrders(true);
          setProduct(false);
          SetUpdateOrders(false)
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }finally{
        console.log(OrderInfo)
      }
    }
    



    
    async function DeleteProduct(val){
      try {
        const respons = await fetch(`https://localhost:7077/api/Product/DeleteSurvice?ProductID=${val}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!respons.ok) {
          const errorData = await respons.json();
          throw new Error(errorData.title || 'Failed to fetch admin info.');
        } else {
          getProductInfo();
          alert("Data Deleated Successfully")
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    }


  return (
    <div style={{width:'100vw',backgroundRepeat:'no-repeat',backgroundSize:'cover',backgroundImage:`url(${Demo2})`, height:'100vh',display:'flex',justifyContent:'center', alignItems:'center'}}>
      <div style={{width:'25%',margin:'5%',border:'2px solid white',borderRadius:'10%',color:'black'}}>
        <h2 style={{color:'#FF3E80'}}>Profile</h2>
        {AdminInfo.map(ele=>(
            <div style={{color: 'black',border: '1px solid #ddd',backgroundColor:'#FFE8E8',borderRadius: '10px',padding: '20px',margin: '15px',display: 'flex',flexDirection: 'column',alignItems: 'center',textAlign: 'center',transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',transform: isHovered ? 'scale(1.05)' : 'scale(1)',boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 8px rgba(0,0,0,0.1)'}}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}>
              <img style={{width: '200px',height: '200px', borderRadius: '50%', objectFit: 'cover',border: '4px solid #fff',boxShadow: '0 2px 4px rgba(0,0,0,0.1)',transition: 'transform 0.3s ease-in-out',transform: isHovered ? 'scale(1.1)' : 'scale(1)'}} src={`data:image/png;base64,${ele.bioImage}`} alt='User Profile'/>
              <h2 style={{ marginTop: '15px', marginBottom: '5px' }}>{ele.bioName}</h2>
              <h4 style={{ margin: '5px 0', color: '#555' }}>{ele.bioDesignation}</h4>
              <h5 style={{ margin: '5px 0', color: '#888' }}>{ele.userID}</h5>
            </div>
          ))}
        
    
      </div>

      <div  style={{width:'60%',height:'90%',display:'flex',flexDirection:'column',margin:'5%'}}>

      <div style={{width:'80%',display:'flex',justifyContent:'space-between'}}>
        <button onClick={getProductInfo}>Products</button>
        <button onClick={getUsersInfo}>Get Users</button>
        <button onClick={getOrdersInfo}>Orders</button>
        <button onClick={()=>{SetrAnimation(false);setUsers(false);setOrders(false);setProduct(false);SetUpdateOrders(true)}}>Update on orders</button>
      </div>
    
      {/* {animation&&
      
        <video width="100%" height="90%" loop autoPlay muted>
          <source src={Player} type="video/mp4"/> 
        </video>
      
      } */}
      {product &&
      <div className='example' style={{width:'80%',height:'100%',border:'2px solid white',borderRadius:'7px',color:'black',backgroundColor:'transparent',margin:'5%',padding:'5%'}}>
      <form onSubmit={InsertProduct}>
        <input name="productName" value={ProductName} type="text" required placeholder="Enter the Product Name" onChange={(e)=>SetProductname(e.target.value)} style={{ width: '48%', padding: '10px', boxSizing: 'border-box' }}/>
        <input name="productCost" value={ProductCost} type="text" required placeholder="Enter the Product Cost" onChange={(e)=>SetProductCost(e.target.value)} style={{ width: '48%', padding: '10px', boxSizing: 'border-box' }}/>
        <label><b>Upload the image :</b></label>
        <input name="productImage" accept="image/*" type="file" onChange={(e)=>SetProductImage(e.target.files[0])} style={{ width: '70%', padding: '10px', boxSizing: 'border-box' }}/>
        <div  style={{ width: '70%', boxSizing: 'border-box' }}>
          <b style={{  boxSizing: 'border-box' }}>Product Availability : </b>
          <b>Available</b><input type="radio" name="available" onChange={(e)=>SetAvailableProduct(true)} style={{ width: '5%'}}/>
          <b>Not Available</b><input type='radio'  name='available' onChange={(e)=>SetAvailableProduct(false)} style={{ width: '5%'}}/>
        </div>
        <button style={{margin:'2%',backgroundColor:'green'}} type='submit'>Add</button>
      </form>
      {Responce && <p>{Responce}</p>}
      <div >
      {ProductINfo.map(ele=>(
            <div style={{color:'black',width:'100%',height:'15vh',display:'flex',flexDirection:'row',border:'2px solid black',margin:'2%',justifyContent:'space-between',borderRadius:'5px'}}>
              <h2 style={{margin:'2%'}}>{ele.productId}</h2>
              <h2>{ele.productName}</h2>
              <h4>{ele.productCost}</h4>
              <h5>{ele.isAvailable?<p style={{color:'green'}}>Available</p>:<p style={{color:'red'}}>Not Available</p>}</h5>
              <button onClick={()=>DeleteProduct(ele.productId)} style={{margin:'3%',backgroundColor:'red'}}>Delete</button>
              <img style={{width:'20%'}} src={`data:image/png;base64,${ele.productImage}`} alt='Their is an Image'/>
              
            </div>
          ))}
        
    </div>
      </div>
      
      }
      {users && 
        <div  className='example' style={{backgroundColor:'transparent',width:'80%',height:'100vh',border:'2px solid white',borderRadius:'7px',color:'black',margin:'5%',padding:'5%',display:'grid',gridTemplateColumns: '50% 50%',gridGap: '10px' }}>
          {
            UserInfo.map(ele=>(
              <div style={{display: 'flex',backgroundColor:'white',flexDirection: 'row', alignItems: 'center', padding: '10px', border: '1px solid #ddd',borderRadius: '8px', marginBottom: '10px',boxShadow: '0 2px 4px rgba(0,0,0,0.1)',transition: 'transform 0.2s ease-in-out',}}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <img style={{width: '100px',height: '100px',borderRadius: '50%',objectFit: 'cover',marginRight: '15px'}} src={`data:image/png;base64,${ele.imageData}`} alt='User profile image'/>
                <div style={{display: 'flex',flexDirection: 'column',justifyContent: 'center'}}>
                  <h5 style={{margin: '0', fontSize: '1.2em', fontWeight: 'bold'}}>{ele.userName}</h5>
                  <h6 style={{margin: '5px 0 0 0', color: '#555', fontSize: '1em'}}>{ele.designation}</h6>
                </div>
              </div>
            ))

          }
        </div>
      }
      {Orders && 
      <div  className='example' style={{width:'100%',height:'100%',margin:'2%'}}>
        <table style={{width:'100%',height:'100%',color:'black',borderStyle:'dotted'}}>
          <tr>
                <th>Order No:</th>
                <th>Product No:</th>
                <th>Customer Name:</th>
                <th>Address:</th>
              </tr>
        {
          OrderInfo.map(e=>(
              <tr>
                <td>{e.orderId}</td>
                <td>{e.productID}</td>
                <td>{e.userName}</td>
                <td>{e.state},{e.district},{e.taluk},{e.vilage},{e.street},{e.housNumber}</td>
              </tr>
           
          ))}
          </table>
      </div>}
      {updateOrders && <div>Update information</div>}
    </div>
    </div>
  )
}
