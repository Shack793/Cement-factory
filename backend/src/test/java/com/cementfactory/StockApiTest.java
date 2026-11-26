package com.cementfactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class StockApiTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    private long storeId(String code) throws Exception {
        JsonNode stores = json.readTree(mvc.perform(get("/api/stores")).andReturn().getResponse().getContentAsString());
        for (JsonNode s : stores) if (code.equals(s.get("code").asText())) return s.get("id").asLong();
        throw new IllegalStateException("store " + code);
    }

    private long itemId(String code) throws Exception {
        JsonNode items = json.readTree(mvc.perform(get("/api/items")).andReturn().getResponse().getContentAsString());
        for (JsonNode i : items) if (code.equals(i.get("code").asText())) return i.get("id").asLong();
        throw new IllegalStateException("item " + code);
    }

    private String body(Object... kv) throws Exception {
        java.util.Map<String, Object> m = new java.util.LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) m.put((String) kv[i], kv[i + 1]);
        return json.writeValueAsString(m);
    }

    @Test
    void storesAreSeededWithBalances() throws Exception {
        mvc.perform(get("/api/stores")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(8));
    }

    @Test
    void cannotIssueMoreThanBalance() throws Exception {
        mvc.perform(post("/api/stock/issues").contentType(MediaType.APPLICATION_JSON)
                        .content(body("storeId", storeId("RAW-YARD"), "itemId", itemId("GYPSUM"), "quantity", 9999)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", containsString("Insufficient stock")));
    }

    @Test
    void siloHoldsOneGradeOnly() throws Exception {
        mvc.perform(post("/api/stock/receipts").contentType(MediaType.APPLICATION_JSON)
                        .content(body("storeId", storeId("SILO-425"), "itemId", itemId("CLINKER"), "quantity", 1)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", containsString("holds only")));
    }

    @Test
    void siloCapacityIsEnforced() throws Exception {
        mvc.perform(post("/api/stock/receipts").contentType(MediaType.APPLICATION_JSON)
                        .content(body("storeId", storeId("SILO-325"), "itemId", itemId("CEM325R-BULK"), "quantity", 500)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", containsString("capacity exceeded")));
    }

    @Test
    void transferCreatesTwoLegs() throws Exception {
        mvc.perform(post("/api/stock/transfers").contentType(MediaType.APPLICATION_JSON)
                        .content(body("fromStoreId", storeId("RAW-YARD"), "toStoreId", storeId("MFG-ROOM"),
                                "itemId", itemId("CLINKER"), "quantity", 5)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].type").value("TRANSFER_OUT"))
                .andExpect(jsonPath("$[1].type").value("TRANSFER_IN"));
    }

    @Test
    void largeAdjustmentWaitsForApproval() throws Exception {
        // 10 MT = 10,000 kg is above the 5,000 kg approval limit
        mvc.perform(post("/api/stock/adjustments").contentType(MediaType.APPLICATION_JSON)
                        .content(body("storeId", storeId("RAW-YARD"), "itemId", itemId("FLYASH"), "quantity", -10, "reasonCode", "count_diff")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.reasonCode").value("COUNT_DIFF"));
    }

    @Test
    void adjustmentNeedsReason() throws Exception {
        mvc.perform(post("/api/stock/adjustments").contentType(MediaType.APPLICATION_JSON)
                        .content(body("storeId", storeId("RAW-YARD"), "itemId", itemId("FLYASH"), "quantity", -1)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.details.reasonCode").exists());
    }
}
