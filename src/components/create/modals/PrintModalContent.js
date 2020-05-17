import React, {useEffect, useRef} from 'react';
import PDFDocument from '../pdf/PDFDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClipLoader from 'react-spinners/ClipLoader';
import styled from 'styled-components';

const PrintModalContent = ({
    grid,
    rowLength,
    labels,
    clues,
    puzzleName,
    handleModalClose
}) => {
    const downloadText = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            // to avoid re-rendering PDF bug, render a link to the pdf and synthesize a click on it
            if (downloadText.current) {
                downloadText.current.click();
            }
            setTimeout(handleModalClose, 200);
        }, 400);
    }, [handleModalClose]);

    return (
        <Wrapper>
            <PDFDownloadLink
                document={
                    <PDFDocument 
                        grid={grid} 
                        rowLength={rowLength}
                        labels={labels} 
                        clues={clues}
                        name={puzzleName} />
                }
                fileName={`${puzzleName || "crossword"}.pdf`}>
                {({ blob, url, loading, error }) =>
                    loading 
                        ? <DownloadText>Loading...</DownloadText> 
                        : <DownloadText ref={downloadText}>Download PDF</DownloadText>
                }
            </PDFDownloadLink>
            <ClipLoader 
                size={70}
                color={"#a7d8ff"}
                loading={true} />
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 30px;
`;

const DownloadText = styled.p`
    display: none;
`;

export default PrintModalContent;