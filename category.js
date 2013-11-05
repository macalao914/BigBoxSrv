var Category = function(name) {
	this.cid = "";
	this.cname = name;
	this.subcategory = new Array();
	this.setSubCategory = function(subcategory) {
		this.subcategory.push(new Category(subcategory));
		return this;
	};
	this.getSubCategory = function(pos) {
		return this.subcategory[pos];
	};
	this.showSubCategory = function(pos) {
		return JSON.stringify(this.subcategory[pos]);
	};
};

module.exports = Category;