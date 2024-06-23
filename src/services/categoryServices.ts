import db from '@/db';

const addCategory = async (name: string, path: string, description?: string) => {
  try {
    const category = await db.category.create({ data: { name, path, description: description || '' } });
    return category;
  } catch (error) {
    throw new Error('Error while adding category');
  }
};

const getCategoryByName = async (name: string) => {
  try {
    const category = await db.category.findUnique({ where: { name } });
    return category;
  } catch (error) {
    throw new Error('Error while checking category existence');
  }
};

const getCategories = async () => {
  try {
    const categoriesDetails = await db.category.findMany();

    const categories = categoriesDetails.map((category) => ({
      id: category.id,
      name: category.name,
      path: category.path,
      description: category.description,
    }));

    return categories;
  } catch (error) {
    throw new Error('Error while getting categories');
  }
};

export default {
  addCategory,
  getCategoryByName,
  getCategories,
};
