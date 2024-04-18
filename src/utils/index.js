"use strict"

const _ = require("lodash")
const slugify = require("slugify")
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}
const generateUniqueProductSlug = async (product_slug, productRepository) => {
    let baseSlug = slugify(product_slug, { lower: true })
    let slug = baseSlug
    let suffix = 1
    while (await productRepository.findBySlug({ slug })) {
        slug = `${baseSlug}-${suffix}`
        suffix++
    }
    return slug
}
const checkProductExists = async (product_id, productRepository) => {
    const product = await productRepository.findById({ product_id })
    return product ? true : false
}

module.exports = { getInfoData, generateUniqueProductSlug, checkProductExists }
