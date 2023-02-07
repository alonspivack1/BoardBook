import React,{useEffect,useState} from 'react'


export default function GameOfferDialog({gameOffer,handleGameOffer}) {

    const [counter, setCounter] = useState(15);
    
    const handleAccept = () => {
        // Do something when the accept button is clicked
      };
    
      const handleDecline = () => {
        // Do something when the decline button is clicked
      };
    useEffect(() => {
        if (counter === 0) {
          handleGameOffer(false);
        }
      }, [counter]);

      useEffect(()=>{
        if(gameOffer)
        {
          setCounter(15)
          const interval = setInterval(() => {
          setCounter((prevCount) => prevCount - 1);
          }, 1000);
          return () => clearInterval(interval);
        }
    
      },[gameOffer])

      
  return (
    <div className="dialog">
    <div className="counter">{counter}</div>
    <button onClick={handleAccept}>Accept</button>
    <button onClick={handleDecline}>Decline{counter}</button>
  </div>  )
}

