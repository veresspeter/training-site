package hu.redriver.web.utils;

import io.github.jhipster.web.util.HeaderUtil;
import org.springframework.http.HttpHeaders;

public class CustomHeaderUtil {
    public static HttpHeaders createEntityCreationAlert(String applicationName, boolean enableTranslation, String entityName, String id, String param) {
        String message = enableTranslation ? applicationName + "." + entityName + ".created" : param + " " + entityName + " sikeresen létrehozva";
        return HeaderUtil.createAlert(applicationName, message, id);
    }

    public static HttpHeaders createEntityUpdateAlert(String applicationName, boolean enableTranslation, String entityName, String id, String param) {
        String message = enableTranslation ? applicationName + "." + entityName + ".updated" : param + " " + entityName + " sikeresen frissítve";
        return HeaderUtil.createAlert(applicationName, message, id);
    }

    public static HttpHeaders createEntityDeletionAlert(String applicationName, boolean enableTranslation, String entityName, String id) {
        String message = enableTranslation ? applicationName + "." + entityName + ".deleted" : entityName + " sikeresen törölve";
        return HeaderUtil.createAlert(applicationName, message, id);
    }

    public static HttpHeaders createCustomFailureAlert(String applicationName, String entityName, String message) {
        return HeaderUtil.createFailureAlert(applicationName, false, entityName, null, message);
    }
}
