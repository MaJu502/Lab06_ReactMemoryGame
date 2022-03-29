/* pool de imagenes */
const Img_pool = [
  { src:"./imagenes/centerofattention.png", match: false },
  { src:"./imagenes/cmiygl.png", match: false },
  { src:"./imagenes/demondays.png", match: false },
  { src:"./imagenes/inutero.png", match: false },
  { src:"./imagenes/lomato.png", match: false },
  { src:"./imagenes/siembra.png", match: false },
  { src:"./imagenes/swimming.png", match: false },
  { src:"./imagenes/thebends.png", match: false }
]


/* app sin create app de React */
const App = () => {

  /* seccion dedicada a diseño visual del juego ----------------------------------------------------------------------------*/
  //container de cartas
  const container_TableCartas = {
    width: '99%',
    height: '785px', /* definido manualmente */
    backgroundImage: 'url(https://img.freepik.com/vector-gratis/fondo-mesa-poker-color-verde_47243-1094.jpg?size=626&ext=jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    textAlign: 'center',
    border: '5px solid #000000'
  }

  //grid
  const GridCartas = {
    marginTop: '35px',
    display: 'grid',
    gridTemplateColumns: '5fr 5fr 5fr 5fr',
    gridGap: '30px',
    marginBottom: '30px'
  }

  // boton para reiniciar el juego
  const newgame_btn = {
    backgroundColor: '#c75353',
    color: '#fff',
    borderRadius: '10px',
    padding: '30px 100px',
    border: '2px solid #ccad00',
  }

  //titulo del juego
  const titulo = {
    backgroundColor: '#c75353',
    borderRadius: '15px',
    width: '400px',
    border: '3px solid #ccad00',
    color: 'white'
  }


  /* Estilos para cada posicion en la que puede estar la carta */
  //default
  const styleCarta_default = {
    position: 'relative'
  }

  const styleCarta_flipping = {
    width: '115px',
    height: '115px',
    position: 'absolute',
    transform: 'translateX(100)',
    opacity: '0.6'
  }

  const styleCarta_backside = {
    transform: 'rotateY(0deg)',
    transitionDelay: '0.2s',
    width: '115px',
    height: '115px'
  }
  /* --- termina espacio de diseño-------------------------------------------------------------------------------------------- */

  

  //constantes de cartas, turnos y demás para funcionamiento de juego
  const [card, setCard] = React.useState([])
  const [selected1, setSelected1] = React.useState(null)
  const [selected2, setSelected2] = React.useState(null)
  
  const [turnos, setTurnos] = React.useState(0)
  const [matches, setMatched] = React.useState(0)
  const [deshabilitado, setDeshabilitado] = React.useState(false)

  //Se realiza la mezcla de cartas
  const ShuffleCards = () => {
    const shuffledDeck = [...Img_pool, ...Img_pool].sort(() => Math.random() - 0.5).map((carta) => ({ ...carta, id: Math.random() }))
    setSelected1(null)
    setSelected2(null)
    setCard(shuffledDeck) //le da las cartas nuevas al programa
    setTurnos(0)
    setMatched(0)
  }
  
  const selectedCardsConst = (carta) => {
    selected1 ? setSelected2(carta) : setSelected1(carta)
  }



  function CardCreator({ carta, selectedCardsConst, Volteada, deshabilitado }) {
    //Funcion que sirve para crear cartas

    const clickedCard = () => {
      //poner cartas en estado default del juego
      if(!deshabilitado) {selectedCardsConst(carta)}
    }

    return (
      <div className="carta" style={styleCarta_default}>
        <div>
          <img src={carta.src} alt="frenteCarta" style={ Volteada ? styleCarta_backside: styleCarta_flipping }></img>
          <img className="container_TableCartas" src="./imagenes/back.png" alt="atrasCarta" onClick={clickedCard} 
          style={ Volteada ? styleCarta_flipping: styleCarta_backside }>
          </img>
        </div>
      </div> 
    )
  }


  const turnosDefault = () => {
    //contador de turnos y suma por cada turno
    setSelected1(null)
    setSelected2(null)
    setTurnos(temp => temp + 1) //sumarle 1 a los turnos
    setDeshabilitado(false)
  }

  React.useEffect(() => {
    //evaluar la cantidad de turnos y matches para saber si gana o no
    
    if (selected1 && selected2){
      //cuando ya selecciono dos cartas
      setDeshabilitado(true)
      if(selected1.src === selected2.src){
        //si son cartas iguales 
        setCard(tempcarta => {
          //mantiene la carta mostrada
          return tempcarta.map(carta => {
            if(carta.src === selected1.src){
              setMatched(TotCoinci => TotCoinci + 1)
              return {...carta, match: true} //añade 1 match al contador de matches
            } else {
              return carta
            }
          })
        })
        console.log(matches) //lleva control en consola
        turnosDefault()
      } else {
        setTimeout(() => turnosDefault(), 1500) //tiempo que se muestra el par de cartas cuando estas no son pareja
      }
    }
    
    if(matches == 16){
      //si llega a la cantidad total de parejas matcheadas
      alert("Ganaste! en "+ turnos + " turnos")
      setTimeout(() => ShuffleCards(), 500) //regresa cartas a su estado inicial
    }

  }, [selected1, selected2])

  //Inicio del juego
  React.useEffect(()=>{
    ShuffleCards()
  }, [])

  return (
    
    <div style={container_TableCartas}>
      <h1 style={titulo}> Memoria! </h1>
      <div className = "gridCartas" style={GridCartas}>
        {card.map(carta => (
        <CardCreator
          key = {carta.id}
          carta = {carta}
          selectedCardsConst = {selectedCardsConst}
          Volteada={carta === selected1 || carta === selected2 || carta.match}
          deshabilitado = {deshabilitado}
          />
        ))}
      </div>
      <button style={newgame_btn} onClick={ShuffleCards}>Reinciar</button>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)