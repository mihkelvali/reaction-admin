import { useState, useEffect } from 'react'
import { socket } from './socket';
import './App.css'

function App() {
  const [isAnsweringOpen, setIsAnsweringOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [team, setTeam] = useState<string | null>(null);
  const URL = 'https://reaction-be-production.up.railway.app'
  
  
  const toggleAnswering = async () => {
    const response = await fetch(`${URL}/toggle`, {
      method: 'PUT'
    }).then(res => res.json());
    setIsAnsweringOpen(response.isAnsweringOpen);
    console.log(isAnsweringOpen);
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(`${URL}/toggle`).then(res => res.json());
      setIsAnsweringOpen(response.isAnsweringOpen);
      console.log(isAnsweringOpen);
    })();
  }, [])

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChangeStateEvent({ isOpen }: { isOpen: boolean }) {
      setIsAnsweringOpen(isOpen);
      console.log('state changed to:', isOpen);
    }

    function onChangeTeamEvent({ teamName }: { teamName: string }) {
      setTeam(teamName);
      console.log('team changed to:', team);
    }

    socket.emit('getState');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('emitState', onChangeStateEvent);
    socket.on('emitTeam', onChangeTeamEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('emitState', onChangeStateEvent);
    };
  }, []);

  return (
    <>
      <div>
        <div>
          { isConnected ? 'Connected' : 'Disconnected' }
        </div>
        <div>
          { isAnsweringOpen ? 'Answering is open' : 'Answering is closed' }
        </div>
        <button onClick={toggleAnswering}>{ isAnsweringOpen ? 'Close' : 'Open' } Answering</button>
        <div>
          { team ? `Team: ${team}` : 'No team' }
        </div>
      </div>
    </>
  )
}

export default App
