using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GroceryStoreManagement.Models;
using GroceryStoreManagement.DTOs;
using GroceryStoreManagement.Enums;

namespace GroceryStoreManagement.Controllers
{
    [ApiController]
    [Route("api/suppliers")]
    public class SupplierController : ControllerBase
    {
        private readonly GroceryStoreDbContext _context;

        public SupplierController(GroceryStoreDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] SupplierRegistrationDto dto)
        {
            var existingSupplier = await _context.Suppliers
                .FirstOrDefaultAsync(s => s.CompanyName == dto.CompanyName);

            if (existingSupplier != null)
            {
                return BadRequest($"A supplier with the company name '{dto.CompanyName}' already exists.");
            }

            var supplier = new Supplier
            {
                CompanyName = dto.CompanyName,
                PhoneNumber = dto.PhoneNumber,
                RepresentativeName = dto.RepresentativeName,
            };

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync(); 

            var products = dto.Products.Select(p => new Product
            {
                Name = p.Name,
                PricePerUnit = p.PricePerUnit,
                MinQuantity = p.MinQuantity,
                SupplierId = supplier.Id
            }).ToList();

            _context.Products.AddRange(products);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                SupplierId = supplier.Id,
                supplier.CompanyName,
                supplier.PhoneNumber,
                supplier.RepresentativeName,
                Products = products
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var supplier = await _context.Suppliers
                .Include(s => s.Products)
                .FirstOrDefaultAsync(s => s.CompanyName == dto.CompanyName);

            if (supplier == null)
                return NotFound("Supplier not found");

            return Ok(supplier);
        }
    }
}
