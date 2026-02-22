import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type SnackItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat; // Price in cents
    image : Storage.ExternalBlob;
  };

  type CartItem = {
    item : SnackItem;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    customerEmail : Text;
    customerAddress : Text;
    items : [CartItem];
    totalAmount : Nat;
  };

  var nextOrderId = 0;
  let catalog = Map.empty<Text, SnackItem>();
  let carts = Map.empty<Text, [CartItem]>();
  let orders = Map.empty<Nat, Order>();

  public shared ({ caller }) func addSnackItem(id : Text, name : Text, description : Text, price : Nat, image : Storage.ExternalBlob) : async () {
    let snackItem : SnackItem = {
      id;
      name;
      description;
      price;
      image;
    };
    catalog.add(id, snackItem);
  };

  public query ({ caller }) func getSnackItem(id : Text) : async ?SnackItem {
    catalog.get(id);
  };

  public query ({ caller }) func getAllSnackItems() : async [SnackItem] {
    catalog.values().toArray();
  };

  public shared ({ caller }) func addToCart(userId : Text, itemId : Text, quantity : Nat) : async () {
    if (quantity == 0) { Runtime.trap("Quantity must be greater than 0") };

    let item = switch (catalog.get(itemId)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) { item };
    };

    let currentCart = switch (carts.get(userId)) {
      case (null) { [] };
      case (?cart) { cart };
    };

    var itemAdded = false;
    let updatedCart : [CartItem] = currentCart.map<CartItem, CartItem>(
      func(cartItem) {
        if (cartItem.item.id == itemId) {
          itemAdded := true;
          { cartItem with quantity = cartItem.quantity + quantity };
        } else {
          cartItem;
        };
      }
    );

    let finalCart = if (itemAdded) {
      updatedCart;
    } else {
      updatedCart.concat([{ item; quantity }]);
    };

    carts.add(userId, finalCart);
  };

  public query ({ caller }) func getCart(userId : Text) : async [CartItem] {
    switch (carts.get(userId)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func checkout(userId : Text, customerName : Text, customerEmail : Text, customerAddress : Text) : async Nat {
    let cart = switch (carts.get(userId)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    if (cart.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    let totalAmount = cart.foldLeft(0, func(acc, item) { acc + (item.item.price * item.quantity) });

    let order : Order = {
      id = nextOrderId;
      customerName;
      customerEmail;
      customerAddress;
      items = cart;
      totalAmount;
    };

    orders.add(nextOrderId, order);
    carts.remove(userId);
    nextOrderId += 1;
    order.id;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    orders.get(orderId);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };
};
