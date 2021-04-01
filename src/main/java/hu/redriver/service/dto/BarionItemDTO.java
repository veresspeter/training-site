package hu.redriver.service.dto;

public class BarionItemDTO {
    private String Name;
    private String Description;
    private Integer Quantity;
    private String Unit;
    private Integer UnitPrice;
    private Integer ItemTotal;

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public Integer getQuantity() {
        return Quantity;
    }

    public void setQuantity(Integer quantity) {
        Quantity = quantity;
    }

    public String getUnit() {
        return Unit;
    }

    public void setUnit(String unit) {
        Unit = unit;
    }

    public Integer getUnitPrice() {
        return UnitPrice;
    }

    public void setUnitPrice(Integer unitPrice) {
        UnitPrice = unitPrice;
    }

    public Integer getItemTotal() {
        return ItemTotal;
    }

    public void setItemTotal(Integer itemTotal) {
        ItemTotal = itemTotal;
    }
}
