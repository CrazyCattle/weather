class storeService {
  constructor($resource) {
    this.resource = $resource;
    this.shoppingList = new Map();
  }
  getGoodsList() {
    return this.resource('http://wechatapi.oneband.life/shop/ware/list').get().$promise;
  }
  setShoppingList(id) {
    if (!this.shoppingList.has(id)) {
      this.shoppingList.set(id, 1);
    } else {
      this.shoppingList.set(id, this.shoppingList.get(id) + 1);
    }
  }
  resetShoppingList() {
    for (const [key, value] of this.shoppingList) {
      this.shoppingList.set(key, 0);
    }
  }
  getShoppingList() {
    return this.shoppingList;
  }
}

export default storeService;
