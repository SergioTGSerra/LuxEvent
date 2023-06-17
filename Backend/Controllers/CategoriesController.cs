using Microsoft.AspNetCore.Mvc;
using BusinessLogic.Entities;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoriesController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        [Authorize(Roles = "User,Organizer,Admin")]
        public async Task<ActionResult<List<Category>>> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategories();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "User,Organizer,Admin")]
        public async Task<ActionResult<Category>> GetCategoryById(Guid id)
        {
            var category = await _categoryService.GetCategoryById(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Category>> CreateCategory(Category category)
        {
            var createdCategory = await _categoryService.CreateCategory(category);
            return CreatedAtAction(nameof(GetCategoryById), new { id = createdCategory.Id }, createdCategory);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Category>> UpdateCategory(Guid id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }
            var existingCategory = await _categoryService.GetCategoryById(id);
            if (existingCategory == null)
            {
                return NotFound();
            }
            var updatedCategory = await _categoryService.UpdateCategory(category);
            return Ok(updatedCategory);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var existingCategory = await _categoryService.GetCategoryById(id);
            if (existingCategory == null)
            {
                return NotFound();
            }
            await _categoryService.DeleteCategory(id);
            return NoContent();
        }
    }

}