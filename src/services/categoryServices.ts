import db from '@/db';

const addCategory = async (name: string, path: string, description?: string) => {
  try {
    const category = await db.categories.create({ data: { name, path, description: description || '' } });
    return category;
  } catch (error) {
    throw new Error('Error while addding category');
  }
};

export default {
  addCategory,
};
