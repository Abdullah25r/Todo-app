import React, { useContext } from 'react'
import { myContext } from '../Context/MyContext'

function StudentList() {
  const {user, setUser} = useContext(myContext)
  return (
    <div>
      <p>{user}</p>
      <button onClick={()=> setUser("Student Name: ahmad ali butt ")}>update</button>
    </div>
  )
}

export default StudentList