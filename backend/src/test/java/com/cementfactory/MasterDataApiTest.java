package com.cementfactory;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MasterDataApiTest {
    @Autowired MockMvc mvc;

    @Test
    void palletIsFortyBagsAndTwoTonnes() throws Exception {
        mvc.perform(get("/api/units/convert").param("from", "BAG").param("to", "MT").param("qty", "40"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(2));
        mvc.perform(get("/api/units/convert").param("from", "PALLET").param("to", "BAG").param("qty", "1"))
                .andExpect(jsonPath("$.result").value(40));
    }

    @Test
    void seededCementItemsExist() throws Exception {
        mvc.perform(get("/api/items").param("type", "FINISHED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void duplicateItemCodeIsRejected() throws Exception {
        String body = "{\"code\":\"CLINKER\",\"name\":\"Dup\",\"type\":\"RAW_MATERIAL\",\"baseUnit\":\"MT\"}";
        mvc.perform(post("/api/items").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    @Test
    void validationErrorsAreReported() throws Exception {
        mvc.perform(post("/api/parties").contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"x\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.code").exists());
    }
}
