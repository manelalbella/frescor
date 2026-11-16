package com.frescor.config;

import com.frescor.model.Category;
import com.frescor.model.Product;
import com.frescor.repository.CategoryRepository;
import com.frescor.repository.ProductRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Carga un catálogo de ejemplo si la base de datos está vacía. */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(CategoryRepository cats, ProductRepository prods) {
        return args -> {
            if (cats.count() > 0) return;

            Category fruta   = cats.save(new Category("Frutas y verduras", "frutas-verduras", "🥬"));
            Category carne   = cats.save(new Category("Carnes y pescados", "carnes-pescados", "🥩"));
            Category lacteos = cats.save(new Category("Lácteos y huevos", "lacteos-huevos", "🥛"));
            Category panad   = cats.save(new Category("Panadería", "panaderia", "🥖"));
            Category despensa= cats.save(new Category("Despensa", "despensa", "🍝"));
            Category bebidas = cats.save(new Category("Bebidas", "bebidas", "🧃"));
            Category limpieza= cats.save(new Category("Hogar y limpieza", "hogar-limpieza", "🧼"));

            // Frutas y verduras
            p(prods, fruta, "Plátano de Canarias", "Dulce y en su punto, ideal para el desayuno.", "1 kg", "2.29", null, 80, "🍌");
            p(prods, fruta, "Manzana Golden", "Crujiente y jugosa, de cultivo nacional.", "1 kg", "2.49", "1.99", 60, "🍎");
            p(prods, fruta, "Tomate rama", "Tomate de temporada con sabor de huerta.", "1 kg", "2.99", null, 45, "🍅");
            p(prods, fruta, "Aguacate Hass", "Cremoso, listo para comer en 2 días.", "Malla 2 uds", "3.49", "2.79", 35, "🥑");
            p(prods, fruta, "Fresas", "Fresas de Huelva recién recolectadas.", "500 g", "3.20", null, 30, "🍓");
            p(prods, fruta, "Zanahoria", "Zanahorias frescas, lavadas y listas.", "1 kg", "1.19", null, 90, "🥕");
            // Carnes y pescados
            p(prods, carne, "Pechuga de pollo", "Filetes de pechuga de pollo de corral.", "600 g", "5.95", "4.99", 40, "🍗");
            p(prods, carne, "Filetes de ternera", "Ternera tierna, corte fino para plancha.", "400 g", "7.90", null, 25, "🥩");
            p(prods, carne, "Salmón fresco", "Lomos de salmón sin espinas.", "300 g", "6.49", null, 20, "🐟");
            p(prods, carne, "Gambas peladas", "Gambas congeladas al punto, sin cáscara.", "400 g", "8.99", "7.49", 28, "🦐");
            // Lácteos y huevos
            p(prods, lacteos, "Leche entera", "Leche entera UHT de ganadería española.", "Pack 6 x 1 L", "6.30", "5.40", 100, "🥛");
            p(prods, lacteos, "Huevos camperos", "Gallinas criadas al aire libre, categoría L.", "Docena", "3.35", null, 70, "🥚");
            p(prods, lacteos, "Queso manchego curado", "Curado de 6 meses con leche de oveja.", "250 g", "5.80", null, 33, "🧀");
            p(prods, lacteos, "Yogur natural", "Sin azúcares añadidos, textura cremosa.", "Pack 8 uds", "2.40", "1.99", 85, "🍶");
            // Panadería
            p(prods, panad, "Barra de pan rústico", "Masa madre y horneado diario.", "1 ud", "1.10", null, 50, "🥖");
            p(prods, panad, "Croissants de mantequilla", "Hojaldrados, listos para calentar.", "Pack 4 uds", "2.75", null, 40, "🥐");
            p(prods, panad, "Pan de molde integral", "Con semillas de lino y girasol.", "460 g", "2.15", "1.79", 55, "🍞");
            // Despensa
            p(prods, despensa, "Espaguetis", "Trigo duro, cocción 9 minutos.", "500 g", "1.35", null, 120, "🍝");
            p(prods, despensa, "Arroz bomba", "Ideal para paellas y arroces melosos.", "1 kg", "3.10", null, 65, "🍚");
            p(prods, despensa, "Aceite de oliva virgen extra", "Primera extracción en frío, variedad picual.", "1 L", "9.95", "8.45", 60, "🫒");
            p(prods, despensa, "Tomate frito casero", "Receta tradicional, sin conservantes.", "Pack 3 x 400 g", "3.60", null, 75, "🥫");
            p(prods, despensa, "Café molido natural", "Tueste medio, 100% arábica.", "250 g", "4.25", null, 48, "☕");
            // Bebidas
            p(prods, bebidas, "Agua mineral", "Agua de manantial, sin gas.", "Pack 6 x 1,5 L", "2.70", null, 150, "💧");
            p(prods, bebidas, "Zumo de naranja", "Exprimido, sin azúcares añadidos.", "1 L", "2.45", "1.99", 70, "🍊");
            p(prods, bebidas, "Cerveza lager", "Cerveza rubia bien fría.", "Pack 6 x 33 cl", "4.20", null, 90, "🍺");
            p(prods, bebidas, "Vino tinto crianza", "D.O. Rioja, 12 meses en barrica.", "75 cl", "6.90", "5.90", 38, "🍷");
            // Limpieza
            p(prods, limpieza, "Detergente líquido", "40 lavados, cuida los colores.", "2 L", "7.99", "6.49", 44, "🧴");
            p(prods, limpieza, "Papel higiénico", "Doble capa, suave y resistente.", "Pack 12 rollos", "4.95", null, 80, "🧻");
            p(prods, limpieza, "Lavavajillas a mano", "Elimina la grasa a la primera.", "750 ml", "1.89", null, 95, "🍽️");
        };
    }

    private static void p(ProductRepository repo, Category c, String name, String desc, String unit,
                          String price, String sale, int stock, String emoji) {
        repo.save(new Product(name, desc, unit, new BigDecimal(price),
                sale == null ? null : new BigDecimal(sale), stock, emoji, c));
    }
}
