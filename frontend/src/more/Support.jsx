import React, { useEffect, useState } from 'react';
import MetaData from './MetaData';
import "./Support.css";
import BottomTab from './BottomTab.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reportDetails } from '../redux/reportSlice';
import StatusCode from '../redux/StatusCode';

const Support = () => {

    const history = useNavigate();

    const dispatch = useDispatch();
    const { status } = useSelector(state => state.report);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        setIsRendered(true);
    }, []);
    
    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log({ "name":name, "subject": subject, "email": email, "message": message });

        dispatch(reportDetails({ "name": name, "subject": subject, "email": email, "message": message })).then((response) => {
            // Redirect to home page on successful login
            console.log("TWice");
            console.log("REport Dspatch", response.payload);
            const keys = Object.keys(response.payload);
            if(keys.includes("error")) {
                console.log("payload", response);
                toast.error(response.payload.error.message);
            }
            else {
                toast.success(response.payload.data.message);
                console.log("Sent Successfully");
                history('/support');
            }
            })
            .catch((error) => {
            // Handle login error
            console.log('Report error:', error);
            toast.error(error.message);
            return;
        });
    }

    if(!isRendered || status === StatusCode.LOADING) {
        return <p>Loading...</p>
    }
  
    if(status === StatusCode.ERROR) {
        return <p>Something went wrong! try again later</p>
    }

    return (
       <>
       <MetaData title="Support"/>
       <div 
       className='support'
       style={{
           width:"100%",
           justifyContent:"center",
           alignItems:"center",
           padding:'50px 0'
       }}>
           <h2 className='support__heading' style={{
               textAlign:"center"
           }}>Hey How can we improve our services</h2>
           <h2  className='support__heading' style={{
               textAlign:"center"
           }}>Report us for something...</h2>
           <div>
               <form style={{
                   width:"400px",
                   margin:"auto",
                   padding:"20px 0"
               }} 
            //    ref={formRef}
               onSubmit={handleSubmit}
               >
                   <input type="text" placeholder='Write your Name ...' required style={{
                       border:"none",
                       outline:"none",
                       width:"100%",
                       borderBottom:"1px solid #3BB77E",
                       margin:"10px 0",
                       fontSize:"1.2vmax",
                       height:"40px"
                   }} 
                //    name='user__name'
                   value={name} 
                   onChange={(e) => setName(e.target.value)}
                   />
                    <input type="text" placeholder='Write a Subject ...' required style={{
                       border:"none",
                       outline:"none",
                       width:"100%",
                       borderBottom:"1px solid #3BB77E",
                       margin:"10px 0",
                       fontSize:"1.2vmax",
                       height:"40px"
                   }}
                //    name='user__subject'
                   value={subject} 
                   onChange={(e) => setSubject(e.target.value)}
                   />
                   <input type="email" placeholder='write your Email ...' required style={{
                       border:"none",
                       outline:"none",
                       width:"100%",
                       borderBottom:"1px solid #3BB77E",
                       margin:"10px 0",
                       fontSize:"1.2vmax",
                       height:"40px"
                   }}
                   value={email} 
                   onChange={(e) => setEmail(e.target.value)}
                   />
                   <textarea cols="30" rows="5" required placeholder='write your message ...'
                        style={{
                            border:"none",
                            outline:"none",
                            width:"100%",
                            borderBottom:"1px solid #3BB77E",
                            margin:"10px 0",
                            fontSize:"1.2vmax",
                        }}
                        // name='user__message'
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                   <button 
                   style={{
                       border:"none",
                       cursor:"pointer",
                       width:"100%",
                       background:"#3BB77E",
                       height:"40px",
                       margin:"10px 0",
                       color:"#fff",
                       fontSize:"1.2vmax"
                   }}
                   >Submit</button>
               </form>
               <div className='animation'>

               </div>
           </div>
       </div>
       <BottomTab />
       </>
    )
}

export default Support;