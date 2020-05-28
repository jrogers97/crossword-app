import React from 'react';
import styled from 'styled-components';
import eraserIcon from '../../../icon/eraser.svg'
import mirroredEraserIcon from '../../../icon/flip.svg';
import saveIcon from '../../../icon/save.svg';
import loadIcon from '../../../icon/load.svg';
import downloadIcon from '../../../icon/download.svg';


const HelpModalContent = () => {
    return (
        <Container>
            <Header>Tips</Header>
            <TipsList>
                <TipsListItem>
                    <ItemHeader>Puzzle size</ItemHeader>
                    <ItemTextPar>Use the grid size selector to change the size of your puzzle.</ItemTextPar>
                    <ItemTextPar>Most puzzles are 15x15, but that can vary. The New York Times Sunday puzzle is 21x21, while
                    their mini puzzles are often 5x5.</ItemTextPar>
                </TipsListItem>
                <TipsListItem>
                    <ItemHeader>Filling in the board</ItemHeader>
                    <ItemTextPar>
                        Navigate through the board by typing, clicking, or using the arrow keys. 
                    </ItemTextPar>
                    <ItemTextPar>
                        <Image src={eraserIcon} />
                        Use the eraser tool to choose which squares are blacked out. 
                    </ItemTextPar>
                    <ItemTextPar>
                        <Image rotated src={mirroredEraserIcon} />
                        Enable Mirrored Mode in the dropdown menu to enforce rotational symmetry - a feature of almost every crossword puzzle.
                    </ItemTextPar>
                </TipsListItem>
                <TipsListItem>
                    <ItemHeader>Saving your work</ItemHeader>
                    <ItemTextPar>
                        <Image src={saveIcon} />
                        Give your puzzle a name so you can come back to it later.
                    </ItemTextPar>
                    <ItemTextPar>
                        <Image src={loadIcon} />
                        Load any of your past puzzles.
                    </ItemTextPar>
                    <ItemTextPar>
                        <Image src={downloadIcon} />
                        Download a PDF of your puzzle to share.
                    </ItemTextPar>
                </TipsListItem>
                <Footer>
                    For a more detailed list of rules and standards, click <FooterLink href="https://www.nytimes.com/puzzles/submissions/crossword" target="_blank">here</FooterLink>
                </Footer>
            </TipsList>
        </Container>
    );
}

const Container = styled.div`
    padding: 0 30px;
    max-width: 550px;
`;

const Header = styled.p`
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 20px;
`;

const TipsList = styled.ul`
    list-style-type: disc;
`;

const TipsListItem = styled.li`
    margin: 15px 0 10px 0;
`;

const ItemHeader = styled.p`
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
`;

const ItemTextPar = styled.p`
    font-size: 15px;
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
`;

const Image = styled.img`
    height: 18px;
    width: 18px;
    margin-right: 15px;
    ${props => props.rotated && "transform: rotate(45deg);"}
`;

const Footer = styled.p`
    margin: 30px 0 10px 0;
    font-size: 13px;
`;

const FooterLink = styled.a`
    font-weight: bold;
    color: #0b7b99;
`;

export default HelpModalContent;