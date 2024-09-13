import React, {useState, useEffect} from 'react';
import './Consistency.css'; // Import CSS file here

const Consistency = ({data}) => {

    const [parsedData, setParsedData] = useState([]);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        const consistencyData = parseConsistency(data);
        setParsedData(consistencyData);
        setHasData(consistencyData.length > 0);
    }, [data]);

    const parseConsistency = (jsonData) => {
        const data_list = Object.values(jsonData);
        let dataInfoValues = [];
        let consistency = [];
        const consistencyData = [];
        let mergedInfoConsistency = {};

        for (let i = 0; i < data_list.length; i++) {
            dataInfoValues = data_list[i]["data"];
            consistency = data_list[i]["consistency"];
            if (Object.keys(consistency).length === 0) {
                continue;  // Skip this item if consistency is empty
            }
            mergedInfoConsistency = Object.assign({}, dataInfoValues, consistency);
            consistencyData.push(mergedInfoConsistency);
        }
        return consistencyData;
    };

    if (!hasData) {
        return (
            <div>
                <h3 style={{textAlign: 'center'}}>Consistency Metrics Results</h3>
                <p style={{textAlign: 'center'}}>No data available!</p>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{textAlign: 'center'}}>Consistency Metrics Results</h3>

            <p style={{textAlign: 'left'}}>
                <strong>Adversarial-based Consistency Check:</strong> <br/>
                <span>This metric shows the new generated input metric that was computed to predict a wrong output
                    sequence.
                    The number of iterations to do so is depicted.
                </span>
            </p>

            {parsedData.map((item, index) => (
                <div key={index}>

                    <p style={{textAlign: 'left'}}>
                        <strong>Ground Truth Output:</strong> <br/>
                        <span style={{color: 'green'}}>{item.gt_text}</span>
                    </p>

                    <p style={{textAlign: 'left'}}>
                        <strong>Adversarial Output:</strong> <br/>
                        <span style={{color: 'red'}}>{item.adversarial_output}</span>
                    </p>

                    <p style={{textAlign: 'left'}}>
                        <strong>Generated Adversarial Input:</strong> <br/>
                        <span style={{color: 'red'}}>{item.adversarial_input}</span>
                    </p>

                    <div className='consistency-table-container'>
                        <table className="consistency-table">
                            <thead>
                            <tr>
                                <th>Data Type</th>
                                <th>Number of Iterations, to generate adversarial input</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{item.type}</td>
                                <td>{item.number_iter}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default Consistency;
