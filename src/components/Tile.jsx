import { PLAYER_IMAGES } from "./TicTacToe";
function Tile({className, value, onClick, playerTurn}) {
    let hoverClass = null;
    if(value == null && playerTurn != null){
        hoverClass = `${playerTurn.toLowerCase()}-hover`;
    }

    const tileImage = value ? PLAYER_IMAGES[value] : null;

    return ( 
    <div onClick={onClick} 
    className={ `tile ${className} ${hoverClass}`}>
        {tileImage && <img src={tileImage} alt="Player Mark" className="player-icon" />}
    </div>  
    );
}

export default Tile;