import db from '@/db';

const getCategoryByName = async (name: string) => {
  try {
    const category = await db.category.findUnique({ where: { name } });
    return category;
  } catch (error) {
    throw new Error('Error while checking category existence');
  }
};

const addCategory = async (name: string, path: string, description: string = '') => {
  try {
    if (await getCategoryByName(name)) {
      throw new Error('Category already exists');
    }

    const category = await db.category.create({ data: { name, path, description } });
    return category;
  } catch (error) {
    throw new Error('Error while adding category');
  }
};

const getCategories = async () => {
  try {
    const categories = await db.category.findMany({
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

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
