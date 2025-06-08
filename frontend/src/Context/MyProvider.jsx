import React, {useState} from 'react'
import { myContext } from './MyContext';
function MyProvider({children}) {
    const [user,setUser]= useState("Abdullah bhatti");
  return (
    <myContext.Provider value={{user,setUser}}>
        {children}
    </myContext.Provider>
  )
}

export default MyProvider