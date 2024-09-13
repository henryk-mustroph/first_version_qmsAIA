import React, {useRef} from 'react';
import {Box} from '@mui/material';
import {useLocation} from 'react-router-dom';
import Button from '@mui/material/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import './ResultDetailPage.css';

import NavBar from "../../../../components/NavBar/NavBar";

const ResultDetailPage = () => {

    const dataRef = useRef();

    const location = useLocation();
    const {item} = location.state || {};

    if (!item) {
        return <p>No data available</p>;
    }

    const handleDownload = () => {
        /*
        This method downloads a pdf document of the

        */
        const input = dataRef.current;
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
            pdf.save('data_check_results.pdf');
        });
    };

    return (
        <React.Fragment>
            <div>
                <NavBar/>
                <div className="data-detail-page">
                    <div className='centered-content'>
                        <h1 className='data-detail-title'>Past Data Proof Result</h1>

                        <Box>
                            <div ref={dataRef}>
                                <h3 style={{textAlign: 'center'}}>Submitted Data</h3>

                                <p><strong>LLM Name:</strong> <br/>
                                    <span>{item.llms[0].name}</span>
                                </p>

                                <p><strong>Data Name:</strong> <br/>
                                    <span>{item.name}</span>
                                </p>

                                <p><strong>Domain:</strong> <br/>
                                    <span>{item.domain.name}</span>
                                </p>

                                <p><strong>Compliance Description:</strong> <br/>
                                    <span>{item.training_data_check.description}</span>
                                </p>
                            </div>
                        </Box>

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
                </div>
            </div>
        </React.Fragment>
    );
};

export default ResultDetailPage;
