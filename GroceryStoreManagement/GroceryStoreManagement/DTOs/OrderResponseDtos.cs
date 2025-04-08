using GroceryStoreManagement.Enums;

namespace GroceryStoreManagement.DTOs
{
    public class OrderResponseDto
    {
        public int Id { get; set; }  
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public OrderStatus Status { get; set; }
    }
}


