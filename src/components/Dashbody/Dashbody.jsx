import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import './Dashbody.css'; 
import "../../App.css";

const Dashbody = () => {
    const navigate = useNavigate();

    const [weight, setWeight] = useState('');
    const [bp, setBp] = useState('');
    const [sugar, setSugar] = useState('');

    const handleSubmit = () => {
        console.log('Submitted Data:', { weight, bp, sugar });
        alert(`Submitted:\nWeight: ${weight} kg\nBP: ${bp} mmHg\nSugar: ${sugar} mg/dL`);
        setWeight('');
        setBp('');
        setSugar('');
    };

    return (
        <div className='dashbody-body'>
            <div className='user-text'></div>

            <div className='daily-checkin-box'>
                <h2>Daily Check-In</h2>

                <div className="form-group">
                    <label htmlFor="weight">Weight:</label>
                    <input
                        type="number"
                        id="weight"
                        placeholder="Enter your weight (in Kgs)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="bp">Blood Pressure:</label>
                    <input
                        type="text"
                        id="bp"
                        placeholder="Enter your BP (mmHg)"
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="sugar">Sugar Level:</label>
                    <input
                        type="number"
                        id="sugar"
                        placeholder="Enter your sugar level (mg/dL)"
                        value={sugar}
                        onChange={(e) => setSugar(e.target.value)}
                    />
                </div>

                <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            </div>

            <div className='graph-box'>
                <h2>Your Progress</h2>
            </div>

           
        </div>
    );
};

export default Dashbody;



// import React, { useState } from 'react';  
// import './Dashbody.css'; 
// import "../../App.css";

// const Dashbody = () => {
//     // State to hold the user input values
//     const [weight, setWeight] = useState('');
//     const [bp, setBp] = useState('');
//     const [sugar, setSugar] = useState('');

//     // Function to handle form submission
//     const handleSubmit = () => {
//         console.log('Submitted Data:', { weight, bp, sugar });
//         alert(`Submitted:\nWeight: ${weight} kg\nBP: ${bp} mmHg\nSugar: ${sugar} mg/dL`);
        
//         // Optionally, reset the fields after submission
//         setWeight('');
//         setBp('');
//         setSugar('');
//     };

//     return (
//         <div className='dashbody-body'>
//             <div className='user-text'></div>

//             <div className='daily-checkin-box'>
//                 <h2>Daily Check-In</h2>

//                 <div className="form-group">
//                     <label htmlFor="weight">Weight:</label>
//                     <input
//                         type="number"
//                         id="weight"
//                         placeholder="Enter your weight (in Kgs)"
//                         value={weight}
//                         onChange={(e) => setWeight(e.target.value)}
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="bp">Blood Pressure:</label>
//                     <input
//                         type="text"
//                         id="bp"
//                         placeholder="Enter your BP (mmHg)"
//                         value={bp}
//                         onChange={(e) => setBp(e.target.value)}
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="sugar">Sugar Level:</label>
//                     <input
//                         type="number"
//                         id="sugar"
//                         placeholder="Enter your sugar level (mg/dL)"
//                         value={sugar}
//                         onChange={(e) => setSugar(e.target.value)}
//                     />
//                 </div>

//                 <button className="submit-btn" onClick={handleSubmit}>Submit</button>
//             </div>

//             <div className='graph-box'>
//                 <h2>Your Progress</h2>
//             </div>

//             <div className="dashbody">
//                 <div className="box">
//                     <h3>Health Goal Setting & Reminders</h3>
//                 </div>
//                 <div className="box">
//                     <h3>Nutrition and Meal Recommendations</h3>
//                 </div>
//                 <div className="box">
//                     <h3>Symptom Checker & Health Recommendations</h3>
//                 </div>
//                 <div className="box">
//                     <h3>Automated Health Risk Assessment</h3>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashbody;

