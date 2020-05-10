import React from 'react';
import { Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';
import makePDFStyles from './PDFStyles';

const PDFDocument = ({grid, rowLength, labels, clues, name}) => {
    const [acrossClues, downClues] = separateClues(clues);

    const styles = makePDFStyles(rowLength);
    console.log(styles);

    const getLabel = (idx) => {
        const label = labels.find(l => l[0] === idx);
        return label ? label[1] : "";
    };

    const getCellStyle = (cell, idx) => {
        let borderStyle = {};
        if (idx === (rowLength * rowLength) - 1) {
            // last cell
            borderStyle = {...styles.cellBorderBottom, ...styles.cellBorderRight};
        } else if (idx >= rowLength * (rowLength - 1)) {
            // bottom row
            borderStyle = styles.cellBorderBottom;
        } else if ((idx + 1) % rowLength === 0) {
            // right-most column
            borderStyle = styles.cellBorderRight;
        }
    
        let backgroundStyle = {};
        if (cell === false) {
            backgroundStyle = styles.cellDisabled
        }
    
        return {...styles.cell, ...borderStyle, ...backgroundStyle};
    };

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap={false}>
                {name !== "" && <Text style={styles.puzzleName}>{name}</Text>}
                <View style={styles.headerLine}></View>
                <View style={styles.grid}>
                    {grid.map((cell, idx) => {
                        return (
                            <View style={getCellStyle(cell, idx)} key={idx}>
                                {(getLabel(idx) !== undefined) && <Text style={styles.label}> {getLabel(idx)} </Text>}
                            </View>
                        );
                    })}
                </View>
                <View style={styles.clues}>
                    <Text style={styles.clueType}>Across</Text>
                    {Object.keys(acrossClues).map((clue, idx) => {
                        return (
                            <View style={styles.clue} key={idx}>
                                <Text style={styles.clueLabel}>{clue.replace(/\D+/g, '')}</Text>
                                <Text style={styles.clueText}>{clues[clue].clue}</Text>
                            </View>
                        );
                    })}

                    <Text style={styles.clueType}>Down</Text>
                    {Object.keys(downClues).map((clue, idx) => {
                        return (
                            <View style={styles.clue} key={idx}>
                                <Text style={styles.clueLabel}>{clue.replace(/\D+/g, '')}</Text>
                                <Text style={styles.clueText}>{clues[clue].clue}</Text>
                            </View>
                        );
                    })}
                </View>
            </Page>
        </Document>
    );
};

const separateClues = (clues) => {
    let separatedClues = [];
	["a", "d"].forEach(clueType => {
		separatedClues.push(
			Object.keys(clues)
				.filter(clue => clue.toLowerCase().includes(clueType))
				.reduce((res,key) => {
					res[key] = clues[key]; 
					return res
				}, {})
		);
    });
    return separatedClues;
}

export default PDFDocument;