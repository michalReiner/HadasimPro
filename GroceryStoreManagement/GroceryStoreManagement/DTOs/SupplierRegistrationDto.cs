namespace GroceryStoreManagement.DTOs
{
    public class SupplierRegistrationDto
    {
        public string CompanyName { get; set; }
        public string PhoneNumber { get; set; }
        public string RepresentativeName { get; set; }
        public List<ProductDto> Products { get; set; }
    }
}
