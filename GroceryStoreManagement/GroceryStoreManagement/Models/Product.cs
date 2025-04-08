namespace GroceryStoreManagement.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal PricePerUnit { get; set; }
        public int MinQuantity { get; set; }

        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; }
    }
}