using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GroceryStoreManagement.Models;
using GroceryStoreManagement.DTOs;
using GroceryStoreManagement.Enums;


namespace GroceryStoreManagement.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly GroceryStoreDbContext _context;

        public OrderController(GroceryStoreDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto dto)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Name == dto.Name);

            if (product == null)
                return NotFound("Product not found");

            if (dto.Quantity < product.MinQuantity)
            {
                return BadRequest($"Quantity is too low. Minimum required is {product.MinQuantity} units for product '{product.Name}'.");
            }
            var order = new Order
            {
                ProductId = product.Id,
                Quantity = dto.Quantity,
                OrderDate = DateTime.Now,
                Status = OrderStatus.New
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var response = new OrderResponseDto
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Quantity = order.Quantity,
                Status = order.Status
            };

            return Ok(response);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
            .Include(o => o.Product)
            .ThenInclude(p => p.Supplier)
            .Select(o => new OrderResponseDto
            {
                ProductId = o.ProductId,
                ProductName = o.Product.Name,
                Quantity = o.Quantity,
                Status = o.Status
            })
            .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("GroceryOwner")]
        public async Task<IActionResult> GetOrdersBySupplier(int supplierId)
        {
            var orders = await _context.Orders
                .Include(o => o.Product)
                .ThenInclude(p => p.Supplier)
                .Where(o => o.Product.SupplierId == supplierId)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id,
                    ProductId = o.ProductId,
                    ProductName = o.Product.Name,
                    Quantity = o.Quantity,
                    Status = o.Status
                })
                .ToListAsync();

            return Ok(orders);
        }


        [HttpGet("ShowStatus")]
        public async Task<IActionResult> GetOrdersStatus()
        {
            var orders = await _context.Orders
                .OrderBy(o => o.Status) 
                .Select(o => new OrderStatusDto
                {
                    Id = o.Id,
                    Status = o.Status
                })
                .ToListAsync();

            return Ok(orders);
        }


        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = OrderStatus.InProcess;
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            if (order.Status != OrderStatus.InProcess)
            {
                return BadRequest("You can only complete orders that are in 'InProcess' status.");
            }
            order.Status = OrderStatus.Completed;
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}
