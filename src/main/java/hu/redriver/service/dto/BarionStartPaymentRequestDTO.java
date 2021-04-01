package hu.redriver.service.dto;

public class BarionStartPaymentRequestDTO {
    private String POSKey;
    private String PaymentType = "Immediate";
    private Boolean GuestCheckOut = true;
    private String[] FundingSources = new String[]{"All"};
    private String PaymentRequestId;
    private String PayerHint;
    private String CardHolderNameHint;
    private String redirectUrl;
    private String CallbackUrl;
    private BarionPaymentTransactionDTO[] Transactions;
    private String Locale = "hu-HU";
    private String Currency = "HUF";
    private String PaymentWindow = "0.00:05:00";

    public String getPOSKey() {
        return POSKey;
    }

    public void setPOSKey(String POSKey) {
        this.POSKey = POSKey;
    }

    public String getPaymentType() {
        return PaymentType;
    }

    public void setPaymentType(String paymentType) {
        PaymentType = paymentType;
    }

    public Boolean getGuestCheckOut() {
        return GuestCheckOut;
    }

    public void setGuestCheckOut(Boolean guestCheckOut) {
        GuestCheckOut = guestCheckOut;
    }

    public String[] getFundingSources() {
        return FundingSources;
    }

    public void setFundingSources(String[] fundingSources) {
        FundingSources = fundingSources;
    }

    public String getPaymentRequestId() {
        return PaymentRequestId;
    }

    public void setPaymentRequestId(String paymentRequestId) {
        PaymentRequestId = paymentRequestId;
    }

    public String getPayerHint() {
        return PayerHint;
    }

    public void setPayerHint(String payerHint) {
        PayerHint = payerHint;
    }

    public String getCardHolderNameHint() {
        return CardHolderNameHint;
    }

    public void setCardHolderNameHint(String cardHolderNameHint) {
        CardHolderNameHint = cardHolderNameHint;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public String getCallbackUrl() {
        return CallbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        CallbackUrl = callbackUrl;
    }

    public BarionPaymentTransactionDTO[] getTransactions() {
        return Transactions;
    }

    public void setTransactions(BarionPaymentTransactionDTO[] transactions) {
        Transactions = transactions;
    }

    public String getLocale() {
        return Locale;
    }

    public void setLocale(String locale) {
        Locale = locale;
    }

    public String getCurrency() {
        return Currency;
    }

    public void setCurrency(String currency) {
        Currency = currency;
    }

    public String getPaymentWindow() {
        return PaymentWindow;
    }

    public void setPaymentWindow(String paymentWindow) {
        PaymentWindow = paymentWindow;
    }
}
