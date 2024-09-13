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

import React, {useRef} from 'react';
import Button from '@mui/material/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {useLocation} from 'react-router-dom';

import "./ResultDetailPage.css"

import NavBar from "../../../../components/NavBar/NavBar";

import SaliencyMap from '../../../../components/RMS/Assessment/ExplainabilityResults/SaliencyMap'
import Performance from '../../../../components/RMS/Assessment/PerformanceResults/Performance'
import Consistency from '../../../../components/RMS/Assessment/ConsistencyResults/Consistency'
import RiskIdentificationResults
    from '../../../../components/RMS/Assessment/RiskIdentificationResult/RiskIdentificationResult';

const ResultDetailPage = () => {
    const assessmentRef = useRef();
    const location = useLocation();
    const {item} = location.state || {};

    const handleDownload = () => {
        /*

        This method downloads a pdf document of the

        */
        const input = assessmentRef.current;
        const margin = 10; // Set margin value (in mm)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        const pdfHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

        html2canvas(input, {scale: 2}).then((canvas) => {
            const imgData = canvas.toDataURL('image/png', 0.5);
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = imgProps.width;
            const imgHeight = imgProps.height;

            const ratio = imgWidth / pdfWidth;
            const totalHeight = imgHeight / ratio;

            let yPosition = 0;
            let pageCounter = 0;

            // Adjusted the addImageToPdf function to ensure that the page height is correctly calculated to avoid cutting off elements.
            // The pageCanvas.height is set to the minimum of the remaining image height or the standard page height.
            const addImageToPdf = (yPosition, isFirstPage = false) => {
                if (!isFirstPage) {
                    pdf.addPage();
                }
                const sourceY = yPosition * ratio;
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = imgWidth;
                pageCanvas.height = Math.min(imgHeight - sourceY, pdfHeight * ratio);

                const pageContext = pageCanvas.getContext('2d');
                pageContext.drawImage(canvas, 0, sourceY, imgWidth, pageCanvas.height, 0, 0, imgWidth, pageCanvas.height);

                // Use JPEG and reduce quality to 0.5
                const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.5);
                const pageHeight = pageCanvas.height / ratio;
                pdf.addImage(pageImgData, 'JPEG', margin, margin, pdfWidth, pageHeight);
            };

            while (yPosition < totalHeight) {
                addImageToPdf(yPosition, pageCounter === 0);
                yPosition += pdfHeight;
                pageCounter++;
            }

            pdf.save('risk_assessment_results.pdf');
        });
    };

    if (item.risk_analysis.results &&
        item.risk_analysis.results.length === 0) {
        return (
            <React.Fragment>
                <div>
                    <NavBar/>
                    <div className="data-detail-page">
                        <div className='centered-content'>
                            <h1 className='data-detail-title'>Past Risk Assessment Results</h1>
                            <p>No data are given for the selected identification or no metrics were chosen to be
                                computed!</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    } else if (item.risk_analysis.results.length > 0 &&
        !item.risk_analysis.results[0].performance &&
        !item.risk_analysis.results[0].explainability &&
        !item.risk_analysis.results[0].consistency
        ){

        return (
            <React.Fragment>
                <div>
                    <NavBar/>
                    <div className="data-detail-page">
                        <div className='centered-content'>
                            <h1 className='data-detail-title'>Past Risk Assessment Results</h1>
                            <p>Either the model chosen is not integrated or not known, or the calculation had
                                errors!
                            </p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
    
    // Risk identification and risk result exist
    else {

        return (
            <React.Fragment>
                <div>
                    <NavBar/>
                    <div className="data-detail-page">
                        <div className="centered-content">
                            <h1 className='data-detail-title'>Past Risk Assessment Results</h1>

                            {!item.risk_analysis.results ? (
                                <p align="center">Unexpected error occurred in computation!</p>
                            ) : (
                                <div>
                                    <div align="center" ref={assessmentRef}>
                                        <RiskIdentificationResults data={item.risk_identification.risk_class}/>
                                        <Performance data={item.risk_analysis.results}/>
                                        <SaliencyMap data={item.risk_analysis.results}/>
                                        <Consistency data={item.risk_analysis.results}/>
                                    </div>

                                    <div className="verif-stepper-buttons">
                                        <Button
                                            color="inherit"
                                            variant="contained"
                                            className="verif-stepper-button-download"
                                            onClick={handleDownload}
                                        >
                                            Download as PDF
                                        </Button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

};

export default ResultDetailPage;