import { Link } from 'react-router-dom'
import './Hero.css'

const SAMPLE_BASKET: { emoji: string; name: string; price: string }[] = [
  { emoji: '🍅', name: 'Tomate rama', price: '2,99' },
  { emoji: '🥛', name: 'Leche entera ×6', price: '5,40' },
  { emoji: '🥖', name: 'Pan rústico', price: '1,10' },
  { emoji: '🫒', name: 'Aceite virgen extra', price: '8,45' },
]

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1>La compra de la semana, directa a tu puerta.</h1>
          <p>
            Fruta de temporada, carne y pescado frescos y todo lo de la despensa. Pide hoy y elige
            tu hora de entrega.
          </p>
          <div className="hero__actions">
            <Link to="/#catalogo" className="btn btn--lg btn--citrus">
              Empezar a comprar
            </Link>
            <Link to="/?onSale=true#catalogo" className="btn btn--lg btn--outline">
              Ver ofertas
            </Link>
          </div>
          <ul className="hero__perks">
            <li>Envío gratis desde 50 €</li>
            <li>Producto fresco de proximidad</li>
            <li>Devolución si no estás conforme</li>
          </ul>
        </div>

        <div className="receipt" aria-hidden="true">
          <p className="receipt__title">Tu primera cesta</p>
          <ul>
            {SAMPLE_BASKET.map((line) => (
              <li key={line.name}>
                <span>
                  {line.emoji} {line.name}
                </span>
                <span>{line.price} €</span>
              </li>
            ))}
          </ul>
          <div className="receipt__total">
            <span>Total</span>
            <span>17,94 €</span>
          </div>
          <p className="receipt__note">Recíbelo mañana entre 9:00 y 21:00</p>
        </div>
      </div>
    </section>
  )
}
