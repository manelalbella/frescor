# ---- Fase 1: compilar el proyecto con Maven ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

# ---- Fase 2: imagen final, solo con Java (más ligera) ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Ajustes para el plan gratuito de Render (512 MB de RAM y 0,1 CPU):
#  - SerialGC y TieredStopAtLevel=1: menos memoria y arranque más rápido con poca CPU
#  - MaxRAMPercentage=60: deja margen para metaspace, hilos y el sistema
ENV JAVA_OPTS="-XX:+UseSerialGC -XX:TieredStopAtLevel=1 -XX:MaxRAMPercentage=60 -Xss512k"

# Render indica el puerto con la variable PORT (la aplicación la lee en application.properties)
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
