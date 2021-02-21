package hu.redriver.web.utils;

import io.github.jhipster.web.util.HeaderUtil;
import org.springframework.http.HttpHeaders;

public class CustomHeaderUtil {
    public static HttpHeaders createEntityCreationAlert(String applicationName, boolean enableTranslation, String entityName, String id, String param) {
        String message = enableTranslation ? applicationName + "." + entityName + ".created" : param + " " + entityName + " sikeresen letrehozva";
        return HeaderUtil.createAlert(applicationName, message, id);
    }

    public static HttpHeaders createEntityUpdateAlert(String applicationName, boolean enableTranslation, String entityName, String id, String param) {
        String message = enableTranslation ? applicationName + "." + entityName + ".updated" : param + " " + entityName + " sikeresen frissitve";
        return HeaderUtil.createAlert(applicationName, message, id);
    }

    public static HttpHeaders createEntityDeletionAlert(String applicationName, boolean enableTranslation, String entityName, String id) {
        String message = enableTranslation ? applicationName + "." + entityName + ".deleted" : entityName + " sikeresen torolve";
        return HeaderUtil.createAlert(applicationName, message, id);
    }
}
