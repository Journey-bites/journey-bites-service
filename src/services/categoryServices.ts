import db from '@/db';

const addCategory = async (name: string, path: string, description?: string) => {
  try {
    const category = await db.categories.create({ data: { name, path, description: description || '' } });
    return category;
  } catch (error) {
    throw new Error('Error while adding category');
  }
};

const getCategories = async () => {
  try {
    return await db.categories.findMany();
  } catch (error) {
    throw new Error('Error while fetching categories');
  }
};

export default {
  addCategory,
  getCategories,
};
