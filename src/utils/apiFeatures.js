const qs = require("qs");

class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString || {};
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "checkIn",
      "checkOut",
    ];

    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = qs.parse(queryObj);

    queryStr = JSON.stringify(queryStr)

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in|not|nin|ne)\b/g,
      (match) => `$${match}`,
    );

    const parsedQuery = JSON.parse(queryStr);    

    this.mongooseQuery = this.mongooseQuery.find(parsedQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(searchFields = []) {
    const searchTerm = this.queryString.search?.trim();
    if (!searchTerm || !searchFields.length) return this;

    const regex = new RegExp(searchTerm, "i");
    this.mongooseQuery = this.mongooseQuery.find({
      $or: searchFields.map((field) => ({ [field]: regex })),
    });
    return this;
  }

  pagination(documentsCount) {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 20;
    if (page < 1) page = 1;
    if (limit < 1) limit = 50;
    if (limit > 100) limit = 100;
    if (limit > documentsCount && documentsCount <= 100) limit = documentsCount;
    if ((page - 1) * limit >= documentsCount)
      page = Math.ceil(documentsCount / limit);
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const pagination = {};
    pagination.currentPage = parseInt(page);
    pagination.limit = parseInt(limit);
    pagination.totalPages = Math.ceil(documentsCount / limit);
    if (endIndex < documentsCount) {
      pagination.next = Number(page) + 1;
    }
    if (skip > 0) {
      pagination.prev = Number(page) - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;