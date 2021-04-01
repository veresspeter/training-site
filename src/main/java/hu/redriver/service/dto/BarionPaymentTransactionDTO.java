package hu.redriver.service.dto;

public class BarionPaymentTransactionDTO {
    private String POSTransactionId;
    private String Payee;
    private Integer Total;
    private BarionItemDTO[] Items;

    public String getPOSTransactionId() {
        return POSTransactionId;
    }

    public void setPOSTransactionId(String POSTransactionId) {
        this.POSTransactionId = POSTransactionId;
    }

    public String getPayee() {
        return Payee;
    }

    public void setPayee(String payee) {
        Payee = payee;
    }

    public Integer getTotal() {
        return Total;
    }

    public void setTotal(Integer total) {
        Total = total;
    }

    public BarionItemDTO[] getItems() {
        return Items;
    }

    public void setItems(BarionItemDTO[] items) {
        Items = items;
    }
}
