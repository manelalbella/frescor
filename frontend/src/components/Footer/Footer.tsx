import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <strong className="footer__brand">Frescor</strong>
          <p>Supermercado online con producto fresco, de proximidad y entrega a domicilio.</p>
        </div>
        <div>
          <strong>Entrega</strong>
          <p>Envío gratis desde 50 € · 4,90 € en el resto de pedidos.</p>
        </div>
        <div>
          <strong>Proyecto de demostración</strong>
          <p>Spring Boot + React. Los productos y precios son de ejemplo.</p>
        </div>
      </div>
    </footer>
  )
}
