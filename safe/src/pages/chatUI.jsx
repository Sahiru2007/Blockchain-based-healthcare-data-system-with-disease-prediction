/* import React, { useEffect, useState } from 'react';
import { ZIM } from 'zego-zim-web';
import { ZIMKitManager, Common } from '@zegocloud/zimkit-react';
import '@zegocloud/zimkit-react/index.css';

const id = Math.floor(Math.random()*1000)
function Chatting() {
const [state, setState] = useState(

{
    appConfig: {
        appID: 1607827676,
        serverSecret: '740f6a3475378709efc3da4dae3fa51c'
    },
        
        userInfo: {

        userID: `Sahiru${id}`,
      
        userName: `Sahiru${id}`,
     
        userAvatarUrl: '' 
    }
    }
)
useEffect(() =>{
    const init = async()=>{

            const zimkit = new ZIMKitManager();
            const token = zimkit.generateKitTokenForTest(state.appConfig.appID,state.appConfig.serverSecret, state.userInfo.userID);
            await zimkit.init(state.appConfig.appID);
            await zimkit. connectUser(state.userInfo, token);
   
        }
        init()
    }, 
[])


    return (
        <div className='p-5 flex flex-col'>

           <Common></Common>

        </div>
    );
}

export default Chatting; *\