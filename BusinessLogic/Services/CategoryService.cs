
using BusinessLogic.Context;
using BusinessLogic.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class CategoryService
{
    private readonly ES2DbContext _dbContext;

    public CategoryService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Category>> GetAllCategories()
    {
        return await _dbContext.Categories.ToListAsync();
    }

    public async Task<Category> GetCategoryById(Guid id)
    {
        return await _dbContext.Categories.FindAsync(id);
    }

    public async Task<Category> CreateCategory(Category category)
    {
        category.Id = Guid.NewGuid();
        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync();
        return category;
    }

    public async Task<Category> UpdateCategory(Category category)
    {
        var existingCategory = await _dbContext.Categories.FindAsync(category.Id);

        if (existingCategory == null)
        {
            // Categoria não encontrada
            return null;
        }

        // Atualiza os campos relevantes
        existingCategory.Name = category.Name;

        // Salva as alterações no banco de dados
        await _dbContext.SaveChangesAsync();

        return existingCategory;
    }

    public async Task DeleteCategory(Guid id)
    {
        var category = await _dbContext.Categories.FindAsync(id);
        if (category != null)
        {
            _dbContext.Categories.Remove(category);
            await _dbContext.SaveChangesAsync();
        }
    }
}