class Features {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,  // Provides regular expression capabilities for pattern matching strings in queries.
                $options: "i"                   // Case insensitivity to match upper and lower cases.
            }
        }
        :
        {

        }
        console.log("keyWord", keyword);
        this.query = this.query.find({...keyword});
        // console.log(this.query);
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove other fields for category
        const removeFields = ['keyword','page','limit'];

        removeFields.forEach((key) => delete queryCopy[key]);

        console.log(queryCopy);

        this.query = this.query.find({...queryCopy});
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        console.log(this.queryStr.page);

        // limit() -> The limit method returns the original string if its length is shorter than or equal to the given limit. 
        // Otherwise, the method cuts off the string value and returns a substring with a length of the given character limit.

        // skip() ->  The skip method is used to skip the given number of elements from collection and returns the remaining collection elements
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
};

module.exports = Features;