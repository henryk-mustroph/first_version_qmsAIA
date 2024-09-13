import React, {useState, useEffect, useRef} from 'react';
import Button from '@mui/material/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Cookies from "js-cookie";

import "./Assessment.css"

import SaliencyMap from './ExplainabilityResults/SaliencyMap';
import Performance from './PerformanceResults/Performance';
import Consistency from './ConsistencyResults/Consistency';
import RiskIdentificationResults from './RiskIdentificationResult/RiskIdentificationResult';

const Assessment = ({activeStep, updateStep}) => {
    const assessmentRef = useRef();

    const [riskIdentClass, setRiskIdentClass] = useState(null);
    const [results, setResults] = useState(null);

    useEffect(() => {
        const riskAssessmentIdentClassCookie = Cookies.get('rms/risk_assessment/risk_identification/risk_class');
        if (riskAssessmentIdentClassCookie) {
            const riskIdentClass = JSON.parse(Cookies.get('rms/risk_assessment/risk_identification/risk_class'));
            if (riskIdentClass) {
                setRiskIdentClass(riskIdentClass);
            }
        }
        const riskAssessmentResultsCookie = Cookies.get('rms/risk_assessment/risk_analysis/results');
        if (riskAssessmentResultsCookie) {
            const riskAssessmentResults = JSON.parse(Cookies.get('rms/risk_assessment/risk_analysis/results'));
            if (riskAssessmentResults) {
                setResults(riskAssessmentResults);
            }
        }
    }, []);

    // Button Logic
    const handleBack = () => {
        // Remove Assessment tokens:
        Cookies.remove('rms/risk_assessment/risk_analysis/results');
        Cookies.remove('rms/risk_assessment/id');
        updateStep(3);
    };

    const handleNext = () => {
        // Remove Assessment tokens:
        Cookies.remove('rms/risk_assessment/risk_analysis/results');
        Cookies.remove('rms/risk_assessment/id');
        updateStep(5);
    };

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

                const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.5); // Use JPEG and reduce quality to 0.5
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

    // Results is just an empty list:
    if (results && results.length === 0) {
        return (
            <div ref={assessmentRef}>
                <p>No data are given for the selected identification or no metrics were chosen to be computed!</p>
                <div className="verif-stepper-buttons">
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className="verif-stepper-button-back"
                    >
                        Back
                    </Button>

                    <Button
                        color="inherit"
                        variant="contained"
                        className="verif-stepper-button-next"
                        onClick={handleNext}
                    >
                        Next
                    </Button>

                </div>
            </div>
        );
    }
    // Results values: performance, explainability and consistency are empty:
    else if (results &&
        results.length > 0 &&
        !results[0].performance &&
        results[0].explainability.results &&
        results[0].explainability.results.length === 0 &&
        !results[0].consistency
        ) {

        return (
            <div ref={assessmentRef}>
                <p>Either the model chosen is not integrated or not known, or the calculation had errors!</p>
                <div className="verif-stepper-buttons">
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className="verif-stepper-button-back"
                    >
                        Back
                    </Button>

                    <Button
                        color="inherit"
                        variant="contained"
                        className="verif-stepper-button-next"
                        onClick={handleNext}
                    >
                        Next
                    </Button>

                </div>
            </div>
        );
    } else {
        return (
            <div>

                {!results ? (
                    <div className="centered-content">
                        <p align="center">Unexpected error occurred in computation!</p>
                        <div className="verif-stepper-buttons">
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className="verif-stepper-button-back"
                            >
                                Back
                            </Button>

                            <Button
                                color="inherit"
                                variant="contained"
                                className="verif-stepper-button-next"
                                onClick={handleNext}
                            >
                                Next
                            </Button>
                        </div>
                    </div>

                ) : (

                    <div className="centered-content">
                        <div ref={assessmentRef}>
                            <RiskIdentificationResults data={riskIdentClass}/>
                            <Performance data={results}/>
                            <SaliencyMap data={results}/>
                            <Consistency data={results}/>
                        </div>

                        <div className="verif-stepper-buttons">
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className="verif-stepper-button-back"
                            >
                                Back
                            </Button>

                            <Button
                                color="inherit"
                                variant="contained"
                                className="verif-stepper-button-next"
                                onClick={handleNext}
                            >
                                Next
                            </Button>

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
        );
    }
};

export default Assessment;
