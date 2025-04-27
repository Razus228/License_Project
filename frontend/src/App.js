import React, { useEffect, useState} from 'react';

function App() {
  const url ='https://api.api-ninjas.com/v1/cars';
  const [carData, setCarData] = useState([{}]);

  useEffect(() => {
      fetch(`${url}`).then(
          res => res.json()
      ).then(
        data => {
          setCarData(data)
          console.log(data)
        }
      )
  }, []);
  return (
    <div>
        {(typeof carData.results === 'undefiend') ? (
          <div>
            <p>Data is loading ...</p>
          </div>
        ): (
          <div>
            <p>Data has loaded successfully!</p>
          </div>
        )}
    </div>
  );
}




export default App;


