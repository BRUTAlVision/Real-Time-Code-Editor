import React, { useState } from 'react'
import logo from '../images/logo.jpg'
import { v4 as uuidV4 } from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setusername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Create a new room ');

    }
    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Room Id & Username is required')
        }
        else {

            //redirect 
            navigate(`/editor/${roomId}`, {
                state: {
                    username
                },
            })
        }
    }
    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
    return (
        <>
            <div className="homePageWrapper">
                <div className="formWrapper">
                    <img className='homePageLogo' src={logo} alt="logo" />
                    <h4 className='mainlabel'>Paste invitation ROOM ID</h4>
                    <div className="inputGroup">
                        <input type="text" className='inputBox' placeholder='ROOM ID' value={roomId} onChange={(e) => setRoomId(e.target.value)}  onKeyUp={handleInputEnter} />
                        <input type="text" className='inputBox' placeholder='USERNAME' value={username} onChange={(e) => setusername(e.target.value)}  onKeyUp={handleInputEnter}/>
                        <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                        <span className='createInfo'>If you don't have invite then create &nbsp; <a onClick={createNewRoom} href="#" className='createNewBtn'>new room</a></span>
                    </div>
                </div>
                <footer>
                    <h4>Built with ❤️ By Ujjwal Garg</h4>
                </footer>
            </div>


        </>
    )
}

export default Home