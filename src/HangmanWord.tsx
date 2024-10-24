 
type Props = {
   wordToGuess:string,
   guessedLetters:string[] 
reveal?:boolean
winner?:boolean
}
const HangmanWord = ({wordToGuess,guessedLetters,reveal,winner}:Props) => {
  const isMobile = window.innerWidth <= 768; // Mobile threshold (768px)
  return (
    <div
      style={{
        display: "flex",
        gap: ".25em",
        fontSize: isMobile ? "3rem":"5rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontFamily: "monospace",
        color:"black"
      }}
    >
        {wordToGuess.split("").map((letter,index)=> (
            <span style={{ borderBottom: ".1em solid black" }} key={index}>
                <span style={{ visibility: guessedLetters.includes(letter) || reveal ?"visible":"hidden", color: !guessedLetters.includes(letter) && reveal ? "red": winner ? "green": 'black'}}>{letter}</span>
            </span>
        ))}
    </div>
  )
}

export default HangmanWord
