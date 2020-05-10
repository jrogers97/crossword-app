import {StyleSheet} from '@react-pdf/renderer';

const makePDFStyles = (rowLength) => {
    return StyleSheet.create({
        page: {
            backgroundColor: '#FFF',
            padding: '20pt 20pt 0 20pt',
            height: '100%'
        },
        puzzleName: {
            fontSize: '20pt',
            fontFamily: 'Helvetica-Bold'
        },
        headerLine: {
            width: '100%',
            height: '1pt',
            backgroundColor: '#000',
            marginBottom: '15pt'
        },
        grid: {
            height: '350pt',
            width: '350pt',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: '10pt'
        },
        cell: {
            height: `${345 / rowLength}pt`,
            width:  `${345 / rowLength}pt`,
            borderTop: '1pt solid #000',
            borderLeft: '1pt solid #000'
        },
        cellBorderRight: {
            borderRight: '1pt solid #000'
        },
        cellBorderBottom: {
            borderBottom: '1pt solid #000'
        },
        cellDisabled: {
            backgroundColor: '#333'
        },
        label: {
            position: 'absolute',
            fontSize: `${rowLength * -0.3 + 12.5}pt`,
            left: '1pt'
        },
        clues: {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            height: '400pt'
        },
        clueType: {
            width: '100pt',
            fontSize: '12pt',
            margin: '5pt 0',
            fontFamily: 'Helvetica-Bold'
        },
        clue: {
            width: '100pt',
            margin: '2pt 5pt',
            display: 'flex',
            flexDirection: 'row'
        },
        clueLabel: {
            fontSize: '10pt',
            textAlign: 'right',
            width: '10pt',
            marginRight: '6pt',
            fontFamily: 'Helvetica-Bold'
        },
        clueText: {
            fontSize: '10pt',
            marginRight: '10pt'
        }
    });
}

export default makePDFStyles;