package com.frescor;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

// Los tests usan una base de datos en memoria, para no tocar los datos reales de backend/data/
@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:frescor-test;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
class OrderFlowTest {

    private static final String ORDER_BODY = """
            {"customerName":"Ana","customerEmail":"ana@mail.com","phone":"600000000",
             "address":"Calle Mayor 1","city":"Valencia","postalCode":"46001",
             "items":[{"productId":1,"quantity":2}]}""";

    @Autowired
    MockMvc mvc;

    /** Registra un usuario nuevo y devuelve su token. */
    private String registerAndGetToken() throws Exception {
        String email = "ana" + System.nanoTime() + "@mail.com";
        String body = """
                {"name":"Ana","email":"%s","password":"secreto123"}""".formatted(email);
        String json = mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(json, "$.token");
    }

    private static String bearer(String token) {
        return "Bearer " + token;
    }

    @Test
    void listsProductsWithoutLogin() throws Exception {
        mvc.perform(get("/api/products"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.content").isNotEmpty());
    }

    @Test
    void orderRequiresLogin() throws Exception {
        mvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(ORDER_BODY))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void loggedUserCreatesOrderAndSeesItInMyOrders() throws Exception {
        String token = registerAndGetToken();

        mvc.perform(post("/api/orders").header("Authorization", bearer(token))
                .contentType(MediaType.APPLICATION_JSON).content(ORDER_BODY))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.subtotal").value(4.58))
           .andExpect(jsonPath("$.shipping").value(4.90));

        mvc.perform(get("/api/orders").header("Authorization", bearer(token)))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void userCannotSeeAnotherUsersOrder() throws Exception {
        String owner = registerAndGetToken();
        String json = mvc.perform(post("/api/orders").header("Authorization", bearer(owner))
                        .contentType(MediaType.APPLICATION_JSON).content(ORDER_BODY))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Integer orderId = JsonPath.read(json, "$.id");

        String stranger = registerAndGetToken();
        mvc.perform(get("/api/orders/" + orderId).header("Authorization", bearer(stranger)))
           .andExpect(status().isNotFound());
        mvc.perform(get("/api/orders/" + orderId).header("Authorization", bearer(owner)))
           .andExpect(status().isOk());
    }

    @Test
    void rejectsInvalidOrder() throws Exception {
        String token = registerAndGetToken();
        mvc.perform(post("/api/orders").header("Authorization", bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"customerName\":\"\",\"items\":[]}"))
           .andExpect(status().isBadRequest());
    }

    @Test
    void wrongPasswordIsRejected() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"nadie@mail.com\",\"password\":\"incorrecta1\"}"))
           .andExpect(status().isUnauthorized());
    }

    @Test
    void logoutInvalidatesTheToken() throws Exception {
        String token = registerAndGetToken();

        mvc.perform(get("/api/auth/me").header("Authorization", bearer(token)))
           .andExpect(status().isOk());

        mvc.perform(post("/api/auth/logout").header("Authorization", bearer(token)))
           .andExpect(status().isNoContent());

        mvc.perform(get("/api/auth/me").header("Authorization", bearer(token)))
           .andExpect(status().isUnauthorized());
    }
}
