const Tag = require('../models/tag.model');

const addNewTag = async (tagName) => {
    try {
        const existingTag = await Tag.findOne({ name: tagName });
        if (existingTag) {
            throw new Error('Tag already exists');
        }

        const newTag = new Tag({ name: tagName });
        await newTag.save();

        return newTag;
    } catch (error) {
        console.error(error);
        throw new Error('Error creating tag');
    }
};

module.exports = {
    addNewTag,
};
