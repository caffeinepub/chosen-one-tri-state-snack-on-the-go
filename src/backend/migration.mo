import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";

module {
  type OldOrder = {
    id : Nat;
    customerName : Text;
    customerEmail : Text;
    customerAddress : Text;
    items : [CartItem];
    totalAmount : Nat;
  };

  type CartItem = {
    item : SnackItem;
    quantity : Nat;
  };

  type SnackItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    image : Storage.ExternalBlob;
  };

  type OldActor = {
    nextOrderId : Nat;
    catalog : Map.Map<Text, SnackItem>;
    carts : Map.Map<Text, [CartItem]>;
    orders : Map.Map<Nat, OldOrder>;
  };

  type NewOrder = {
    id : Nat;
    customerName : Text;
    customerEmail : Text;
    customerAddress : Text;
    customerPhone : Text;
    items : [CartItem];
    totalAmount : Nat;
  };

  type BankAccount = {
    accountHolderName : Text;
    bankName : Text;
    accountNumber : Text;
    routingNumber : Text;
  };

  type NewActor = {
    nextOrderId : Nat;
    catalog : Map.Map<Text, SnackItem>;
    carts : Map.Map<Text, [CartItem]>;
    orders : Map.Map<Nat, NewOrder>;
    bankAccounts : Map.Map<Text, BankAccount>;
  };

  public func run(old : OldActor) : NewActor {
    let newOrders = old.orders.map<Nat, OldOrder, NewOrder>(
      func(_id, oldOrder) {
        {
          oldOrder with
          customerPhone = "Unknown"
        };
      }
    );

    {
      old with
      orders = newOrders;
      bankAccounts = Map.empty<Text, BankAccount>();
    };
  };
};
