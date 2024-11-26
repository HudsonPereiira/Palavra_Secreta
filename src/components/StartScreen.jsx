import "./StartScreen.css";

const startScreen = ({ startGame }) => {
  return (
    <div className="start">
      <h1>Palavra Secreta</h1>
      <p>Clique no botão abaixo para jogar.</p>
      <button onClick={startGame}>Começar o jogo</button>
    </div>
  );
};

export default startScreen;
