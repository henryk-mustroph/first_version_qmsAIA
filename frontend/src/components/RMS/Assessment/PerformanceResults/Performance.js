/*
#
# This file is part of first_version_qmsAIA.
#
# first_version_qmsAIA is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License as published by the
# Free Software Foundation, either version 3 of the License, or (at your
# option) any later version.
#
# social_network_miner_compliance_check is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
# details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with first_version_qmsAIA (file COPYING in the main directory). If not, see
# http://www.gnu.org/licenses/.
*/

import React, {useState, useEffect} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import {Line} from 'react-chartjs-2'

import './Performance.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const Performance = ({data}) => {
    const [parsedData, setParsedData] = useState([]);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        console.log('Loading rms data:', data);
        const performanceData = parsePerformance(data);
        setParsedData(performanceData);
        setHasData(performanceData.length > 0);
    }, [data]);

    const parsePerformance = (jsonData) => {
        const data_list = Object.values(jsonData);
        let dataInfoValues = [];
        let performance = [];
        const performanceData = [];
        let mergedInfoPerformance = {};

        for (let i = 0; i < data_list.length; i++) {
            dataInfoValues = data_list[i]["data"];
            performance = data_list[i]["performance"];
            if (Object.keys(performance).length === 0) {
                continue; // Skip this item if performance is empty
            }
            mergedInfoPerformance = Object.assign({}, dataInfoValues, performance);
            performanceData.push(mergedInfoPerformance);
        }
        return performanceData;
    };

    // Function to generate chart data
    const generateChartData = () => {
        try {
            const labels = parsedData.map((item) => `${item.task}`);
            const perplexity = parsedData.map((item) => item.perplexity_score);

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Perplexity Score',
                        data: perplexity,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                    },
                ],
            };
            return chartData;
        } catch (error) {
            console.error('Error generating chart data:', error);
            return null; // Return null or handle error as needed
        }
    };

    if (!hasData) {
        return (
            <div>
                <h3 style={{textAlign: 'center'}}>Performance Metrics Results</h3>
                <p style={{textAlign: 'center'}}>No data</p>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{textAlign: 'center'}}>Performance Metrics Results</h3>

            <p style={{textAlign: 'left'}}><strong>Accuracy-based Performance:</strong> <br/>
                <span>For each task, data type, LLM combination, the ROUGE-N score and the Accuracy is calculated.</span>
            </p>

            <div className="performance-table-container">
                <table className='performance-table'>
                    <thead>
                    <tr>
                        <th>Task</th>
                        <th>Data Type</th>
                        <th>Rouge N-Score (F1)</th>
                        <th>Accuracy Score</th>
                        <th>Perplexity Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {parsedData.map((item, index) => (
                        <tr key={index}>
                            <td>
                                {item.instruction}: <br/>
                                <span style={{color: 'blue'}}>{item.input_text}</span>
                            </td>
                            <td>{item.type}</td>
                            <td>{item.rouge_n_score}</td>
                            <td>{item.accuracy_score}</td>
                            <td>{item.perplexity_score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <p style={{textAlign: 'left'}}><strong>Perplexity Score Card:</strong> <br/>
                <span>This shows for each token in the output sequence the probability of the LLM.
                    A decreasing probability indicates less uncertainty and a higher confidence.
                </span>
            </p>

            <div className="chart-container-spec">
                <Line className='chart-container' data={generateChartData()}/>
            </div>

        </div>
    );
};

export default Performance;