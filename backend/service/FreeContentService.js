import FreeContent from '../models/FreeContent.js';

class FreeContentService {
  async createContent(data) {
    const content = new FreeContent(data);
    return await content.save();
  }

  async getAllContent(options) {
    const { page, limit, search, sortBy, sortOrder, filters } = options;
    const skip = (page - 1) * limit;

    const query = { ...filters };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const contents = await FreeContent.find(query)
      .populate('freeQuiz')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await FreeContent.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { contents, total, page, pages };
  }

  async getContentById(id) {
    return await FreeContent.findById(id).populate('freeQuiz');
  }

  async updateContent(id, data) {
    return await FreeContent.findByIdAndUpdate(id, data, { new: true }).populate('freeQuiz');
  }

  async deleteContent(id) {
    return await FreeContent.findByIdAndDelete(id);
  }
}

export default FreeContentService;
